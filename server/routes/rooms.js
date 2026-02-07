const express = require('express');
const router = express.Router();
const { Room, Booking } = require('../models');
const { Op } = require('sequelize');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// list rooms (optional query: type, minPrice, maxPrice, guests)
router.get('/', async (req, res) => {
    try {
        const { type, minPrice, maxPrice, guests } = req.query;
        const where = {};
        if (type) where.type = type;
        if (minPrice != null) where.price = { ...where.price, [Op.gte]: parseInt(minPrice, 10) };
        if (maxPrice != null) where.price = { ...where.price, [Op.lte]: parseInt(maxPrice, 10) };
        if (guests != null) where.guests = { [Op.gte]: parseInt(guests, 10) };
        const rooms = await Room.findAll({ where });
        res.json(rooms);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Check availability for a room type and date range
router.get('/availability', async (req, res) => {
    try {
        const { roomType, checkIn, checkOut } = req.query;
        if (!roomType || !checkIn || !checkOut) {
            return res.status(400).json({ error: 'roomType, checkIn and checkOut are required' });
        }
        const room = await Room.findOne({
            where: { [Op.or]: [{ name: roomType }, { type: roomType }] }
        });
        if (!room) return res.json({ available: false, message: 'Room type not found' });

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
        res.json({ available: !overlapping });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// create room (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.json(room);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// get room details
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) return res.status(404).json({ error: 'Room not found' });
        res.json(room);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// update room (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        await room.update(req.body);
        res.json(room);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// delete room (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        await room.destroy();
        res.json({ message: 'Room deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
