import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hotel } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Only show Home for non-authenticated users
  const publicNavItems = [
    { path: '/', label: 'Home' },
  ];

  // Show all nav items for authenticated users
  const authenticatedNavItems = [
    { path: '/', label: 'Home' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/reservation', label: 'Reservation' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  const navItems = user ? authenticatedNavItems : publicNavItems;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <Hotel className="logo-icon" size={24} />
          <span>Brentharen Innovations</span>
        </Link>

        <button className="nav-toggle" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="btn btn-outline"
              onClick={() => setIsOpen(false)}
            >
              {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
            </Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-text" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
