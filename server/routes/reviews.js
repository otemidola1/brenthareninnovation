const express = require('express');
const router = express.Router();
const { Review, User } = require('../models');
const { optionalAuth, requireAuth, requireAdmin } = require('../middleware/auth');

router.use(optionalAuth);

// Get all reviews (Public sees approved, Admin can filter)
router.get('/', async (req, res) => {
    try {
        const { approved } = req.query;
        const where = {};

        // If 'approved' query param is set, filter by it. 
        // Otherwise, default to showing only approved for public unless specific logic applied.
        // For simplicity: ?all=true shows all (admin), otherwise approved=true
        if (req.query.all !== 'true') {
            where.approved = true;
        }

        const reviews = await Review.findAll({
            where,
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create review (Authenticated user only)
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        const { rating, comment, roomType } = req.body;
        if (!rating || !comment || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating (1-5) and comment are required' });
        }

        const review = await Review.create({
            UserId: userId,
            rating: parseInt(rating, 10),
            comment: String(comment).trim(),
            roomType: roomType ? String(roomType).trim() : null,
            approved: false
        });

        res.status(201).json(review);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update review (Admin: approve/hide)
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        await review.update(req.body);
        res.json(review);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete review (Admin)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        await review.destroy();
        res.json({ message: 'Review deleted' });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
