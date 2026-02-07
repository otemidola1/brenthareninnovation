import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ChangePassword from '../../components/ChangePassword';
import './Admin.css';

const AdminSettings = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="page-title">Admin Settings</h1>

            <div className="settings-container">
                <div className="settings-section">
                    <h2>Account Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Name:</label>
                            <span>{user?.name}</span>
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{user?.email}</span>
                        </div>
                        <div className="info-item">
                            <label>Role:</label>
                            <span className="role-badge">{user?.role}</span>
                        </div>
                    </div>
                </div>

                <ChangePassword />
            </div>
        </div>
    );
};

export default AdminSettings;
