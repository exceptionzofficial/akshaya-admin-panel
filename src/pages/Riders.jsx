import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { toast } from 'react-toastify';
import { ridersAPI } from '../services/api';
import { MdAdd, MdPhone, MdEmail, MdStar, MdDeliveryDining, MdRefresh } from 'react-icons/md';

const Riders = () => {
    const [riders, setRiders] = useState([]);
    const [stats, setStats] = useState({ total: 0, available: 0, onDelivery: 0, offline: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        vehicleType: 'Bike',
        vehicleNumber: '',
    });

    useEffect(() => {
        fetchRiders();
        fetchStats();
    }, []);

    const fetchRiders = async () => {
        setLoading(true);
        try {
            const response = await ridersAPI.getAll();
            if (response.success) {
                setRiders(response.data.riders || []);
            }
        } catch (error) {
            console.error('Error fetching riders:', error);
            toast.error('Failed to load riders');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await ridersAPI.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            toast.error('Name and phone are required');
            return;
        }

        try {
            await ridersAPI.create(formData);
            toast.success('Rider added successfully!');
            resetForm();
            fetchRiders();
            fetchStats();
        } catch (error) {
            toast.error('Failed to add rider');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await ridersAPI.updateStatus(id, newStatus);
            toast.success(`Status updated to ${newStatus}`);
            fetchRiders();
            fetchStats();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this rider?')) {
            try {
                await ridersAPI.delete(id);
                toast.success('Rider removed');
                fetchRiders();
                fetchStats();
            } catch (error) {
                toast.error('Failed to remove rider');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            vehicleType: 'Bike',
            vehicleNumber: '',
        });
        setShowForm(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return '#27AE60';
            case 'on-delivery': return '#3498DB';
            case 'offline': return '#95A5A6';
            default: return '#95A5A6';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'available': return 'Available';
            case 'on-delivery': return 'On Delivery';
            case 'offline': return 'Offline';
            default: return status;
        }
    };

    return (
        <Layout title="Riders">
            {/* Stats Bar */}
            <div style={styles.statsBar}>
                <div style={styles.statCard}>
                    <span style={styles.statValue}>{stats.total}</span>
                    <span style={styles.statLabel}>Total Riders</span>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #27AE60' }}>
                    <span style={{ ...styles.statValue, color: '#27AE60' }}>{stats.available}</span>
                    <span style={styles.statLabel}>Available</span>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #3498DB' }}>
                    <span style={{ ...styles.statValue, color: '#3498DB' }}>{stats.onDelivery}</span>
                    <span style={styles.statLabel}>On Delivery</span>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #95A5A6' }}>
                    <span style={{ ...styles.statValue, color: '#95A5A6' }}>{stats.offline}</span>
                    <span style={styles.statLabel}>Offline</span>
                </div>
            </div>

            {/* Toolbar */}
            <div style={styles.toolbar}>
                <button style={styles.refreshBtn} onClick={() => { fetchRiders(); fetchStats(); }}>
                    <MdRefresh /> Refresh
                </button>
                <button style={styles.addBtn} onClick={() => setShowForm(true)}>
                    <MdAdd /> Add Rider
                </button>
            </div>

            {/* Riders Grid */}
            <div style={styles.ridersGrid}>
                {loading ? (
                    <div style={styles.loadingState}>Loading riders...</div>
                ) : riders.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={styles.emptyIcon}>🛵</span>
                        <p>No riders found</p>
                        <button style={styles.addFirstBtn} onClick={() => setShowForm(true)}>
                            Add First Rider
                        </button>
                    </div>
                ) : (
                    riders.map((rider) => (
                        <div key={rider.id} style={styles.riderCard}>
                            <div style={styles.riderHeader}>
                                <div style={styles.riderAvatar}>{rider.name?.charAt(0) || 'R'}</div>
                                <div style={styles.riderInfo}>
                                    <h3 style={styles.riderName}>{rider.name}</h3>
                                    <span style={{
                                        ...styles.riderStatus,
                                        background: getStatusColor(rider.status),
                                    }}>
                                        {getStatusLabel(rider.status)}
                                    </span>
                                </div>
                            </div>

                            <div style={styles.riderDetails}>
                                <div style={styles.detailRow}>
                                    <MdPhone style={styles.detailIcon} />
                                    <span>{rider.phone}</span>
                                </div>
                                {rider.email && (
                                    <div style={styles.detailRow}>
                                        <MdEmail style={styles.detailIcon} />
                                        <span>{rider.email}</span>
                                    </div>
                                )}
                                <div style={styles.detailRow}>
                                    <MdDeliveryDining style={styles.detailIcon} />
                                    <span>{rider.vehicleType || 'Bike'} {rider.vehicleNumber && `• ${rider.vehicleNumber}`}</span>
                                </div>
                            </div>

                            <div style={styles.riderStats}>
                                <div style={styles.riderStat}>
                                    <span style={styles.riderStatValue}>{rider.totalDeliveries || 0}</span>
                                    <span style={styles.riderStatLabel}>Deliveries</span>
                                </div>
                                <div style={styles.riderStat}>
                                    <span style={styles.riderStatValue}>
                                        <MdStar style={{ color: '#F39C12', marginRight: '4px' }} />
                                        {rider.rating || 5.0}
                                    </span>
                                    <span style={styles.riderStatLabel}>Rating</span>
                                </div>
                                <div style={styles.riderStat}>
                                    <span style={styles.riderStatValue}>{rider.joinedAt ? new Date(rider.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
                                    <span style={styles.riderStatLabel}>Joined</span>
                                </div>
                            </div>

                            <div style={styles.statusSelector}>
                                <span style={styles.statusLabel}>Set Status:</span>
                                <div style={styles.statusOptions}>
                                    {['available', 'on-delivery', 'offline'].map((status) => (
                                        <button
                                            key={status}
                                            style={{
                                                ...styles.statusOption,
                                                ...(rider.status === status ? { background: getStatusColor(status), color: '#fff' } : {}),
                                            }}
                                            onClick={() => handleStatusChange(rider.id, status)}
                                        >
                                            {getStatusLabel(status)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button style={styles.removeBtn} onClick={() => handleDelete(rider.id)}>
                                Remove Rider
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Rider Modal */}
            {showForm && (
                <div style={styles.modalOverlay} onClick={resetForm}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>🛵 Add New Rider</h2>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={styles.input}
                                    placeholder="Enter rider name"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Phone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    style={styles.input}
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={styles.input}
                                    placeholder="rider@email.com"
                                />
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Vehicle Type</label>
                                    <select
                                        value={formData.vehicleType}
                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        style={styles.select}
                                    >
                                        <option value="Bike">Bike</option>
                                        <option value="Scooter">Scooter</option>
                                        <option value="Bicycle">Bicycle</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Vehicle Number</label>
                                    <input
                                        type="text"
                                        value={formData.vehicleNumber}
                                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                        style={styles.input}
                                        placeholder="TN 01 AB 1234"
                                    />
                                </div>
                            </div>

                            <div style={styles.modalActions}>
                                <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitBtn}>
                                    Add Rider
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

const styles = {
    statsBar: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
    },
    statCard: {
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    statValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#2C3E50',
    },
    statLabel: {
        fontSize: '14px',
        color: '#95A5A6',
    },
    toolbar: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        justifyContent: 'flex-end',
    },
    refreshBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: '#fff',
        border: 'none',
        borderRadius: '10px',
        color: '#7F8C8D',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: '#2D7A4F',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    ridersGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px',
    },
    loadingState: {
        textAlign: 'center',
        padding: '60px',
        gridColumn: '1 / -1',
        background: '#fff',
        borderRadius: '16px',
        color: '#95A5A6',
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px',
        gridColumn: '1 / -1',
        background: '#fff',
        borderRadius: '16px',
    },
    emptyIcon: {
        fontSize: '64px',
        display: 'block',
        marginBottom: '16px',
    },
    addFirstBtn: {
        marginTop: '16px',
        padding: '12px 24px',
        background: '#2D7A4F',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    riderCard: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    riderHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
    },
    riderAvatar: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2D7A4F 0%, #1f5a37 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        fontWeight: '700',
    },
    riderInfo: {
        flex: 1,
    },
    riderName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: '0 0 6px 0',
    },
    riderStatus: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#fff',
    },
    riderDetails: {
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid #F0F2F5',
    },
    detailRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        color: '#7F8C8D',
        marginBottom: '8px',
    },
    detailIcon: {
        fontSize: '18px',
        color: '#95A5A6',
    },
    riderStats: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
    },
    riderStat: {
        flex: 1,
        textAlign: 'center',
    },
    riderStatValue: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: '4px',
    },
    riderStatLabel: {
        fontSize: '12px',
        color: '#95A5A6',
    },
    statusSelector: {
        marginBottom: '16px',
    },
    statusLabel: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#95A5A6',
        marginBottom: '8px',
        display: 'block',
    },
    statusOptions: {
        display: 'flex',
        gap: '8px',
    },
    statusOption: {
        flex: 1,
        padding: '10px',
        background: '#F5F7FA',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
    },
    removeBtn: {
        width: '100%',
        padding: '12px',
        background: '#FFEBEE',
        border: 'none',
        borderRadius: '10px',
        color: '#E74C3C',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
    },
    modal: {
        background: '#fff',
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '480px',
    },
    modalTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: '0 0 24px 0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2C3E50',
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #E8ECEF',
        borderRadius: '10px',
        fontSize: '15px',
        outline: 'none',
    },
    select: {
        padding: '12px 16px',
        border: '2px solid #E8ECEF',
        borderRadius: '10px',
        fontSize: '15px',
        outline: 'none',
        background: '#fff',
        cursor: 'pointer',
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    cancelBtn: {
        flex: 1,
        padding: '14px',
        background: '#F5F7FA',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
    },
    submitBtn: {
        flex: 1,
        padding: '14px',
        background: '#2D7A4F',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        color: '#fff',
        cursor: 'pointer',
    },
};

export default Riders;
