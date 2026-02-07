import React, { useState, useEffect } from 'react';
import './RoomModal.css';

const RoomModal = ({ isOpen, onClose, onSave, room }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Standard',
        price: '',
        guests: '2',
        description: '',
        image: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (room) {
            setFormData({
                name: room.name || '',
                type: room.type || 'Standard',
                price: room.price ? String(room.price) : '',
                guests: room.guests ? String(room.guests) : '2',
                description: room.description || '',
                image: room.image || ''
            });
        } else {
            setFormData({
                name: '',
                type: 'Standard',
                price: '',
                guests: '2',
                description: '',
                image: ''
            });
        }
        setErrors({});
    }, [room, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Room name is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.guests || formData.guests <= 0) newErrors.guests = 'Valid guest capacity is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const roomData = {
            ...formData,
            price: parseInt(formData.price),
            guests: parseInt(formData.guests)
        };

        onSave(roomData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{room ? 'Edit Room' : 'Add New Room'}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="room-form">
                    <div className="form-group">
                        <label>Room Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Deluxe King Suite"
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Room Type *</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                                <option value="Executive">Executive</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Price (₦) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="85000"
                            />
                            {errors.price && <span className="error-text">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label>Guest Capacity *</label>
                            <input
                                type="number"
                                name="guests"
                                value={formData.guests}
                                onChange={handleChange}
                                min="1"
                            />
                            {errors.guests && <span className="error-text">{errors.guests}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe the room amenities and features..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/room-image.jpg"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {room ? 'Update Room' : 'Add Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomModal;
