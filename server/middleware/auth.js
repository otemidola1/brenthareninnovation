const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

/**
 * Optional auth: attach user to req if valid token present; do not reject if missing.
 */
const optionalAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
        if (user) req.user = user;
    } catch (_) { /* ignore invalid token */ }
    next();
};

/**
 * Require auth: 401 if no valid token.
 */
const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = user;
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Require admin role. Use after requireAuth.
 */
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

module.exports = { optionalAuth, requireAuth, requireAdmin, JWT_SECRET };
