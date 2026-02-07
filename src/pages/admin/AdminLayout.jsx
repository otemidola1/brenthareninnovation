import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Calendar, LogOut, BedDouble, Settings, Sparkles, Star } from 'lucide-react';
import './Admin.css';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/bookings', label: 'Bookings', icon: <Calendar size={20} /> },
        { path: '/admin/guests', label: 'Guests', icon: <Users size={20} /> },
        { path: '/admin/reviews', label: 'Reviews', icon: <Star size={20} /> },
        { path: '/admin/rooms', label: 'Rooms', icon: <BedDouble size={20} /> },
        { path: '/admin/housekeeping', label: 'Housekeeping', icon: <Sparkles size={20} /> },
        { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <h3>Admin Panel</h3>
                </div>
                <nav className="admin-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="admin-link logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
