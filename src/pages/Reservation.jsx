import React from 'react';
import ReservationWizard from '../components/ReservationWizard';
import './Reservation.css';

const Reservation = () => {
    return (
        <div className="reservation-page type-wrapper">
            <div className="container">
                <h1>Make a Reservation</h1>
                <p className="reservation-intro">Choose your room, dates, and confirm your stay.</p>
                <ReservationWizard />
            </div>
        </div>
    );
};

export default Reservation;
