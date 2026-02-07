import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const Terms = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>Terms and Conditions</h1>
                <p className="legal-updated">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using the Brentharen Innovations guest house reservation website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
                </section>

                <section>
                    <h2>2. Reservations and Bookings</h2>
                    <p>Reservations are subject to availability. A booking is confirmed only when you receive a confirmation email from us. We reserve the right to refuse or cancel any reservation at our discretion.</p>
                </section>

                <section>
                    <h2>3. Cancellation Policy</h2>
                    <p>Cancellations must be made through your dashboard or by contacting us. Refund eligibility depends on the timing of cancellation relative to your check-in date. Please refer to your confirmation email for specific terms.</p>
                </section>

                <section>
                    <h2>4. Guest Conduct</h2>
                    <p>Guests are expected to respect the property, other guests, and staff. We reserve the right to terminate a stay without refund in case of misconduct or violation of house rules.</p>
                </section>

                <section>
                    <h2>5. Liability</h2>
                    <p>Brentharen Innovations is not liable for loss or damage to guest property, or for circumstances beyond our control (e.g. natural disasters, utility failures). Our liability is limited to the amount paid for the stay.</p>
                </section>

                <section>
                    <h2>6. Contact</h2>
                    <p>For questions about these terms, contact us at <a href="mailto:hello@brenthareninnovations.com">hello@brenthareninnovations.com</a>.</p>
                </section>

                <p className="legal-back"><Link to="/">← Back to Home</Link></p>
            </div>
        </div>
    );
};

export default Terms;
