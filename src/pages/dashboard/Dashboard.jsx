import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Calendar, Settings, LogOut } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/dashboard', label: 'My Bookings', icon: <Calendar size={20} /> },
    ];

    return (
        <div className="dashboard-layout container">
            <aside className="dashboard-sidebar">
                <div className="user-profile-summary">
                    <div className="avatar-placeholder">{user?.name?.charAt(0)}</div>
                    <h3>{user?.name}</h3>
                    <p>{user?.email}</p>
                </div>

                <nav className="dashboard-nav">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`dash-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="dash-link logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Dashboard;
