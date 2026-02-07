import React from 'react';
import './About.css';
import heroImage from '../assets/hero.jpg';
// We will try to use the exterior image here once generated and moved
import exteriorImage from '../assets/exterior.jpg';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-hero">
                <div className="container">
                    <h1>About Brentharen Innovations</h1>
                    <p>Our story, mission, and values.</p>
                </div>
            </div>

            <div className="container section about-content">
                <div className="about-text">
                    <h2>Our Story</h2>
                    <p>Founded in 2024, Brentharen Innovations was born from a desire to create a sanctuary for travelers seeking both modern comfort and natural tranquility. Located in the heart of the city yet tucked away from the noise, we offer the best of both worlds.</p>
                    <p>Our design philosophy centers on "freshness"—reflected in our signature lemon green accents and open, airy spaces that invite relaxation.</p>

                    <h2>Mission & Values</h2>
                    <ul className="values-list">
                        <li><strong>Hospitality:</strong> We believe in warm, personalized service that makes every guest feel at home.</li>
                        <li><strong>Sustainability:</strong> We are committed to eco-friendly practices, from energy-efficient lighting to locally sourced breakfast ingredients.</li>
                        <li><strong>Cleanliness:</strong> We maintain the highest standards of hygiene and maintenance.</li>
                    </ul>
                </div>
                <div className="about-image">
                    {/* Placeholder for exterior image */}
                    <img src={exteriorImage} alt="GreenStay Exterior" onError={(e) => { e.target.src = heroImage }} />
                </div>
            </div>
        </div>
    );
};

export default About;
