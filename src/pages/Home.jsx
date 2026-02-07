import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Home as HomeIcon, Coffee, Wind, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import heroImage from '../assets/hero.jpg';
import ReviewSection from '../components/ReviewSection';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background" style={{ backgroundImage: `url(${heroImage})` }}></div>
                <div className="hero-overlay"></div>

                <div className="container hero-container">
                    <div className="hero-content animate-in">
                        <h1>Experience Modern Luxury</h1>
                        <p>Discover tranquility and comfort in the heart of the city. Brentharen Innovations offers a unique blend of high-quality living and premium hospitality.</p>

                        <div className="hero-actions">
                            {user ? (
                                <Link to="/reservation" className="btn btn-primary">
                                    Book Your Stay <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                                </Link>
                            ) : (
                                <Link to="/login" className="btn btn-primary">
                                    Login to Book <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                                </Link>
                            )}
                            <Link to="/rooms" className="btn btn-outline">
                                View Rooms
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="section intro">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">A Modern Retreat</h2>
                        <p className="section-subtitle">Designed for relaxation and comfort, our guesthouse offers a sanctuary where modern amenities meet warm, personalized hospitality.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><Wifi size={32} /></div>
                            <h3>High-Speed Wi-Fi</h3>
                            <p>Seamless connectivity with our enterprise-grade fiber internet.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Coffee size={32} /></div>
                            <h3>Daily Breakfast</h3>
                            <p>Start your day with locally sourced, organic breakfast options.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Wind size={32} /></div>
                            <h3>Climate Control</h3>
                            <p>Individual climate control in every room for your perfect comfort.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><HomeIcon size={32} /></div>
                            <h3>Premium Rooms</h3>
                            <p>Spacious suites designed with contemporary aesthetics and comfort.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <div className="bg-checkered">
                <ReviewSection limit={3} />
            </div>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready for your getaway?</h2>
                        <p>Book directly with us for the best rates and exclusive offers.</p>
                        <Link to="/rooms" className="btn btn-primary">View Our Rooms</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
