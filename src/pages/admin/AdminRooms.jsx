import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import RoomModal from '../../components/RoomModal';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await api.getRooms();
            setRooms(data);
        } catch (err) {
            setError('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoom = () => {
        setEditingRoom(null);
        setIsModalOpen(true);
        setError('');
        setSuccess('');
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setIsModalOpen(true);
        setError('');
        setSuccess('');
    };

    const handleSaveRoom = async (roomData) => {
        try {
            if (editingRoom) {
                await api.updateRoom(editingRoom.id, roomData);
                setSuccess('Room updated successfully!');
                setIsModalOpen(false);
                setEditingRoom(null);
            } else {
                await api.createRoom(roomData);
                setSuccess('Room added successfully!');
                setIsModalOpen(false);
            }
            fetchRooms();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving room:', err);
            setError(err.message || 'Failed to save room. Please try again.');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDeleteRoom = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await api.deleteRoom(id);
            setSuccess('Room deleted successfully!');
            fetchRooms();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete room');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 className="page-title">Room Management</h1>
                <button className="btn btn-primary" onClick={handleAddRoom}>
                    + Add New Room
                </button>
            </div>

            {error && (
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#ffe0e0',
                    color: '#d32f2f',
                    borderRadius: '6px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#e0f7e0',
                    color: '#388e3c',
                    borderRadius: '6px',
                    marginBottom: '20px'
                }}>
                    {success}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Loading rooms...</p>
                </div>
            ) : rooms.length === 0 ? (
                <div className="table-container" style={{ padding: '40px', textAlign: 'center' }}>
                    <p>No rooms available. Add your first room to get started!</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Room Name</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Capacity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.id}>
                                    <td>{room.name}</td>
                                    <td>{room.type}</td>
                                    <td>{formatPrice(room.price)}</td>
                                    <td>{room.guests} Guest{room.guests > 1 ? 's' : ''}</td>
                                    <td>
                                        <button
                                            className="action-btn btn-edit"
                                            onClick={() => handleEditRoom(room)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-btn btn-reject"
                                            onClick={() => handleDeleteRoom(room.id, room.name)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <RoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRoom}
                room={editingRoom}
            />
        </div>
    );
};

export default AdminRooms;
