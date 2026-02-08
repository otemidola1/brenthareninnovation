import React, { useEffect, useState, useMemo } from 'react';
import RoomCard from '../components/RoomCard';
import RoomDetailModal from '../components/RoomDetailModal';
import { api } from '../services/api';
import heroImage from '../assets/hero.jpg';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filters, setFilters] = useState({ 
        type: '', 
        minPrice: '', 
        maxPrice: '', 
        guests: '',
        beds: '',
        amenities: ''
    });
    const [sortBy, setSortBy] = useState('price-low');

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

    const sortedRooms = useMemo(() => {
        const sorted = [...rooms];
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price-high':
                return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'name':
                return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            default:
                return sorted;
        }
    }, [rooms, sortBy]);

    // Calculate price range from rooms
    const priceRange = useMemo(() => {
        if (rooms.length === 0) return { min: 0, max: 500000 };
        const prices = rooms.map(r => r.price || 0).filter(p => p > 0);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }, [rooms]);

    return (
        <div className="rooms-page">
            {/* Hero Section */}
            <section className="rooms-hero">
                <div className="rooms-hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
                <div className="rooms-hero-overlay" />
                <div className="container rooms-hero-content">
                    <h1>Experience Unparalleled Comfort</h1>
                    <p>Discover our exquisite collection of rooms and suites, meticulously designed for your utmost relaxation and luxury.</p>
                </div>
            </section>

            {/* Filter & Sort Section */}
            <div className="rooms-filter-section">
                <div className="container">
                    <div className="rooms-filter-box">
                        <div className="filter-row">
                            <label>
                                <span>Room Type</span>
                                <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                                    <option value="">All Types</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Deluxe">Deluxe</option>
                                    <option value="Suite">Suite</option>
                                    <option value="Executive">Executive</option>
                                </select>
                            </label>
                            <label>
                                <span>Beds</span>
                                <select value={filters.beds} onChange={(e) => handleFilterChange('beds', e.target.value)}>
                                    <option value="">Any</option>
                                    <option value="1">1 Bed</option>
                                    <option value="2">2 Beds</option>
                                </select>
                            </label>
                            <label>
                                <span>Guests</span>
                                <input 
                                    type="number" 
                                    placeholder="Any" 
                                    min="1" 
                                    value={filters.guests} 
                                    onChange={(e) => handleFilterChange('guests', e.target.value)} 
                                />
                            </label>
                            <label>
                                <span>Amenities</span>
                                <select value={filters.amenities} onChange={(e) => handleFilterChange('amenities', e.target.value)}>
                                    <option value="">All Amenities</option>
                                    <option value="wifi">Wi-Fi</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="ac">Air Conditioning</option>
                                </select>
                            </label>
                        </div>
                        <div className="filter-row">
                            <label className="price-range-label">
                                <span>Price Range</span>
                                <div className="price-range-display">
                                    ₦{parseInt(filters.minPrice || priceRange.min).toLocaleString()} - ₦{parseInt(filters.maxPrice || priceRange.max).toLocaleString()}
                                </div>
                                <div className="price-range-inputs">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={filters.minPrice} 
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        min={priceRange.min}
                                        max={priceRange.max}
                                    />
                                    <span>—</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={filters.maxPrice} 
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        min={priceRange.min}
                                        max={priceRange.max}
                                    />
                                </div>
                            </label>
                            <label>
                                <span>Sort By</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="price-low">Price (Low to High)</option>
                                    <option value="price-high">Price (High to Low)</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rooms Grid */}
            <div className="container rooms-main">
                {loading ? (
                    <div className="rooms-loading">Loading rooms…</div>
                ) : sortedRooms.length === 0 ? (
                    <div className="rooms-empty">No rooms match your criteria.</div>
                ) : (
                    <div className="rooms-grid">
                        {sortedRooms.map(room => (
                            <RoomCard key={room.id} room={room} onClick={setSelectedRoom} />
                        ))}
                    </div>
                )}
            </div>

            {selectedRoom && (
                <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
            )}
        </div>
    );
};

export default Rooms;
