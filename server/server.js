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

app.use(cors());
app.use(express.json());

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

// Sync Database and Start Server
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');
        return require('./seed')();
    })
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Network access available at http://<your-ip>:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database or seed:', err);
        process.exit(1);
    });
