import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Users, Maximize, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './RoomCard.css';

const RoomCard = ({ room }) => {
    const { user } = useAuth();
    return (
        <div className="room-card">
            <div className="room-image-container">
                <img src={room.image || ''} alt={room.name} className="room-image" loading="lazy" />
                <div className="room-price-badge">₦{(room.price ?? 0).toLocaleString()}<span>/night</span></div>
            </div>
            <div className="room-content">
                <h3 className="room-title">{room.name}</h3>
                <p className="room-description">{room.description}</p>

                <div className="room-meta">
                    <div className="meta-item">
                        <Users size={18} />
                        <span>{room.guests ?? 2} Guests</span>
                    </div>
                    {room.size && (
                        <div className="meta-item">
                            <Maximize size={18} />
                            <span>{room.size}</span>
                        </div>
                    )}
                    <div className="meta-item">
                        <Coffee size={18} />
                        <span>Breakfast</span>
                    </div>
                </div>

                {user ? (
                    <Link to={`/reservation?room=${room.id}`} className="btn btn-primary btn-block">
                        Reserve Now
                    </Link>
                ) : (
                    <Link to="/login" className="btn btn-secondary btn-block" style={{ textAlign: 'center', display: 'block', backgroundColor: '#e5e7eb', color: '#374151' }}>
                        Login to Reserve
                    </Link>
                )}
            </div>
        </div>
    );
};

export default RoomCard;
