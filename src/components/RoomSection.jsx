import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wifi, Coffee, Wind, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './RoomSection.css';

const RoomSection = ({ room }) => {
    const { user } = useAuth();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const reserveUrl = user
        ? `/reservation?room=${room.id}${checkIn ? `&checkIn=${checkIn}` : ''}${checkOut ? `&checkOut=${checkOut}` : ''}`
        : `/login?redirect=${encodeURIComponent(`/reservation?room=${room.id}`)}`;

    return (
        <section className="room-section">
            <div className="room-section-image-wrap">
                <img src={room.image || ''} alt={room.name} loading="lazy" />
                <div className="room-section-price-badge">
                    ₦{(room.price ?? 0).toLocaleString()} <span>/ night</span>
                </div>
            </div>

            <div className="room-section-body">
                <h2 className="room-section-title">{room.name}</h2>
                <p className="room-section-description">
                    {room.description || 'A comfortable space designed for your stay.'}
                </p>

                <div className="room-section-amenities">
                    <span><Users size={20} /> {room.guests ?? 2} Guests</span>
                    <span><Wifi size={20} /> Wi-Fi</span>
                    <span><Coffee size={20} /> Breakfast</span>
                    <span><Wind size={20} /> Climate</span>
                </div>

                <div className="room-section-availability">
                    <div className="availability-field">
                        <label>Check-in</label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={new Date().toISOString().slice(0, 10)}
                        />
                    </div>
                    <div className="availability-field">
                        <label>Check-out</label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={checkIn || new Date().toISOString().slice(0, 10)}
                        />
                    </div>
                </div>

                <Link to={reserveUrl} className="room-section-cta">
                    {user ? 'Reserve Now' : 'Login to Reserve'} <ArrowRight size={20} />
                </Link>
            </div>
        </section>
    );
};

export default RoomSection;
