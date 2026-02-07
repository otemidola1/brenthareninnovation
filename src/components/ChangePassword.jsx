import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import './ChangePassword.css';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const validatePassword = (password) => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('New password must be different from current password');
            return;
        }

        setLoading(true);
        try {
            await api.changePassword(formData.currentPassword, formData.newPassword);
            setSuccess('Password changed successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return '';
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        return 'strong';
    };

    const strength = getPasswordStrength(formData.newPassword);

    return (
        <div className="change-password-section">
            {error && (
                <div className="message-alert error-alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="message-alert success-alert">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="password-form-group">
                    <label>
                        <Lock size={16} />
                        Current Password
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter current password"
                    />
                </div>

                <div className="password-form-group">
                    <label>
                        <Lock size={16} />
                        New Password
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter new password"
                    />
                    {formData.newPassword && (
                        <div className={`password-strength strength-${strength}`}>
                            <div className="strength-bar">
                                <div className={`strength-fill strength-${strength}`}></div>
                            </div>
                            <span className="strength-text">Password strength: <strong>{strength}</strong></span>
                        </div>
                    )}
                </div>

                <div className="password-form-group">
                    <label>
                        <Lock size={16} />
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Confirm new password"
                    />
                </div>

                <div className="password-form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating Password...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
