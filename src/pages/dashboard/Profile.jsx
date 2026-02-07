import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChangePassword from '../../components/ChangePassword';
import { User, Mail, Phone, Calendar, Shield, CheckCircle } from 'lucide-react';
import MyCards from './MyCards';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, we'd call an API to update the user
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || ''
        });
        setIsEditing(false);
    };

    // Calculate member since date
    const memberSince = new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Profile Settings</h1>
                <p>Manage your account information and preferences</p>
            </div>

            {saved && (
                <div className="save-success">
                    <CheckCircle size={20} />
                    <span>Profile updated successfully!</span>
                </div>
            )}

            {/* User Info Card */}
            <div className="profile-card user-info-card">
                <div className="user-avatar-large">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-info-details">
                    <h2>{user?.name}</h2>
                    <p className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Guest'}</p>
                    <div className="user-meta">
                        <Calendar size={14} />
                        <span>Member since {memberSince}</span>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="profile-card">
                <div className="card-header">
                    <div className="card-title-section">
                        <User size={20} />
                        <h3>Personal Information</h3>
                    </div>
                    {!isEditing && (
                        <button
                            className="btn-edit"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>
                                <User size={16} />
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="edit-input"
                                    required
                                />
                            ) : (
                                <p className="info-value">{user?.name}</p>
                            )}
                        </div>

                        <div className="info-item">
                            <label>
                                <Mail size={16} />
                                Email Address
                            </label>
                            <p className="info-value">{user?.email}</p>
                            {isEditing && <small className="info-hint">Email cannot be changed</small>}
                        </div>

                        <div className="info-item">
                            <label>
                                <Phone size={16} />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="edit-input"
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <p className="info-value">{user?.phone || 'Not provided'}</p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Security Settings */}
            <div className="profile-card">
                <div className="card-header">
                    <div className="card-title-section">
                        <Shield size={20} />
                        <h3>Security Settings</h3>
                    </div>
                </div>
                <ChangePassword />
            </div>

            {/* Payment Methods */}
            <div style={{ marginTop: '30px' }}>
                <MyCards />
            </div>
        </div>
    );
};

export default Profile;
