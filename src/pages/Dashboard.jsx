import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { ordersAPI, ridersAPI, packagesAPI, singlesAPI } from '../services/api';
import { MdShoppingCart, MdDeliveryDining, MdRestaurantMenu, MdTrendingUp, MdRefresh } from 'react-icons/md';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        orders: { total: 0, placed: 0, inProgress: 0, delivered: 0, todayRevenue: 0 },
        riders: { total: 0, available: 0, onDelivery: 0, offline: 0 },
        packages: 0,
        singles: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch all stats in parallel
            const [orderStats, riderStats, packagesRes, singlesRes, ordersRes] = await Promise.all([
                ordersAPI.getStats().catch(() => ({ success: false })),
                ridersAPI.getStats().catch(() => ({ success: false })),
                packagesAPI.getAll().catch(() => ({ success: false })),
                singlesAPI.getAll().catch(() => ({ success: false })),
                ordersAPI.getAll().catch(() => ({ success: false })),
            ]);

            setStats({
                orders: orderStats.success ? orderStats.data : stats.orders,
                riders: riderStats.success ? riderStats.data : stats.riders,
                packages: packagesRes.success ? (packagesRes.data.packages?.length || 0) : 0,
                singles: singlesRes.success ? (singlesRes.data.items?.length || 0) : 0,
            });

            if (ordersRes.success) {
                setRecentOrders((ordersRes.data.orders || []).slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'placed': return '#F39C12';
            case 'inProgress': return '#3498DB';
            case 'delivered': return '#27AE60';
            default: return '#95A5A6';
        }
    };

    return (
        <Layout title="Dashboard">
            {/* Refresh Button */}
            <div style={styles.topBar}>
                <button style={styles.refreshBtn} onClick={fetchDashboardData}>
                    <MdRefresh /> Refresh Data
                </button>
            </div>

            {loading ? (
                <div style={styles.loadingState}>Loading dashboard...</div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div style={styles.statsGrid}>
                        {/* Orders Stats */}
                        <div style={styles.statCard}>
                            <div style={styles.statHeader}>
                                <div style={{ ...styles.statIcon, background: '#E3F2FD' }}>
                                    <MdShoppingCart style={{ color: '#1976D2', fontSize: '24px' }} />
                                </div>
                                <span style={styles.statTitle}>Today's Orders</span>
                            </div>
                            <div style={styles.statValue}>{stats.orders.todayCount || 0}</div>
                            <div style={styles.statSubStats}>
                                <span style={styles.statSubStat}>
                                    <span style={{ color: '#F39C12' }}>●</span> Placed: {stats.orders.placed}
                                </span>
                                <span style={styles.statSubStat}>
                                    <span style={{ color: '#3498DB' }}>●</span> In Progress: {stats.orders.inProgress}
                                </span>
                                <span style={styles.statSubStat}>
                                    <span style={{ color: '#27AE60' }}>●</span> Delivered: {stats.orders.delivered}
                                </span>
                            </div>
                        </div>

                        {/* Revenue Stats */}
                        <div style={styles.statCard}>
                            <div style={styles.statHeader}>
                                <div style={{ ...styles.statIcon, background: '#E8F5E9' }}>
                                    <MdTrendingUp style={{ color: '#2D7A4F', fontSize: '24px' }} />
                                </div>
                                <span style={styles.statTitle}>Today's Revenue</span>
                            </div>
                            <div style={{ ...styles.statValue, color: '#2D7A4F' }}>
                                {formatCurrency(stats.orders.todayRevenue || 0)}
                            </div>
                            <div style={styles.statSubStats}>
                                <span style={styles.statSubStat}>Total orders: {stats.orders.total}</span>
                            </div>
                        </div>

                        {/* Riders Stats */}
                        <div style={styles.statCard}>
                            <div style={styles.statHeader}>
                                <div style={{ ...styles.statIcon, background: '#FFF3E0' }}>
                                    <MdDeliveryDining style={{ color: '#F57C00', fontSize: '24px' }} />
                                </div>
                                <span style={styles.statTitle}>Riders</span>
                            </div>
                            <div style={styles.statValue}>{stats.riders.total}</div>
                            <div style={styles.statSubStats}>
                                <span style={styles.statSubStat}>
                                    <span style={{ color: '#27AE60' }}>●</span> Available: {stats.riders.available}
                                </span>
                                <span style={styles.statSubStat}>
                                    <span style={{ color: '#3498DB' }}>●</span> On Delivery: {stats.riders.onDelivery}
                                </span>
                                <span style={styles.statSubStat}>
                                    <span style={{ color: '#95A5A6' }}>●</span> Offline: {stats.riders.offline}
                                </span>
                            </div>
                        </div>

                        {/* Menu Stats */}
                        <div style={styles.statCard}>
                            <div style={styles.statHeader}>
                                <div style={{ ...styles.statIcon, background: '#FCE4EC' }}>
                                    <MdRestaurantMenu style={{ color: '#E91E63', fontSize: '24px' }} />
                                </div>
                                <span style={styles.statTitle}>Menu Items</span>
                            </div>
                            <div style={styles.statValue}>{stats.packages + stats.singles}</div>
                            <div style={styles.statSubStats}>
                                <span style={styles.statSubStat}>📦 Packages: {stats.packages}</span>
                                <span style={styles.statSubStat}>🍽️ Singles: {stats.singles}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div style={styles.recentSection}>
                        <h2 style={styles.sectionTitle}>Recent Orders</h2>
                        {recentOrders.length === 0 ? (
                            <div style={styles.emptyRecent}>No orders yet</div>
                        ) : (
                            <div style={styles.ordersList}>
                                {recentOrders.map((order) => (
                                    <div key={order.id} style={styles.orderRow}>
                                        <div style={styles.orderInfo}>
                                            <span style={styles.orderId}>#{order.id?.slice(-8)}</span>
                                            <span style={styles.orderCustomer}>{order.customer?.name || 'Unknown'}</span>
                                        </div>
                                        <div style={styles.orderDetails}>
                                            <span style={styles.orderAmount}>{formatCurrency(order.totalAmount || 0)}</span>
                                            <span style={{
                                                ...styles.orderStatus,
                                                background: getStatusColor(order.status),
                                            }}>
                                                {order.status === 'placed' ? 'New' : order.status === 'inProgress' ? 'In Progress' : 'Delivered'}
                                            </span>
                                            <span style={styles.orderTime}>{formatTime(order.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
};

const styles = {
    topBar: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '24px',
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
    loadingState: {
        textAlign: 'center',
        padding: '60px',
        background: '#fff',
        borderRadius: '16px',
        color: '#95A5A6',
        fontSize: '16px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
    },
    statCard: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    statHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    },
    statIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statTitle: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#7F8C8D',
    },
    statValue: {
        fontSize: '36px',
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: '12px',
    },
    statSubStats: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
    },
    statSubStat: {
        fontSize: '13px',
        color: '#95A5A6',
    },
    recentSection: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: '0 0 20px 0',
    },
    emptyRecent: {
        textAlign: 'center',
        padding: '40px',
        color: '#95A5A6',
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    orderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: '#F8F9FA',
        borderRadius: '12px',
    },
    orderInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    orderId: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#2D7A4F',
        fontFamily: 'monospace',
    },
    orderCustomer: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#2C3E50',
    },
    orderDetails: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    orderAmount: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#2C3E50',
    },
    orderStatus: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#fff',
    },
    orderTime: {
        fontSize: '13px',
        color: '#95A5A6',
    },
};

export default Dashboard;
