/**
 * Mock API Service
 * Simulates backend database using LocalStorage
 */

const STORAGE_KEYS = {
    USERS: 'greenstay_users',
    ROOMS: 'greenstay_rooms',
    BOOKINGS: 'greenstay_bookings',
    CURRENT_USER: 'greenstay_auth_user'
};

// Initialize Data if empty
const initData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const adminUser = {
            id: 'admin-1',
            name: 'Admin User',
            email: 'admin@brentharen.com',
            password: 'admin', // In real app, hash this
            role: 'admin',
            phone: '000-000-0000'
        };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }
};

initData();

export const mockApi = {
    // Auth
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    const { password, ...userWithoutPass } = user;
                    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPass));
                    resolve(userWithoutPass);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    },

    register: async (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
                if (users.find(u => u.email === userData.email)) {
                    reject(new Error('Email already exists'));
                    return;
                }
                const newUser = { ...userData, id: Date.now().toString(), role: 'guest' };
                users.push(newUser);
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
                const { password, ...userWithoutPass } = newUser;
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPass));
                resolve(userWithoutPass);
            }, 500);
        });
    },

    logout: async () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return Promise.resolve();
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    },

    // Bookings
    getBookings: async () => {
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        return Promise.resolve(bookings);
    },

    getUserBookings: async (userId) => {
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        return Promise.resolve(bookings.filter(b => b.userId === userId));
    },

    createBooking: async (bookingData) => {
        // Simple availability check
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        // TODO: Add overlap logic here
        const newBooking = { ...bookingData, id: Date.now().toString(), status: 'confirmed' };
        bookings.push(newBooking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        return Promise.resolve(newBooking);
    },

    updateBooking: async (id, updates) => {
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index] = { ...bookings[index], ...updates };
            localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
            return Promise.resolve(bookings[index]);
        }
        return Promise.reject('Booking not found');
    }
};
