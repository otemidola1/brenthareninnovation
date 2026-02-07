const express = require('express');
const router = express.Router();
const { Booking, User, Room } = require('../models');
const { optionalAuth, requireAuth, requireAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sendEmail } = require('../services/emailService');
const { bookingConfirmationTemplate, cancellationTemplate } = require('../services/emailTemplates');

router.use(optionalAuth);

// List bookings (Admin: all, User: own)
router.get('/', async (req, res) => {
    try {
        const where = {};
        if (req.user && req.user.role !== 'admin') {
            where.UserId = req.user.id;
        } else if (req.query.userId) {
            where.UserId = req.query.userId;
        }

        const bookings = await Booking.findAll({
            where,
            include: [{ model: User, attributes: ['name', 'email'] }, { model: Room, attributes: ['name'] }]
        });

        // Flatten the response a bit to match frontend expectation
        const formatted = bookings.map(b => ({
            id: b.id,
            userId: b.UserId,
            // roomType is stored as string in our simple schema, but if we had relation:
            roomType: b.roomType || (b.Room ? b.Room.name : 'Unknown Room'),
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            guests: b.guests,
            status: b.status,
            user: b.User,
        }));

        res.json(formatted);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create booking (authenticated users only; UserId from token)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { roomType, checkIn, checkOut, guests, notes } = req.body;
        if (!roomType || !checkIn || !checkOut) {
            return res.status(400).json({ error: 'Room type, check-in and check-out are required' });
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: 'Check-out must be after check-in' });
        }
        if (checkInDate < new Date(new Date().setHours(0, 0, 0, 0))) {
            return res.status(400).json({ error: 'Check-in cannot be in the past' });
        }

        const room = await Room.findOne({
            where: { [Op.or]: [{ name: roomType }, { type: roomType }] }
        });
        if (!room) {
            return res.status(400).json({ error: 'Invalid room type' });
        }

        const overlapping = await Booking.findOne({
            where: {
                RoomId: room.id,
                status: { [Op.notIn]: ['cancelled'] },
                [Op.and]: [
                    { checkIn: { [Op.lt]: checkOut } },
                    { checkOut: { [Op.gt]: checkIn } }
                ]
            }
        });
        if (overlapping) {
            return res.status(409).json({ error: 'This room is not available for the selected dates' });
        }

        const booking = await Booking.create({
            checkIn,
            checkOut,
            guests: guests || 1,
            status: 'confirmed',
            roomType,
            RoomId: room.id,
            UserId: req.user.id
        });

        const fullBooking = await Booking.findByPk(booking.id, {
            include: [{ model: User }, { model: Room }]
        });

        const emailData = {
            id: fullBooking.id,
            firstName: req.body.firstName || req.user.name?.split(' ')[0] || 'Guest',
            roomType: fullBooking.roomType || room.name,
            checkIn: fullBooking.checkIn,
            checkOut: fullBooking.checkOut,
            guests: fullBooking.guests
        };

        const emailHtml = bookingConfirmationTemplate(emailData);
        const toEmail = req.body.email || req.user.email;
        if (toEmail) {
            await sendEmail(toEmail, 'Booking Confirmed - Brentharen Innovations', emailHtml);
        }

        res.status(201).json(booking);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update booking (Cancel, Confirm) - owner or admin
router.patch('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const isOwner = req.user && booking.UserId === req.user.id;
        const isAdmin = req.user && req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to update this booking' });
        }

        await booking.update(req.body);

        // Email on cancellation
        if (req.body.status === 'cancelled') {
            const fullBooking = await Booking.findByPk(booking.id, {
                include: [{ model: User }]
            });

            const emailData = {
                id: fullBooking.id,
                firstName: fullBooking.User?.name?.split(' ')[0] || 'Guest',
                roomType: fullBooking.roomType,
                checkIn: fullBooking.checkIn,
                checkOut: fullBooking.checkOut
            };

            // const emailHtml = cancellationTemplate(emailData);
            // await sendEmail(
            //    fullBooking.User?.email || 'guest@example.com', // fallback if no user email
            //   'Booking Cancelled - Brentharen Innovations',
            //   emailHtml
            // );
        }

        res.json(booking);
    } catch (e) {
        console.error("Update Error:", e);
        res.status(500).json({ error: 'Server error' });
    }
});

// Check-In (Admin/staff only)
router.post('/:id/check-in', requireAuth, requireAdmin, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Cannot check-in a cancelled booking' });
        }

        booking.status = 'checked-in';
        booking.realCheckInTime = new Date();
        await booking.save();

        res.json(booking);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Check-Out (Admin/staff only)
router.post('/:id/check-out', requireAuth, requireAdmin, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        booking.status = 'checked-out';
        booking.realCheckOutTime = new Date();
        await booking.save();

        // Mark room as dirty
        if (booking.RoomId) {
            const room = await Room.findByPk(booking.RoomId);
            if (room) {
                room.housekeepingStatus = 'dirty';
                await room.save();
            }
        }

        res.json(booking);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
