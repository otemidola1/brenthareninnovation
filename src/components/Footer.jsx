import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section">
                    <h3>Brentharen Innovations</h3>
                    <p>Experience comfort and tranquility in our modern guesthouse. Your perfect getaway.</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/rooms">Rooms</Link></li>
                        <li><Link to="/reservation">Book Now</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/terms">Terms</Link></li>
                        <li><Link to="/privacy">Privacy</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <div className="contact-item">
                        <MapPin size={18} />
                        <span>451 Oluwadamilola Fasade St, Omole Phase 1, Lagos</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={18} />
                        <span>+234 800 123 4567</span>
                    </div>
                    <div className="contact-item">
                        <Mail size={18} />
                        <span>hello@brenthareninnovations.com</span>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Brentharen Innovations. All rights reserved. <Link to="/terms">Terms</Link> · <Link to="/privacy">Privacy</Link></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
