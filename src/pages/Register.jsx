import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to register');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Create Account</h2>
                <p>Join us for exclusive benefits</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Your full name" />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Optional" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                placeholder="Min 8 chars, upper, lower, number"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                            />
                            {/* Optional: Second toggle or share the same one. Usually cleaner to share or just toggle one. 
                                Let's share state for simplicity or just use one toggle for both as is standard in simple flows,
                                OR add a second state. For now, let's keep it simple and just toggle the main password visibility
                                OR apply the visibility to ALL password fields which is a common pattern.
                                I applied the 'type' check to both inputs above using 'showPassword' state.
                             */}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
