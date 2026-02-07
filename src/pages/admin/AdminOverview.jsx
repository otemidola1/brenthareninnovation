import React, { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, BedDouble } from 'lucide-react';
import { api } from '../../services/api';

const AdminOverview = () => {
    const [stats, setStats] = useState([
        { label: 'Total Bookings', value: '0', icon: <Calendar size={24} /> },
        { label: 'Total Guests', value: '0', icon: <Users size={24} /> },
        { label: 'Revenue', value: '₦0', icon: <DollarSign size={24} /> },
        { label: 'Rooms', value: '0', icon: <BedDouble size={24} /> },
    ]);
    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookings, rooms, users] = await Promise.all([
                    api.getBookings(),
                    api.getRooms(),
                    api.getUsers()
                ]);

                // Calculate Stats
                const totalRevenue = bookings.reduce((acc, b) => {
                    const room = rooms.find(r => r.name === b.roomType || r.type === b.roomType);
                    const price = room ? room.price : 100;
                    return acc + (b.status === 'confirmed' ? price : 0);
                }, 0);

                // Format revenue for display (e.g., 1.5M, 10M)
                const formatCompact = (num) => {
                    if (num >= 1000000000) return '₦' + (num / 1000000000).toFixed(1) + 'B';
                    if (num >= 1000000) return '₦' + (num / 1000000).toFixed(1) + 'M';
                    return '₦' + num.toLocaleString();
                };

                setStats([
                    { label: 'Total Bookings', value: bookings.length.toString(), icon: <Calendar size={24} /> },
                    { label: 'Total Guests', value: users.length.toString(), icon: <Users size={24} /> },
                    {
                        label: 'Revenue',
                        value: formatCompact(totalRevenue),
                        fullValue: `₦${totalRevenue.toLocaleString()}`, // Store full value for tooltip
                        icon: <DollarSign size={24} />
                    },
                    { label: 'Rooms', value: rooms.length.toString(), icon: <BedDouble size={24} /> },
                ]);

                setRecentBookings(bookings.slice(-5).reverse());
            } catch (e) {
                console.error("Failed to fetch dashboard data", e);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="page-title">Dashboard Overview</h1>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" title={stat.fullValue || ''}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-card">
                <h3>Recent Bookings</h3>
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Guest</th>
                                <th>Room</th>
                                <th>Dates</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>#{booking.id}</td>
                                    <td>{booking.user ? booking.user.name : booking.userId}</td>
                                    <td>{booking.roomType}</td>
                                    <td>{booking.checkIn} - {booking.checkOut}</td>
                                    <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
                                </tr>
                            ))}
                            {recentBookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: '#6B7280' }}>No bookings found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
