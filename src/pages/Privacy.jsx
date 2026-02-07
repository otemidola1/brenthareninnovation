import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const Privacy = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>Privacy Policy</h1>
                <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide when making a reservation or creating an account: name, email, phone number, and payment-related data as needed. We also collect usage data (e.g. IP address, browser type) for security and improving our service.</p>
                </section>

                <section>
                    <h2>2. How We Use Your Information</h2>
                    <p>Your information is used to process bookings, send confirmations and updates, respond to inquiries, improve our website and services, and comply with legal obligations. We do not sell your personal data to third parties.</p>
                </section>

                <section>
                    <h2>3. Data Security</h2>
                    <p>We use industry-standard measures to protect your data, including encryption and secure storage. Passwords are hashed and never stored in plain text.</p>
                </section>

                <section>
                    <h2>4. Cookies and Similar Technologies</h2>
                    <p>We may use cookies and similar technologies for session management, preferences, and analytics. You can control cookie settings in your browser.</p>
                </section>

                <section>
                    <h2>5. Your Rights</h2>
                    <p>You may request access to, correction of, or deletion of your personal data by contacting us. You may also opt out of marketing communications at any time.</p>
                </section>

                <section>
                    <h2>6. Contact</h2>
                    <p>For privacy-related questions, contact us at <a href="mailto:hello@brenthareninnovations.com">hello@brenthareninnovations.com</a>.</p>
                </section>

                <p className="legal-back"><Link to="/">← Back to Home</Link></p>
            </div>
        </div>
    );
};

export default Privacy;
