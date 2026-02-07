import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Clock } from 'lucide-react';

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user) {
                const data = await api.getBookings(user.id);
                setBookings(data);
            }
            setLoading(false);
        };
        fetchBookings();
    }, [user]);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    const openReviewModal = (booking) => {
        setSelectedBooking(booking);
        setReviewRating(5);
        setReviewComment('');
        setShowReviewModal(true);
    };

    const submitReview = async () => {
        try {
            await api.createReview({
                rating: reviewRating,
                comment: reviewComment,
                roomType: selectedBooking.roomType
            });
            setShowReviewModal(false);
            alert('Review submitted for approval!');
        } catch (error) {
            alert('Failed to submit review');
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            await api.updateBooking(id, { status: 'cancelled' });
            const data = await api.getBookings(user.id);
            setBookings(data);
        }
    };

    if (loading) return <div>Loading bookings...</div>;

    return (
        <div className="bookings-container">
            <h2>My Reservations</h2>
            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>You haven't made any reservations yet.</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className={`booking-card ${booking.status}`}>
                            <div className="booking-header">
                                <span className="booking-id">#{booking.id}</span>
                                <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                            </div>
                            <div className="booking-details">
                                <div className="detail-item">
                                    <Calendar size={16} />
                                    <span>{booking.checkIn} - {booking.checkOut}</span>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={16} />
                                    <span>Room Type: {booking.roomType}</span>
                                </div>
                                {booking.status === 'checked-out' && (
                                    <div style={{ marginTop: '10px' }}>
                                        <button onClick={() => openReviewModal(booking)} className="btn-text" style={{ color: '#C7E008', fontWeight: 'bold' }}>Write a Review</button>
                                    </div>
                                )}
                            </div>
                            {booking.status === 'confirmed' && (
                                <div className="booking-actions">
                                    <button className="btn-text text-danger" onClick={() => handleCancel(booking.id)}>Cancel</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedBooking && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Rate your stay</h3>
                        <div style={{ margin: '20px 0', fontSize: '24px', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} onClick={() => setReviewRating(star)} style={{ color: star <= reviewRating ? '#FFD700' : '#ddd' }}>★</span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Share your experience..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '20px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowReviewModal(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={submitReview} className="btn btn-primary">Submit Review</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
