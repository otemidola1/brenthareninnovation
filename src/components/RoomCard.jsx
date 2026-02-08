import React from 'react';
import { Users, Coffee, ChevronRight } from 'lucide-react';
import './RoomCard.css';

const RoomCard = ({ room, onClick }) => {
    return (
        <button
            type="button"
            className="room-card"
            onClick={() => onClick?.(room)}
        >
            <div className="room-image-container">
                <img src={room.image || ''} alt={room.name} className="room-image" loading="lazy" />
                <div className="room-price-badge">₦{(room.price ?? 0).toLocaleString()}<span>/night</span></div>
            </div>
            <div className="room-content">
                <span className="room-type-tag">{room.type || 'Room'}</span>
                <h3 className="room-title">{room.name}</h3>
                <p className="room-description">{room.description ? `${room.description.slice(0, 100)}${room.description.length > 100 ? '…' : ''}` : 'Comfortable accommodation for your stay.'}</p>
                <div className="room-meta">
                    <span className="meta-item"><Users size={18} /> {room.guests ?? 2} Guests</span>
                    <span className="meta-item"><Coffee size={18} /> Breakfast</span>
                </div>
                <span className="room-card-cta">View details <ChevronRight size={18} /></span>
            </div>
        </button>
    );
};

export default RoomCard;
