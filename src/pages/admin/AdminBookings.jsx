import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const data = await api.getBookings();
            setBookings(data);
        };
        fetchBookings();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.updateBooking(id, { status });
            const data = await api.getBookings(); // re-fetch
            setBookings(data);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCheckIn = async (id) => {
        try {
            await api.checkInBooking(id);
            const data = await api.getBookings();
            setBookings(data);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCheckOut = async (id) => {
        try {
            await api.checkOutBooking(id);
            const data = await api.getBookings();
            setBookings(data);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h1 className="page-title">Manage Bookings</h1>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Room Type</th>
                            <th>Dates</th>
                            <th>Guests</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id}>
                                <td>#{booking.id}</td>
                                <td>{booking.userId}</td>
                                <td>{booking.roomType}</td>
                                <td>
                                    <div>{booking.checkIn} - {booking.checkOut}</div>
                                    {booking.realCheckInTime && <div style={{ fontSize: '0.8em', color: 'green' }}>In: {new Date(booking.realCheckInTime).toLocaleString()}</div>}
                                    {booking.realCheckOutTime && <div style={{ fontSize: '0.8em', color: 'red' }}>Out: {new Date(booking.realCheckOutTime).toLocaleString()}</div>}
                                </td>
                                <td>{booking.guests}</td>
                                <td>
                                    <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                                </td>
                                <td>
                                    {booking.status === 'pending' && (
                                        <>
                                            <button onClick={() => updateStatus(booking.id, 'confirmed')} className="action-btn btn-approve">Approve</button>
                                            <button onClick={() => updateStatus(booking.id, 'cancelled')} className="action-btn btn-reject">Reject</button>
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <>
                                            <button onClick={() => handleCheckIn(booking.id)} className="action-btn btn-approve">Check In</button>
                                            <button onClick={() => updateStatus(booking.id, 'cancelled')} className="action-btn btn-reject">Cancel</button>
                                        </>
                                    )}
                                    {booking.status === 'checked-in' && (
                                        <button onClick={() => handleCheckOut(booking.id)} className="action-btn btn-reject">Check Out</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', color: '#6B7280' }}>No bookings found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;
