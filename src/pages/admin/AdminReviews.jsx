import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await api.getReviews(true); // all=true
            setReviews(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateReviewStatus = async (id, approved) => {
        try {
            await api.updateReview(id, { approved });
            fetchReviews();
        } catch (error) {
            alert('Failed to update review');
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.deleteReview(id);
            fetchReviews();
        } catch (error) {
            alert('Failed to delete review');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-page">
            <h1 className="page-title">Review Management</h1>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review.id}>
                                <td>#{review.id}</td>
                                <td>{review.User?.name || 'Unknown'}</td>
                                <td>{'★'.repeat(review.rating)}</td>
                                <td>{review.comment}</td>
                                <td>
                                    <span className={`status-badge ${review.approved ? 'confirmed' : 'pending'}`}>
                                        {review.approved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {!review.approved && (
                                        <button onClick={() => updateReviewStatus(review.id, true)} className="action-btn btn-approve">Approve</button>
                                    )}
                                    {review.approved && (
                                        <button onClick={() => updateReviewStatus(review.id, false)} className="action-btn btn-reject">Hide</button>
                                    )}
                                    <button onClick={() => deleteReview(review.id)} className="action-btn btn-reject" style={{ marginLeft: '5px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {reviews.length === 0 && (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No reviews found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReviews;
