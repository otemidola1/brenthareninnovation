import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Coffee, Wind, Wifi, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './RoomDetailModal.css';

const RoomDetailModal = ({ room, onClose }) => {
    const { user } = useAuth();

    if (!room) return null;

    return (
        <div className="room-detail-overlay" onClick={onClose}>
            <div className="room-detail-modal" onClick={e => e.stopPropagation()}>
                <button type="button" className="room-detail-close" onClick={onClose} aria-label="Close">
                    <X size={24} />
                </button>

                <div className="room-detail-image-wrap">
                    <img src={room.image || ''} alt={room.name} />
                    <div className="room-detail-price-tag">
                        ₦{(room.price ?? 0).toLocaleString()}<span> / night</span>
                    </div>
                </div>

                <div className="room-detail-body">
                    <span className="room-detail-type">{room.type || 'Room'}</span>
                    <h2 className="room-detail-title">{room.name}</h2>

                    <div className="room-detail-meta">
                        <span><Users size={18} /> {room.guests ?? 2} Guests</span>
                        <span><Coffee size={18} /> Breakfast included</span>
                        <span><Wind size={18} /> Climate control</span>
                        <span><Wifi size={18} /> Wi-Fi</span>
                    </div>

                    <div className="room-detail-description">
                        <h3>About this room</h3>
                        <p>{room.description || 'A comfortable space designed for your stay.'}</p>
                    </div>

                    <div className="room-detail-actions">
                        {user ? (
                            <Link to={`/reservation?room=${room.id}`} className="btn btn-primary btn-reserve" onClick={onClose}>
                                Reserve this room
                            </Link>
                        ) : (
                            <Link to={`/login?redirect=${encodeURIComponent(`/reservation?room=${room.id}`)}`} className="btn btn-primary btn-reserve" onClick={onClose}>
                                Login to reserve
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailModal;
