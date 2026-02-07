import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQ.css';

const faqItems = [
    {
        q: 'How do I make a reservation?',
        a: 'Create an account or log in, then go to Reservation. Choose your room, dates, and guest details, then confirm. You will receive a confirmation email.'
    },
    {
        q: 'What is the cancellation policy?',
        a: 'You can cancel from your dashboard. Refund eligibility depends on how far in advance you cancel. Check your booking confirmation for details.'
    },
    {
        q: 'What time is check-in and check-out?',
        a: 'Standard check-in is from 2:00 PM and check-out is by 11:00 AM. Early or late options may be available on request.'
    },
    {
        q: 'Do you offer breakfast?',
        a: 'Yes. A daily breakfast option is available. Details are provided at check-in.'
    },
    {
        q: 'Is Wi-Fi available?',
        a: 'Yes. High-speed Wi-Fi is available throughout the property at no extra charge.'
    },
    {
        q: 'How can I modify my booking?',
        a: 'Log in to your dashboard and open the booking you wish to change. You can request changes or cancel. For date changes, cancellation and rebooking may be required.'
    },
    {
        q: 'Do you have parking?',
        a: 'Please contact us for current parking availability and options at hello@brenthareninnovations.com.'
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="faq-page">
            <div className="container">
                <h1>Frequently Asked Questions</h1>
                <p className="faq-intro">Find answers to common questions about staying with us.</p>

                <div className="faq-list">
                    {faqItems.map((item, index) => (
                        <div key={index} className="faq-item">
                            <button
                                className="faq-question"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{item.q}</span>
                                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{item.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <p className="faq-contact">
                    Still have questions? <Link to="/contact">Contact us</Link>.
                </p>
            </div>
        </div>
    );
};

export default FAQ;
