const express = require('express');
const router = express.Router();
const { SavedCard } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Get all saved cards for the authenticated user
router.get('/', async (req, res) => {
    try {
        const cards = await SavedCard.findAll({
            where: { UserId: req.user.id }
        });
        res.json(cards);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new card
router.post('/', async (req, res) => {
    try {
        const { last4, brand, token, expiryMonth, expiryYear } = req.body;

        if (!last4 || !token) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const count = await SavedCard.count({ where: { UserId: req.user.id } });
        const isDefault = count === 0;

        const card = await SavedCard.create({
            UserId: req.user.id,
            last4,
            brand,
            token,
            expiryMonth,
            expiryYear,
            isDefault
        });

        res.json(card);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a card (own cards only)
router.delete('/:id', async (req, res) => {
    try {
        const card = await SavedCard.findOne({ where: { id: req.params.id, UserId: req.user.id } });
        if (!card) return res.status(404).json({ error: 'Card not found' });

        await card.destroy();
        res.json({ message: 'Card deleted' });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Set default card (own cards only)
router.post('/:id/default', async (req, res) => {
    try {
        const card = await SavedCard.findOne({ where: { id: req.params.id, UserId: req.user.id } });
        if (!card) return res.status(404).json({ error: 'Card not found' });

        await SavedCard.update(
            { isDefault: false },
            { where: { UserId: req.user.id, isDefault: true } }
        );

        // Set new default
        card.isDefault = true;
        await card.save();

        res.json(card);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
