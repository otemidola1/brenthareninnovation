import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BedDouble, CheckCircle, AlertCircle, Clock, Wrench, User as UserIcon } from 'lucide-react';

const AdminHousekeeping = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const data = await api.getRooms();
            setRooms(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateRoom = async (id, updates) => {
        try {
            await api.updateRoom(id, updates);
            fetchRooms(); // refresh
        } catch (error) {
            alert('Failed to update room');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'clean': return '#10B981';
            case 'dirty': return '#EF4444';
            case 'in_progress': return '#F59E0B';
            case 'out_of_service': return '#6B7280';
            default: return '#3B82F6';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'clean': return <CheckCircle size={16} />;
            case 'dirty': return <AlertCircle size={16} />;
            case 'in_progress': return <Clock size={16} />;
            case 'out_of_service': return <Wrench size={16} />;
            default: return null;
        }
    }

    if (loading) return <div className="loading-state">Loading housekeeping board...</div>;

    return (
        <div className="admin-page housekeeping-container">
            <h1 className="page-title">Housekeeping Management</h1>
            <p className="page-subtitle">Track and update room cleanliness and maintenance status.</p>

            <div className="housekeeping-stats">
                <div className="stat-mini">
                    <span className="dot clean"></span>
                    <span>Clean: {rooms.filter(r => r.housekeepingStatus === 'clean').length}</span>
                </div>
                <div className="stat-mini">
                    <span className="dot dirty"></span>
                    <span>Dirty: {rooms.filter(r => r.housekeepingStatus === 'dirty').length}</span>
                </div>
                <div className="stat-mini">
                    <span className="dot maintenance"></span>
                    <span>Service: {rooms.filter(r => r.housekeepingStatus === 'out_of_service').length}</span>
                </div>
            </div>

            <div className="housekeeping-grid">
                {rooms.map(room => (
                    <div key={room.id} className={`room-status-card ${room.housekeepingStatus}`}>
                        <div className="card-header">
                            <div className="room-info">
                                <BedDouble size={20} className="icon-room" />
                                <div>
                                    <h3>{room.name}</h3>
                                    <span className="room-type">{room.type}</span>
                                </div>
                            </div>
                            <span className="status-label" style={{ backgroundColor: getStatusColor(room.housekeepingStatus) }}>
                                {getStatusIcon(room.housekeepingStatus)}
                                {room.housekeepingStatus.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="card-body">
                            <div className="info-row">
                                <Clock size={14} />
                                <span>Last Sync: {room.lastCleaned ? new Date(room.lastCleaned).toLocaleTimeString() : 'Never'}</span>
                            </div>
                            <div className="info-row">
                                <UserIcon size={14} />
                                <span>Assigned: {room.assignedTo || 'Unassigned'}</span>
                            </div>
                            {room.priority === 'high' && (
                                <div className="priority-tag">
                                    <AlertCircle size={14} /> Urgent Attention
                                </div>
                            )}
                        </div>

                        <div className="card-actions">
                            <button
                                onClick={() => updateRoom(room.id, { housekeepingStatus: 'clean', lastCleaned: new Date() })}
                                className={`act-btn clean ${room.housekeepingStatus === 'clean' ? 'active' : ''}`}
                            >Clean</button>
                            <button
                                onClick={() => updateRoom(room.id, { housekeepingStatus: 'in_progress' })}
                                className={`act-btn progress ${room.housekeepingStatus === 'in_progress' ? 'active' : ''}`}
                            >In Progress</button>
                            <button
                                onClick={() => updateRoom(room.id, { housekeepingStatus: 'dirty' })}
                                className={`act-btn dirty ${room.housekeepingStatus === 'dirty' ? 'active' : ''}`}
                            >Dirty</button>
                        </div>

                        <div className="card-footer">
                            <input
                                type="text"
                                placeholder="Assign Staff..."
                                defaultValue={room.assignedTo || ''}
                                onBlur={(e) => updateRoom(room.id, { assignedTo: e.target.value })}
                            />
                            <select
                                value={room.priority}
                                onChange={(e) => updateRoom(room.id, { priority: e.target.value })}
                            >
                                <option value="normal">Normal</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .housekeeping-container { padding: 30px; }
                .page-subtitle { color: #64748b; margin-top: -20px; margin-bottom: 30px; }
                .housekeeping-stats { display: flex; gap: 20px; margin-bottom: 30px; }
                .stat-mini { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 500; color: #475569; }
                .dot { width: 8px; height: 8px; border-radius: 50%; }
                .dot.clean { background: #10B981; }
                .dot.dirty { background: #EF4444; }
                .dot.maintenance { background: #6B7280; }
                
                .housekeeping-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
                .room-status-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; transition: transform 0.2s, box-shadow 0.2s; }
                .room-status-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -8px rgba(0,0,0,0.1); }
                
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                .room-info { display: flex; gap: 12px; }
                .icon-room { color: #64748b; margin-top: 4px; }
                .room-info h3 { font-size: 1.1rem; color: #1e293b; margin: 0; }
                .room-type { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }
                
                .status-label { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; color: white; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
                
                .card-body { margin-bottom: 24px; }
                .info-row { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 0.85rem; margin-bottom: 6px; }
                .priority-tag { display: flex; align-items: center; gap: 6px; color: #ef4444; font-size: 0.85rem; margin-top: 10px; font-weight: 600; padding: 4px 10px; background: #fef2f2; border-radius: 6px; width: fit-content; }
                
                .card-actions { display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 8px; margin-bottom: 20px; }
                .act-btn { border: 1px solid #e2e8f0; background: white; padding: 8px 4px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .act-btn:hover { background: #f8fafc; }
                .act-btn.active.clean { border-color: #10B981; color: #10B981; background: #f0fdf4; }
                .act-btn.active.progress { border-color: #F59E0B; color: #F59E0B; background: #fffbeb; }
                .act-btn.active.dirty { border-color: #EF4444; color: #EF4444; background: #fef2f2; }
                
                .card-footer { display: flex; flex-direction: column; gap: 10px; border-top: 1px solid #f1f5f9; pt-15; margin-top: 15px; padding-top: 15px;}
                .card-footer input { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; font-size: 0.85rem; }
                .card-footer select { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; font-size: 0.85rem; }
            `}</style>
        </div>
    );
};

export default AdminHousekeeping;
