import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const user = await login(email, password);
            if (user.role === 'admin' && !redirectTo) {
                navigate('/admin');
            } else if (redirectTo && redirectTo.startsWith('/')) {
                navigate(redirectTo);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Welcome Back</h2>
                <p>Login to manage your bookings</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">Login</button>

                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Forgot Password?</Link>
                    </div>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
