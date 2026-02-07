import React from 'react';

const AdminGuests = () => {
    return (
        <div>
            <h1 className="page-title">Guest Management</h1>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Admin User</td>
                            <td>admin@brentharen.com</td>
                            <td>000-000-0000</td>
                            <td>Admin</td>
                            <td>
                                <button className="action-btn btn-edit">Edit</button>
                            </td>
                        </tr>
                        {/* Real app would map users here */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminGuests;
