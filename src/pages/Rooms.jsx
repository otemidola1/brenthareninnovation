import React, { useEffect, useState } from 'react';
import RoomCard from '../components/RoomCard';
import { api } from '../services/api';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: '', minPrice: '', maxPrice: '', guests: '' });

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.type) params.set('type', filters.type);
                if (filters.minPrice) params.set('minPrice', filters.minPrice);
                if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
                if (filters.guests) params.set('guests', filters.guests);
                const query = params.toString() ? `?${params}` : '';
                const data = await api.getRooms(query);
                setRooms(Array.isArray(data) ? data : []);
            } catch (e) {
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, [filters.type, filters.minPrice, filters.maxPrice, filters.guests]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="rooms-page">
            <div className="page-header">
                <div className="container">
                    <h1>Our Accommodations</h1>
                    <p>Find your perfect space to relax and unwind.</p>
                </div>
            </div>

            <div className="container section">
                <div className="rooms-filters">
                    <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                        <option value="">All room types</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Executive">Executive</option>
                    </select>
                    <input type="number" placeholder="Min price" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
                    <input type="number" placeholder="Max price" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
                    <input type="number" placeholder="Guests" min="1" value={filters.guests} onChange={(e) => handleFilterChange('guests', e.target.value)} />
                </div>

                {loading ? (
                    <div className="rooms-loading">Loading rooms...</div>
                ) : rooms.length === 0 ? (
                    <div className="no-rooms">No rooms match your criteria.</div>
                ) : (
                    <div className="rooms-grid">
                        {rooms.map(room => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rooms;
