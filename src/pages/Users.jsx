import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { toast } from 'react-toastify';
import { usersAPI } from '../services/api';
import { MdPhone, MdEmail, MdRefresh, MdPerson, MdVerified, MdBlock, MdSchedule } from 'react-icons/md';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, verified: 0, inactive: 0, recentSignups: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await usersAPI.getAll();
            if (response.success) {
                setUsers(response.data.users || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await usersAPI.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusChange = async (phone, isActive) => {
        try {
            await usersAPI.updateStatus(phone, isActive);
            toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
            fetchUsers();
            fetchStats();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredUsers = users.filter(user => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            user.name?.toLowerCase().includes(query) ||
            user.phone?.includes(query) ||
            user.email?.toLowerCase().includes(query)
        );
    });

    return (
        <Layout title="Users">
            {/* Stats Bar */}
            <div style={styles.statsBar}>
                <div style={styles.statCard}>
                    <span style={styles.statValue}>{stats.total}</span>
                    <span style={styles.statLabel}>Total Users</span>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #27AE60' }}>
                    <span style={{ ...styles.statValue, color: '#27AE60' }}>{stats.active}</span>
                    <span style={styles.statLabel}>Active</span>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #3498DB' }}>
                    <span style={{ ...styles.statValue, color: '#3498DB' }}>{stats.verified}</span>
                    <span style={styles.statLabel}>Verified</span>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #F39C12' }}>
                    <span style={{ ...styles.statValue, color: '#F39C12' }}>{stats.recentSignups}</span>
                    <span style={styles.statLabel}>New (7 days)</span>
                </div>
            </div>

            {/* Toolbar */}
            <div style={styles.toolbar}>
                <input
                    type="text"
                    placeholder="Search by name, phone, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />
                <button style={styles.refreshBtn} onClick={() => { fetchUsers(); fetchStats(); }}>
                    <MdRefresh /> Refresh
                </button>
            </div>

            {/* Users Grid */}
            <div style={styles.usersGrid}>
                {loading ? (
                    <div style={styles.loadingState}>Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={styles.emptyIcon}>👥</span>
                        <p>{searchQuery ? 'No users match your search' : 'No users found'}</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.phone} style={styles.userCard}>
                            <div style={styles.userHeader}>
                                <div style={styles.userAvatar}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                                <div style={styles.userInfo}>
                                    <h3 style={styles.userName}>{user.name}</h3>
                                    <div style={styles.badgeRow}>
                                        {user.isActive !== false && (
                                            <span style={styles.activeBadge}>
                                                <MdVerified size={12} /> Active
                                            </span>
                                        )}
                                        {user.isActive === false && (
                                            <span style={styles.inactiveBadge}>
                                                <MdBlock size={12} /> Inactive
                                            </span>
                                        )}
                                        {user.isVerified && (
                                            <span style={styles.verifiedBadge}>
                                                <MdVerified size={12} /> Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.userDetails}>
                                <div style={styles.detailRow}>
                                    <MdPhone style={styles.detailIcon} />
                                    <span>{user.phone}</span>
                                </div>
                                {user.email && (
                                    <div style={styles.detailRow}>
                                        <MdEmail style={styles.detailIcon} />
                                        <span>{user.email}</span>
                                    </div>
                                )}
                                {user.address && (
                                    <div style={styles.detailRow}>
                                        <MdPerson style={styles.detailIcon} />
                                        <span style={styles.addressText}>{user.address}</span>
                                    </div>
                                )}
                            </div>

                            <div style={styles.userMeta}>
                                <div style={styles.metaItem}>
                                    <span style={styles.metaLabel}>Registered</span>
                                    <span style={styles.metaValue}>{formatDate(user.createdAt)}</span>
                                </div>
                                <div style={styles.metaItem}>
                                    <span style={styles.metaLabel}>Last Login</span>
                                    <span style={styles.metaValue}>
                                        {user.lastLogin ? (
                                            <>
                                                {formatDate(user.lastLogin)}
                                                <small style={styles.timeSmall}> {formatTime(user.lastLogin)}</small>
                                            </>
                                        ) : 'Never'}
                                    </span>
                                </div>
                            </div>

                            <div style={styles.actionRow}>
                                {user.isActive !== false ? (
                                    <button
                                        style={styles.deactivateBtn}
                                        onClick={() => handleStatusChange(user.phone, false)}
                                    >
                                        <MdBlock size={16} /> Deactivate
                                    </button>
                                ) : (
                                    <button
                                        style={styles.activateBtn}
                                        onClick={() => handleStatusChange(user.phone, true)}
                                    >
                                        <MdVerified size={16} /> Activate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Results Count */}
            {!loading && filteredUsers.length > 0 && (
                <div style={styles.resultsCount}>
                    Showing {filteredUsers.length} of {users.length} users
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
    },
    searchInput: {
        flex: 1,
        padding: '12px 20px',
        border: '2px solid #E8ECEF',
        borderRadius: '10px',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s',
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
    usersGrid: {
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
    userCard: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    userHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
    },
    userAvatar: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        fontWeight: '700',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: '0 0 6px 0',
    },
    badgeRow: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    activeBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        background: '#E8F5E9',
        color: '#27AE60',
    },
    inactiveBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        background: '#FFEBEE',
        color: '#E74C3C',
    },
    verifiedBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        background: '#E3F2FD',
        color: '#2196F3',
    },
    userDetails: {
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
    addressText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '220px',
    },
    userMeta: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
    },
    metaItem: {
        flex: 1,
    },
    metaLabel: {
        fontSize: '12px',
        color: '#95A5A6',
        display: 'block',
        marginBottom: '4px',
    },
    metaValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2C3E50',
    },
    timeSmall: {
        fontSize: '12px',
        color: '#95A5A6',
        fontWeight: '400',
    },
    actionRow: {
        display: 'flex',
        gap: '12px',
    },
    deactivateBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        background: '#FFEBEE',
        border: 'none',
        borderRadius: '10px',
        color: '#E74C3C',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    activateBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        background: '#E8F5E9',
        border: 'none',
        borderRadius: '10px',
        color: '#27AE60',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    resultsCount: {
        textAlign: 'center',
        padding: '20px',
        color: '#95A5A6',
        fontSize: '14px',
    },
};

export default Users;
