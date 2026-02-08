const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const usePostgres = !!process.env.DATABASE_URL;

const sequelize = usePostgres
    ? new Sequelize(process.env.DATABASE_URL, {
          dialect: 'postgres',
          logging: false,
          dialectOptions: process.env.NODE_ENV === 'production' ? { ssl: { require: true, rejectUnauthorized: false } } : {}
      })
    : new Sequelize({
          dialect: 'sqlite',
          storage: path.join(__dirname, '../database.sqlite'),
          logging: false
      });

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'guest' },
    phone: { type: DataTypes.STRING },
    resetToken: { type: DataTypes.STRING },
    resetTokenExpiry: { type: DataTypes.DATE }
}, { indexes: [{ unique: true, fields: ['email'] }] });

const Room = sequelize.define('Room', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING }, // e.g. 'Standard', 'Deluxe'
    price: { type: DataTypes.INTEGER, allowNull: false },
    guests: { type: DataTypes.INTEGER, defaultValue: 2 },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING },
    housekeepingStatus: { type: DataTypes.STRING, defaultValue: 'clean' }, // clean, dirty, in_progress, out_of_service
    priority: { type: DataTypes.STRING, defaultValue: 'normal' }, // normal, high
    lastCleaned: { type: DataTypes.DATE },
    assignedTo: { type: DataTypes.STRING } // Staff name or ID
});

const Review = sequelize.define('Review', {
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: false },
    approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    roomType: { type: DataTypes.STRING } // Optional: link to room type
});

const SavedCard = sequelize.define('SavedCard', {
    last4: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false }, // Visa, MasterCard
    token: { type: DataTypes.STRING, allowNull: false }, // Tokenized sensitive data
    expiryMonth: { type: DataTypes.STRING, allowNull: false },
    expiryYear: { type: DataTypes.STRING, allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Booking = sequelize.define('Booking', {
    checkIn: { type: DataTypes.STRING, allowNull: false },
    checkOut: { type: DataTypes.STRING, allowNull: false },
    guests: { type: DataTypes.INTEGER, defaultValue: 1 },
    status: { type: DataTypes.STRING, defaultValue: 'confirmed' },
    roomType: { type: DataTypes.STRING },
    realCheckInTime: { type: DataTypes.DATE },
    realCheckOutTime: { type: DataTypes.DATE }
}, { indexes: [{ fields: ['UserId'] }, { fields: ['RoomId'] }, { fields: ['checkIn', 'checkOut'] }, { fields: ['status'] }] });

// Associations
User.hasMany(Booking);
Booking.belongsTo(User);

Room.hasMany(Booking);
Booking.belongsTo(Room);

User.hasMany(Review);
Review.belongsTo(User);

User.hasMany(SavedCard);
SavedCard.belongsTo(User);

module.exports = { sequelize, User, Room, Booking, Review, SavedCard };
