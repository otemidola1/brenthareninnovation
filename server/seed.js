const { User, Room } = require('./models');
const bcrypt = require('bcryptjs');

module.exports = async () => {
    const userCount = await User.count();
    if (userCount === 0) {
        const password = await bcrypt.hash('admin', 10);
        await User.create({
            name: 'Admin User',
            email: 'admin@brentharen.com',
            password: password,
            role: 'admin',
            phone: '000-000-0000'
        });
        console.log('Admin user created');
    }

    const roomCount = await Room.count();
    if (roomCount === 0) {
        await Room.bulkCreate([
            {
                name: 'Standard Double Room',
                type: 'Standard',
                price: 85000,
                guests: 2,
                image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
                description: 'A cozy double room perfect for couples or solo travelers. Features a queen-sized bed, en-suite bathroom, and work desk.'
            },
            {
                name: 'Deluxe King Suite',
                type: 'Deluxe',
                price: 120000,
                guests: 2,
                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
                description: 'Spacious king suite with a separate seating area, premium bedding, and panoramic views of the city.'
            },
            {
                name: 'Family Apartment',
                type: 'Suite',
                price: 180000,
                guests: 4,
                image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
                description: 'Perfect for families, this apartment features two bedrooms, a kitchenette, and a comfortable living area.'
            },
            {
                name: 'Executive Studio',
                type: 'Executive',
                price: 150000,
                guests: 2,
                image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                description: 'Modern studio designed for business travelers, offering high-speed unique internet, dedicated workspace, and lounge access.'
            }
        ]);
        console.log('Rooms seeded');
    }
};
