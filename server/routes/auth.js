const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');
const { passwordResetTemplate } = require('../services/emailTemplates');
const { JWT_SECRET } = require('../middleware/auth');

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

function validatePassword(password) {
    if (password.length < PASSWORD_MIN_LENGTH) {
        return { valid: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
    }
    if (!PASSWORD_REGEX.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
    }
    return { valid: true };
}

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }
        const pwdCheck = validatePassword(password);
        if (!pwdCheck.valid) return res.status(400).json({ error: pwdCheck.message });

        const existingUser = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
        if (existingUser) return res.status(400).json({ error: 'An account with this email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            password: hashedPassword,
            phone: phone ? String(phone).trim() : null
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify Token (Me)
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone });
    } catch (e) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Change Password
router.post('/change-password', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }
        const pwdCheck = validatePassword(newPassword);
        if (!pwdCheck.valid) return res.status(400).json({ error: pwdCheck.message });

        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        res.json({ message: 'Password changed successfully' });
    } catch (e) {
        if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot Password Request
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Act as if sent to avoid enumeration
            return res.json({ message: 'If that email exists, a reset link has been sent.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        await user.update({ resetToken, resetTokenExpiry });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
        const emailHtml = passwordResetTemplate(resetLink);

        await sendEmail(email, 'Password Reset Request', emailHtml);

        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset Password Action
router.post('/reset-password', async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;
        if (!token || !email || !newPassword) {
            return res.status(400).json({ error: 'Token, email and new password are required' });
        }
        const pwdCheck = validatePassword(newPassword);
        if (!pwdCheck.valid) return res.status(400).json({ error: pwdCheck.message });

        const user = await User.findOne({ where: { email: String(email).trim().toLowerCase(), resetToken: token } });
        if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

        if (new Date() > new Date(user.resetTokenExpiry)) {
            return res.status(400).json({ error: 'Token has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        });

        res.json({ message: 'Password has been reset successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
