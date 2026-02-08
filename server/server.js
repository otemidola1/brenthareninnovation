const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const cardRoutes = require('./routes/cards');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: allow frontend (Vercel/Render) and local dev
const frontendUrl = process.env.FRONTEND_URL;
const corsOptions = frontendUrl
    ? { origin: [frontendUrl, 'http://localhost:5173'], credentials: true }
    : {};
app.use(cors(corsOptions));
app.use(express.json());

// Health and root (no DB) so Render can detect live service
app.get('/health', (req, res) => res.status(200).json({ ok: true }));
app.get('/', (req, res) => res.status(200).json({ api: 'guesthouse', version: '1.0', health: '/health' }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many attempts, please try again later' }
});
app.use('/api/auth', authLimiter, authRoutes);

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cards', cardRoutes);

// Start HTTP server first so Render sees the service as "up", then sync DB
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
    runDbSync();
});

async function runDbSync() {
    const maxAttempts = 5;
    const delayMs = 4000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await sequelize.authenticate();
            console.log('Database connection OK');
            await sequelize.sync({ alter: true });
            console.log('Database synced');
            await require('./seed')();
            console.log('Seed complete');
            return;
        } catch (err) {
            console.error(`Database attempt ${attempt}/${maxAttempts}:`, err.message);
            if (attempt === maxAttempts) {
                console.error('Failed to sync database or seed after retries:', err);
                process.exit(1);
            }
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
}
