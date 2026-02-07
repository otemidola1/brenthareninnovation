import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="contact-page">
            <div className="page-header">
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>We are here to answer any questions you may have.</p>
                </div>
            </div>

            <div className="container section contact-wrapper">
                <div className="contact-info">
                    <h2>Contact Information</h2>
                    <div className="info-item">
                        <div className="icon"><MapPin /></div>
                        <div>
                            <h3>Location</h3>
                            <p>451 Oluwadamilola Fasade Street<br />Omole Phase 1, Lagos, Nigeria</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="icon"><Phone /></div>
                        <div>
                            <h3>Phone</h3>
                            <p>+234 800 123 4567</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="icon"><Mail /></div>
                        <div>
                            <h3>Email</h3>
                            <p>hello@brenthareninnovations.com</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="icon"><Clock /></div>
                        <div>
                            <h3>Reception Hours</h3>
                            <p>Mon - Sun: 8:00 AM - 10:00 PM</p>
                        </div>
                    </div>

                    <div className="map-placeholder">
                        <iframe
                            title="Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.012345678901!2d3.3645678!3d6.6345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b934567890abc%3A0x1234567890abcdef!2s451%20Oluwadamilola%20Fasade%20St%2C%20Omole%20Phase%201%20101233%2C%20Ikeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1626365451234!5m2!1sen!2sng"
                            width="100%"
                            height="250"
                            style={{ border: 0, borderRadius: '8px' }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                <div className="contact-form-container">
                    <h2>Send us a Message</h2>
                    {submitted ? (
                        <div className="success-message">
                            <h3>Thank you!</h3>
                            <p>Your message has been sent successfully. We will respond within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input type="text" required />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" required />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input type="text" required />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea rows="5" required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Send Message</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
