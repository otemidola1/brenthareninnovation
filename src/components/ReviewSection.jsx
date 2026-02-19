import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Star } from 'lucide-react';

const ReviewSection = ({ limit }) => {
    const [reviews, setReviews] = useState([]);

    const MOCK_REVIEWS = [
        {
            id: 'mock-1',
            User: { name: 'Amaka Igwe' },
            rating: 5,
            comment: 'An absolute gem! The room was cleaner than I expected and the service was impeccable. Truly a home away from home.',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            id: 'mock-2',
            User: { name: 'David Okafor' },
            rating: 5,
            comment: 'Modern, clean, and very comfortable. The wifi speed was perfect for my remote work. Highly recommended!',
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
            id: 'mock-3',
            User: { name: 'Folake Adeyemi' },
            rating: 4,
            comment: 'The best stay I\'ve had in years. The breakfast was delicious and the staff were incredibly helpful.',
            createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
        }
    ];

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch only approved reviews
                const data = await api.getReviews(false, true);
                const reviewsToShow = data.length > 0 ? data : MOCK_REVIEWS;

                if (limit) {
                    setReviews(reviewsToShow.slice(0, limit));
                } else {
                    setReviews(reviewsToShow);
                }
            } catch (_) {
                setReviews(MOCK_REVIEWS.slice(0, limit || MOCK_REVIEWS.length));
            }
        };
        fetchReviews();
    }, [limit]);

    if (reviews.length === 0) return null;

    return (
        <div className="review-section">
            <h2 className="section-title">Guest Reviews</h2>
            <div className="reviews-grid">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <span className="review-author">{review.User?.name || 'Guest'}</span>
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < review.rating ? "#FFD700" : "none"}
                                        color={i < review.rating ? "#FFD700" : "#ddd"}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="review-comment">"{review.comment}"</p>
                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                ))}
            </div>

            <style>{`
                .review-section {
                    padding: 40px 20px;
                    background-color: #f9f9f9;
                }
                .section-title {
                    text-align: center;
                    margin-bottom: 30px;
                    color: #333;
                }
                .reviews-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .review-card {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    transition: transform 0.2s;
                }
                .review-card:hover {
                    transform: translateY(-5px);
                }
                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .review-author {
                    font-weight: bold;
                    color: #555;
                }
                .review-rating {
                    display: flex;
                }
                .review-comment {
                    color: #666;
                    font-style: italic;
                    margin-bottom: 10px;
                    line-height: 1.5;
                }
                .review-date {
                    font-size: 0.8em;
                    color: #999;
                }
            `}</style>
        </div>
    );
};

export default ReviewSection;
