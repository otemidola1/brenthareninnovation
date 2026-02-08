// In dev: use Vite proxy (/api). On Vercel: set VITE_API_URL to your Render API URL + /api
const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    // Auth
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const data = await res.json();
        localStorage.setItem('token', data.token);
        return data.user;
    },

    register: async (userData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const data = await res.json();
        localStorage.setItem('token', data.token);
        return data.user;
    },

    verifyToken: async () => {
        const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Invalid token');
        return await res.json();
    },

    logout: async () => {
        localStorage.removeItem('token');
        return Promise.resolve();
    },

    changePassword: async (currentPassword, newPassword) => {
        const res = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ currentPassword, newPassword })
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    forgotPassword: async (email) => {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    resetPassword: async (token, email, newPassword) => {
        const res = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, email, newPassword })
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    // Rooms
    getRooms: async (query = '') => {
        const url = query ? `${API_URL}/rooms${query.startsWith('?') ? query : `?${query}`}` : `${API_URL}/rooms`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load rooms');
        return res.json();
    },

    getRoom: async (id) => {
        const res = await fetch(`${API_URL}/rooms/${id}`);
        if (!res.ok) throw new Error('Room not found');
        return res.json();
    },

    checkAvailability: async (roomType, checkIn, checkOut) => {
        const params = new URLSearchParams({ roomType, checkIn, checkOut });
        const res = await fetch(`${API_URL}/rooms/availability?${params}`);
        if (!res.ok) throw new Error('Availability check failed');
        return res.json();
    },

    createRoom: async (roomData) => {
        const res = await fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(roomData)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    updateRoom: async (id, roomData) => {
        const res = await fetch(`${API_URL}/rooms/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(roomData)
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to update room');
        }
        return res.json();
    },

    deleteRoom: async (id) => {
        const res = await fetch(`${API_URL}/rooms/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    // Bookings
    createBooking: async (bookingData) => {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(bookingData)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    getBookings: async (userId = null) => {
        let url = `${API_URL}/bookings`;
        if (userId) url += `?userId=${userId}`;
        const res = await fetch(url, { headers: getHeaders() });
        return res.json();
    },

    updateBooking: async (id, updates) => {
        const res = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update');
        return res.json();
    },

    checkInBooking: async (id) => {
        const res = await fetch(`${API_URL}/bookings/${id}/check-in`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to check in');
        }
        return res.json();
    },

    checkOutBooking: async (id) => {
        const res = await fetch(`${API_URL}/bookings/${id}/check-out`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to check out');
        }
        return res.json();
    },

    // Reviews
    getReviews: async (all = false, approved = true) => {
        let url = `${API_URL}/reviews?`;
        if (all) url += 'all=true&';
        else if (approved) url += 'approved=true&';

        const res = await fetch(url);
        return res.json();
    },

    createReview: async (reviewData) => {
        const res = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(reviewData)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    updateReview: async (id, updates) => {
        const res = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update review');
        return res.json();
    },

    deleteReview: async (id) => {
        const res = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete review');
        return res.json();
    },

    // Cards (uses authenticated user)
    getCards: async () => {
        const res = await fetch(`${API_URL}/cards`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to load cards');
        return res.json();
    },

    addCard: async (cardData) => {
        const res = await fetch(`${API_URL}/cards`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(cardData)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    deleteCard: async (id) => {
        const res = await fetch(`${API_URL}/cards/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete card');
        return res.json();
    },

    setDefaultCard: async (id) => {
        const res = await fetch(`${API_URL}/cards/${id}/default`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to set default card');
        return res.json();
    },

    // Users
    getUsers: async () => {
        const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
        return res.json();
    }
};
