import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { toast } from 'react-toastify';
import { ordersAPI, ridersAPI } from '../services/api';
import { MdSearch, MdFilterList, MdPhone, MdLocationOn, MdAccessTime, MdRefresh, MdDeliveryDining } from 'react-icons/md';

const Orders = () => {
    const [activeTab, setActiveTab] = useState('placed');
    const [orders, setOrders] = useState([]);
    const [availableRiders, setAvailableRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const tabs = [
        { id: 'placed', label: 'Placed', color: '#F39C12' },
        { id: 'inProgress', label: 'In Progress', color: '#3498DB' },
        { id: 'delivered', label: 'Delivered', color: '#27AE60' },
    ];

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await ordersAPI.getByStatus(activeTab);
            if (response.success) {
                setOrders(response.data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableRiders = async () => {
        try {
            const response = await ridersAPI.getAvailable();
            if (response.success) {
                setAvailableRiders(response.data.riders || []);
            }
        } catch (error) {
            console.error('Error fetching riders:', error);
        }
    };

    const handleAcceptOrder = async (order) => {
        setSelectedOrder(order);
        await fetchAvailableRiders();
        setShowAssignModal(true);
    };

    const handleAssignRider = async (rider) => {
        try {
            await ordersAPI.assignRider(selectedOrder.id, rider.id, rider.name);
            toast.success(`Order assigned to ${rider.name}`);
            setShowAssignModal(false);
            setSelectedOrder(null);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to assign rider');
        }
    };

    const handleRejectOrder = async (id) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await ordersAPI.updateStatus(id, 'cancelled');
                toast.success('Order cancelled');
                fetchOrders();
            } catch (error) {
                toast.error('Failed to cancel order');
            }
        }
    };

    const handleMarkDelivered = async (id) => {
        try {
            await ordersAPI.updateStatus(id, 'delivered');
            toast.success('Order marked as delivered');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update order');
        }
    };

    const getOrderCounts = () => {
        return {
            placed: orders.filter(o => o.status === 'placed').length,
            inProgress: orders.filter(o => o.status === 'inProgress').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
        };
    };

    const filteredOrders = orders.filter(order => {
        const searchLower = searchQuery.toLowerCase();
        return (
            order.customer?.name?.toLowerCase().includes(searchLower) ||
            order.id?.toLowerCase().includes(searchLower)
        );
    });

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Layout title="Orders">
            {/* Tabs */}
            <div style={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        style={{
                            ...styles.tab,
                            ...(activeTab === tab.id ? { ...styles.tabActive, borderColor: tab.color } : {}),
                        }}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span style={styles.tabLabel}>{tab.label}</span>
                        <span style={{ ...styles.tabCount, background: activeTab === tab.id ? tab.color : '#E8ECEF' }}>
                            {orders.filter(o => o.status === tab.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div style={styles.toolbar}>
                <div style={styles.searchBox}>
                    <MdSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by customer name or order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <button style={styles.refreshBtn} onClick={fetchOrders}>
                    <MdRefresh /> Refresh
                </button>
            </div>

            {/* Orders Grid */}
            <div style={styles.ordersGrid}>
                {loading ? (
                    <div style={styles.loadingState}>Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={styles.emptyIcon}>📋</span>
                        <p>No {activeTab} orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} style={styles.orderCard}>
                            <div style={styles.orderHeader}>
                                <div style={styles.orderId}>#{order.id?.slice(-8) || 'N/A'}</div>
                                <div style={{
                                    ...styles.orderStatus,
                                    background: tabs.find(t => t.id === order.status)?.color || '#95A5A6'
                                }}>
                                    {order.status === 'placed' ? 'New' : order.status === 'inProgress' ? 'In Progress' : 'Delivered'}
                                </div>
                            </div>

                            <div style={styles.customerInfo}>
                                <div style={styles.customerName}>{order.customer?.name || 'Unknown'}</div>
                                <div style={styles.infoRow}>
                                    <MdPhone style={styles.infoIcon} />
                                    <span>{order.customer?.phone || 'N/A'}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <MdLocationOn style={styles.infoIcon} />
                                    <span>{order.customer?.address || 'No address'}</span>
                                </div>
                            </div>

                            <div style={styles.orderItems}>
                                <div style={styles.itemsLabel}>Items:</div>
                                <div style={styles.itemsList}>
                                    {(order.items || []).map((item, idx) => (
                                        <span key={idx} style={styles.itemTag}>
                                            {item.name || item} {item.quantity ? `x${item.quantity}` : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.orderFooter}>
                                <div style={styles.orderAmount}>₹{order.totalAmount || 0}</div>
                                <div style={styles.orderMeta}>
                                    <span style={styles.paymentMethod}>{order.paymentMethod || 'Cash'}</span>
                                    <span style={styles.orderTime}>
                                        <MdAccessTime /> {formatTime(order.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {order.riderId && (
                                <div style={styles.riderInfo}>
                                    <MdDeliveryDining style={styles.riderIcon} />
                                    <span>Assigned to: {order.riderName || 'Rider'}</span>
                                </div>
                            )}

                            <div style={styles.orderActions}>
                                {activeTab === 'placed' && (
                                    <>
                                        <button style={styles.acceptBtn} onClick={() => handleAcceptOrder(order)}>
                                            Accept & Assign Rider
                                        </button>
                                        <button style={styles.rejectBtn} onClick={() => handleRejectOrder(order.id)}>
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {activeTab === 'inProgress' && (
                                    <button style={styles.deliverBtn} onClick={() => handleMarkDelivered(order.id)}>
                                        Mark Delivered
                                    </button>
                                )}
                                {activeTab === 'delivered' && (
                                    <div style={styles.deliveredTime}>
                                        Delivered at {formatTime(order.deliveredAt)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Assign Rider Modal */}
            {showAssignModal && (
                <div style={styles.modalOverlay} onClick={() => setShowAssignModal(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>🛵 Assign Rider</h2>
                        <p style={styles.modalSubtitle}>Select a rider for Order #{selectedOrder?.id?.slice(-8)}</p>

                        {availableRiders.length === 0 ? (
                            <div style={styles.noRiders}>
                                <span>😔</span>
                                <p>No riders available at the moment</p>
                            </div>
                        ) : (
                            <div style={styles.ridersList}>
                                {availableRiders.map((rider) => (
                                    <div key={rider.id} style={styles.riderCard} onClick={() => handleAssignRider(rider)}>
                                        <div style={styles.riderAvatar}>{rider.name?.charAt(0) || 'R'}</div>
                                        <div style={styles.riderDetails}>
                                            <div style={styles.riderName}>{rider.name}</div>
                                            <div style={styles.riderStats}>
                                                ⭐ {rider.rating || 5.0} • {rider.totalDeliveries || 0} deliveries
                                            </div>
                                        </div>
                                        <div style={styles.assignArrow}>→</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button style={styles.cancelModalBtn} onClick={() => setShowAssignModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

const styles = {
    tabs: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        background: '#fff',
        border: 'none',
        borderBottom: '3px solid transparent',
        borderRadius: '12px 12px 0 0',
        fontSize: '15px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    tabActive: {
        color: '#2C3E50',
        background: '#fff',
    },
    tabLabel: {},
    tabCount: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '700',
        color: '#fff',
    },
    toolbar: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '12px',
        padding: '0 16px',
        flex: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    searchIcon: {
        fontSize: '22px',
        color: '#95A5A6',
    },
    searchInput: {
        flex: 1,
        padding: '14px 12px',
        border: 'none',
        outline: 'none',
        fontSize: '15px',
        background: 'transparent',
    },
    refreshBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: '#fff',
        border: 'none',
        borderRadius: '12px',
        color: '#7F8C8D',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    ordersGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
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
    orderCard: {
        background: '#fff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    orderId: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#2D7A4F',
        fontFamily: 'monospace',
    },
    orderStatus: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#fff',
    },
    customerInfo: {
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #F0F2F5',
    },
    customerName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: '8px',
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#7F8C8D',
        marginBottom: '4px',
    },
    infoIcon: {
        fontSize: '16px',
        color: '#95A5A6',
    },
    orderItems: {
        marginBottom: '16px',
    },
    itemsLabel: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#95A5A6',
        marginBottom: '8px',
    },
    itemsList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    itemTag: {
        padding: '4px 10px',
        background: '#F0F4F8',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#2C3E50',
    },
    orderFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    orderAmount: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2D7A4F',
    },
    orderMeta: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
    },
    paymentMethod: {
        padding: '4px 10px',
        background: '#E3F2FD',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#1976D2',
        fontWeight: '600',
    },
    orderTime: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '13px',
        color: '#95A5A6',
    },
    riderInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        background: '#E8F5E9',
        borderRadius: '10px',
        marginBottom: '16px',
        fontSize: '14px',
        color: '#2D7A4F',
        fontWeight: '500',
    },
    riderIcon: {
        fontSize: '20px',
    },
    orderActions: {
        display: 'flex',
        gap: '10px',
    },
    acceptBtn: {
        flex: 1,
        padding: '12px',
        background: '#2D7A4F',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    rejectBtn: {
        padding: '12px 20px',
        background: '#FFEBEE',
        border: 'none',
        borderRadius: '10px',
        color: '#E74C3C',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    deliverBtn: {
        flex: 1,
        padding: '12px',
        background: '#27AE60',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    deliveredTime: {
        flex: 1,
        padding: '12px',
        background: '#F0F4F8',
        borderRadius: '10px',
        textAlign: 'center',
        color: '#7F8C8D',
        fontSize: '14px',
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
        maxWidth: '450px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: '0 0 8px 0',
    },
    modalSubtitle: {
        fontSize: '14px',
        color: '#95A5A6',
        margin: '0 0 24px 0',
    },
    noRiders: {
        textAlign: 'center',
        padding: '40px',
        color: '#95A5A6',
    },
    ridersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
    },
    riderCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: '#F8F9FA',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    riderAvatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: '#2D7A4F',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700',
    },
    riderDetails: {
        flex: 1,
    },
    riderName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2C3E50',
    },
    riderStats: {
        fontSize: '13px',
        color: '#95A5A6',
    },
    assignArrow: {
        fontSize: '20px',
        color: '#2D7A4F',
    },
    cancelModalBtn: {
        width: '100%',
        padding: '14px',
        background: '#F5F7FA',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
    },
};

export default Orders;
