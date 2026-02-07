const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
