import React, { useEffect, useState } from 'react';
import RoomCard from '../components/RoomCard';
import RoomDetailModal from '../components/RoomDetailModal';
import { api } from '../services/api';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
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
            <div className="rooms-page-header">
                <div className="container">
                    <h1>Our Rooms</h1>
                    <p>Choose your perfect stay. Click any room for details and reserve when you're ready—login required to book.</p>
                </div>
            </div>

            <div className="container rooms-main">
                <aside className="rooms-filters">
                    <h3>Filter</h3>
                    <label>
                        <span>Type</span>
                        <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                            <option value="">All types</option>
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Suite</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </label>
                    <label>
                        <span>Min price (₦)</span>
                        <input type="number" placeholder="e.g. 50000" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
                    </label>
                    <label>
                        <span>Max price (₦)</span>
                        <input type="number" placeholder="e.g. 200000" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
                    </label>
                    <label>
                        <span>Guests</span>
                        <input type="number" placeholder="Any" min="1" value={filters.guests} onChange={(e) => handleFilterChange('guests', e.target.value)} />
                    </label>
                </aside>

                <div className="rooms-content">
                    {loading ? (
                        <div className="rooms-loading">Loading rooms…</div>
                    ) : rooms.length === 0 ? (
                        <div className="rooms-empty">No rooms match your criteria.</div>
                    ) : (
                        <div className="rooms-grid">
                            {rooms.map(room => (
                                <RoomCard key={room.id} room={room} onClick={setSelectedRoom} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedRoom && (
                <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
            )}
        </div>
    );
};

export default Rooms;
