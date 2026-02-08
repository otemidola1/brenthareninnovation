import React, { useEffect, useState, useMemo } from 'react';
import RoomSection from '../components/RoomSection';
import { api } from '../services/api';
import heroImage from '../assets/hero.jpg';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        minPrice: '',
        maxPrice: '',
        guests: ''
    });
    const [sortBy, setSortBy] = useState('price-low');

    const fetchRooms = React.useCallback(async () => {
        try {
            setLoading(true);
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
    }, [filters.type, filters.minPrice, filters.maxPrice, filters.guests]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    useEffect(() => {
        const onFocus = () => fetchRooms();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [fetchRooms]);

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

    const priceRange = useMemo(() => {
        if (rooms.length === 0) return { min: 0, max: 500000 };
        const prices = rooms.map(r => r.price || 0).filter(p => p > 0);
        return { min: Math.min(...prices), max: Math.max(...prices) };
    }, [rooms]);

    return (
        <div className="rooms-page rooms-page--luxe">
            <section className="rooms-hero rooms-hero--compact">
                <div className="rooms-hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
                <div className="rooms-hero-overlay" />
                <div className="container rooms-hero-content">
                    <h1>Our Rooms</h1>
                    <p>Every space designed for comfort and relaxation.</p>
                </div>
            </section>

            <div className="rooms-filter-bar">
                <div className="container rooms-filter-bar-inner">
                    <label className="filter-dropdown">
                        <span>Price Range</span>
                        <select
                            value={[filters.minPrice, filters.maxPrice].join('-') || 'any'}
                            onChange={(e) => {
                                const v = e.target.value;
                                if (v === 'any') {
                                    handleFilterChange('minPrice', '');
                                    handleFilterChange('maxPrice', '');
                                } else {
                                    const [min, max] = v.split('-');
                                    handleFilterChange('minPrice', min || '');
                                    handleFilterChange('maxPrice', max || '');
                                }
                            }}
                        >
                            <option value="any">Any</option>
                            <option value="0-100000">Under ₦100,000</option>
                            <option value="100000-150000">₦100k – ₦150k</option>
                            <option value="150000-200000">₦150k – ₦200k</option>
                            <option value="200000-">₦200,000+</option>
                        </select>
                    </label>
                    <label className="filter-dropdown">
                        <span>Capacity</span>
                        <select value={filters.guests} onChange={(e) => handleFilterChange('guests', e.target.value)}>
                            <option value="">Any</option>
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4+ Guests</option>
                        </select>
                    </label>
                    <label className="filter-dropdown">
                        <span>Room Type</span>
                        <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                            <option value="">All Types</option>
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Suite</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="rooms-list-wrap">
                {loading ? (
                    <div className="rooms-loading">Loading rooms…</div>
                ) : sortedRooms.length === 0 ? (
                    <div className="rooms-empty">No rooms match your criteria. Try adjusting the filters above.</div>
                ) : (
                    sortedRooms.map(room => <RoomSection key={room.id} room={room} />)
                )}
            </div>
        </div>
    );
};

export default Rooms;
