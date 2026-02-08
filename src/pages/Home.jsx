import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Home as HomeIcon, Coffee, Wind, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import heroImage from '../assets/hero.jpg';
import exteriorImage from '../assets/exterior.jpg';
import roomImage from '../assets/room.jpg';
import ReviewSection from '../components/ReviewSection';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background" style={{ backgroundImage: `url(${heroImage})` }} />
                <div className="hero-overlay" />
                <div className="container hero-container">
                    <div className="hero-content animate-in">
                        <span className="hero-badge"><Sparkles size={14} /> Welcome to Brentharen</span>
                        <h1>Experience Modern Luxury</h1>
                        <p>Discover tranquility and comfort in the heart of the city. A unique blend of high-quality living and premium hospitality.</p>
                        <div className="hero-actions">
                            <Link to="/rooms" className="btn btn-primary">
                                View Rooms <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </Link>
                            {user ? (
                                <Link to="/reservation" className="btn btn-outline btn-light">
                                    Book Your Stay
                                </Link>
                            ) : (
                                <Link to="/login" className="btn btn-outline btn-light">
                                    Login to Book
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Image showcase - Exterior & Room */}
            <section className="image-showcase">
                <div className="showcase-grid">
                    <div className="showcase-card showcase-card--large">
                        <img src={exteriorImage} alt="Guest house exterior" />
                        <div className="showcase-overlay">
                            <h3>Your Retreat Awaits</h3>
                            <p>Modern architecture in a peaceful setting.</p>
                        </div>
                    </div>
                    <div className="showcase-card">
                        <img src={roomImage} alt="Comfortable room" />
                        <div className="showcase-overlay">
                            <h3>Comfort & Style</h3>
                            <p>Every detail designed for you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro & Features */}
            <section className="section intro">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">A Modern Retreat</h2>
                        <p className="section-subtitle">Designed for relaxation and comfort—our guesthouse offers a sanctuary where modern amenities meet warm, personalized hospitality.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><Wifi size={32} /></div>
                            <h3>High-Speed Wi-Fi</h3>
                            <p>Seamless connectivity with enterprise-grade fiber internet.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Coffee size={32} /></div>
                            <h3>Daily Breakfast</h3>
                            <p>Start your day with locally sourced, organic options.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Wind size={32} /></div>
                            <h3>Climate Control</h3>
                            <p>Individual climate control in every room for your comfort.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><HomeIcon size={32} /></div>
                            <h3>Premium Rooms</h3>
                            <p>Spacious suites with contemporary aesthetics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full-bleed image */}
            <section className="home-image-strip">
                <div className="image-strip-bg" style={{ backgroundImage: `url(${roomImage})` }} />
                <div className="image-strip-overlay" />
                <div className="container image-strip-content">
                    <h2>Browse our rooms—no login required</h2>
                    <p>Explore accommodations and book when you're ready.</p>
                    <Link to="/rooms" className="btn btn-primary btn-lg">View All Rooms</Link>
                </div>
            </section>

            {/* Reviews */}
            <div className="bg-checkered">
                <ReviewSection limit={3} />
            </div>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-bg" style={{ backgroundImage: `url(${exteriorImage})` }} />
                <div className="cta-overlay" />
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready for your getaway?</h2>
                        <p>Book directly with us for the best rates and exclusive offers.</p>
                        <Link to="/rooms" className="btn btn-primary btn-light-border">View Our Rooms</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
