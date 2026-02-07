import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, Users, BedDouble, Home as HomeIcon, CreditCard } from 'lucide-react';
import './ReservationWizard.css';

const ReservationWizard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        roomType: '',
        roomDetails: null,
        checkIn: '',
        checkOut: '',
        guests: 2,
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: user?.phone || '',
        notes: ''
    });

    const [savedCards, setSavedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState('pay_at_hotel');

    useEffect(() => {
        const fetchData = async () => {
            const roomData = await api.getRooms();
            setRooms(roomData);
            if (user) {
                try {
                    const cardData = await api.getCards();
                    setSavedCards(cardData);
                    const defaultCard = cardData.find(c => c.isDefault);
                    if (defaultCard) setSelectedCard(defaultCard.id);
                } catch (e) {
                    console.error("Failed to load cards", e);
                }
            }
        };
        fetchData();
    }, [user]);

    const steps = [
        { number: 1, title: 'Choose Room', icon: <BedDouble size={18} /> },
        { number: 2, title: 'Select Dates', icon: <CalendarIcon size={18} /> },
        { number: 3, title: 'Guest Details', icon: <Users size={18} /> },
        { number: 4, title: 'Review & Confirm', icon: <Check size={18} /> }
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRoomSelect = (room) => {
        handleChange('roomType', room.name);
        handleChange('roomDetails', room);
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.roomType) {
                    alert('Please select a room');
                    return false;
                }
                return true;
            case 2:
                if (!formData.checkIn || !formData.checkOut) {
                    alert('Please select check-in and check-out dates');
                    return false;
                }
                if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
                    alert('Check-out date must be after check-in date');
                    return false;
                }
                return true;
            case 3:
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                    alert('Please fill in all guest details');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const bookingData = {
                userId: user.id,
                roomType: formData.roomType,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                guests: formData.guests,
                status: 'confirmed',
                notes: formData.notes,
                paymentMethod: selectedCard === 'pay_at_hotel' ? 'Pay at Hotel' : 'Credit Card'
            };

            await api.createBooking(bookingData);
            navigate('/dashboard', { state: { bookingSuccess: true } });
        } catch (err) {
            alert('Failed to create reservation: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Calculate nights
    const calculateNights = () => {
        if (formData.checkIn && formData.checkOut) {
            const diff = new Date(formData.checkOut) - new Date(formData.checkIn);
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    // Calculate total price
    const calculateTotal = () => {
        const nights = calculateNights();
        const roomPrice = formData.roomDetails?.price || 0;
        return nights * roomPrice;
    };

    return (
        <div className="reservation-wizard">
            <div className="wizard-container">
                {/* Progress Indicator */}
                <div className="wizard-progress">
                    {steps.map((step, index) => (
                        <div key={step.number} className="progress-step-wrapper">
                            <div
                                className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                            >
                                <div className="step-circle">
                                    {currentStep > step.number ? <Check size={20} /> : step.icon}
                                </div>
                                <div className="step-info">
                                    <span className="step-number">Step {step.number}</span>
                                    <span className="step-title">{step.title}</span>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`progress-line ${currentStep > step.number ? 'completed' : ''}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="wizard-content">
                    {/* Step 1: Choose Room */}
                    {currentStep === 1 && (
                        <div className="step-panel">
                            <h2>Choose Your Perfect Room</h2>
                            <p className="step-description">Select from our range of comfortable accommodations</p>

                            <div className="rooms-selection-grid">
                                {rooms.map(room => (
                                    <div
                                        key={room.id}
                                        className={`room-selection-card ${formData.roomType === room.name ? 'selected' : ''}`}
                                        onClick={() => handleRoomSelect(room)}
                                    >
                                        <div className="room-image">
                                            <img src={room.image || '/placeholder-room.jpg'} alt={room.name} />
                                            {formData.roomType === room.name && (
                                                <div className="selected-badge">
                                                    <Check size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="room-info">
                                            <h3>{room.name}</h3>
                                            <p className="room-description">{room.description}</p>
                                            <div className="room-features">
                                                <span><Users size={14} /> {room.guests} guests</span>
                                                <span><HomeIcon size={14} /> {room.size || '25m²'}</span>
                                            </div>
                                            <div className="room-price">₦{room.price?.toLocaleString()}<span>/night</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Dates */}
                    {currentStep === 2 && (
                        <div className="step-panel">
                            <h2>When Would You Like to Stay?</h2>
                            <p className="step-description">Choose your check-in and check-out dates</p>

                            <div className="date-selection">
                                <div className="date-input-group">
                                    <label>
                                        <CalendarIcon size={20} />
                                        Check-in Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.checkIn}
                                        onChange={(e) => handleChange('checkIn', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="date-input-group">
                                    <label>
                                        <CalendarIcon size={20} />
                                        Check-out Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.checkOut}
                                        onChange={(e) => handleChange('checkOut', e.target.value)}
                                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="date-input-group">
                                    <label>
                                        <Users size={20} />
                                        Number of Guests
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={formData.roomDetails?.guests || 10}
                                        value={formData.guests}
                                        onChange={(e) => handleChange('guests', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            {formData.checkIn && formData.checkOut && (
                                <div className="stay-summary">
                                    <div className="summary-item">
                                        <span>Duration:</span>
                                        <strong>{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Room Rate:</span>
                                        <strong>₦{formData.roomDetails?.price?.toLocaleString()}/night</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Guest Details */}
                    {currentStep === 3 && (
                        <div className="step-panel">
                            <h2>Guest Information</h2>
                            <p className="step-description">Please provide your contact details</p>

                            <div className="guest-details-form">
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleChange('firstName', e.target.value)}
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => handleChange('lastName', e.target.value)}
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            placeholder="+234 xxx xxx xxxx"
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label>Special Requests (Optional)</label>
                                    <textarea
                                        rows="4"
                                        value={formData.notes}
                                        onChange={(e) => handleChange('notes', e.target.value)}
                                        placeholder="Any special requests or requirements..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review & Payment */}
                    {currentStep === 4 && (
                        <div className="step-panel">
                            <h2>Review & Confirm</h2>
                            <p className="step-description">Please review your reservation details and select payment method</p>

                            <div className="booking-review">
                                <div className="review-section">
                                    <h3><BedDouble size={20} /> Room Details</h3>
                                    <div className="review-item">
                                        <span>Room Type:</span>
                                        <strong>{formData.roomType}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Guests:</span>
                                        <strong>{formData.guests} {formData.guests === 1 ? 'guest' : 'guests'}</strong>
                                    </div>
                                </div>

                                <div className="review-section">
                                    <h3><CalendarIcon size={20} /> Stay Duration</h3>
                                    <div className="review-item">
                                        <span>Check-in:</span>
                                        <strong>{new Date(formData.checkIn).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Check-out:</span>
                                        <strong>{new Date(formData.checkOut).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Total Nights:</span>
                                        <strong>{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</strong>
                                    </div>
                                </div>

                                <div className="review-section">
                                    <h3><Users size={20} /> Guest Information</h3>
                                    <div className="review-item">
                                        <span>Name:</span>
                                        <strong>{formData.firstName} {formData.lastName}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Email:</span>
                                        <strong>{formData.email}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Phone:</span>
                                        <strong>{formData.phone}</strong>
                                    </div>
                                    {formData.notes && (
                                        <div className="review-item full-width">
                                            <span>Special Requests:</span>
                                            <p>{formData.notes}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="review-section">
                                    <h3><CreditCard size={20} /> Payment Method</h3>
                                    {savedCards.length > 0 ? (
                                        <div className="saved-cards-selection">
                                            {savedCards.map(card => (
                                                <div
                                                    key={card.id}
                                                    className={`saved-card-option ${selectedCard === card.id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedCard(card.id)}
                                                    style={{
                                                        border: selectedCard === card.id ? '2px solid #C7E008' : '1px solid #ddd',
                                                        padding: '10px',
                                                        borderRadius: '8px',
                                                        marginBottom: '10px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <div>
                                                        <strong>{card.brand}</strong> ending in {card.last4}
                                                    </div>
                                                    {selectedCard === card.id && <Check size={16} color="#C7E008" />}
                                                </div>
                                            ))}
                                            <div
                                                className={`saved-card-option ${selectedCard === 'pay_at_hotel' ? 'selected' : ''}`}
                                                onClick={() => setSelectedCard('pay_at_hotel')}
                                                style={{
                                                    border: selectedCard === 'pay_at_hotel' ? '2px solid #C7E008' : '1px solid #ddd',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <strong>Pay at Hotel</strong>
                                                {selectedCard === 'pay_at_hotel' && <Check size={16} color="#C7E008" />}
                                            </div>
                                        </div>
                                    ) : (
                                        <p>Pay at Hotel (No saved cards found)</p>
                                    )}
                                </div>

                                <div className="price-breakdown">
                                    <h3>Price Breakdown</h3>
                                    <div className="price-item">
                                        <span>₦{formData.roomDetails?.price?.toLocaleString()} × {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
                                        <strong>₦{calculateTotal().toLocaleString()}</strong>
                                    </div>
                                    <div className="price-total">
                                        <span>Total Amount</span>
                                        <strong>₦{calculateTotal().toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="wizard-navigation">
                    {currentStep > 1 && (
                        <button className="btn btn-secondary" onClick={prevStep}>
                            <ChevronLeft size={20} />
                            Previous
                        </button>
                    )}

                    {currentStep < 4 ? (
                        <button className="btn btn-primary ml-auto" onClick={nextStep}>
                            Next
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary ml-auto"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (selectedCard !== 'pay_at_hotel' ? 'Pay & Confirm' : 'Confirm Booking')}
                            <Check size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationWizard;
