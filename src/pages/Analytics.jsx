import React from 'react';
import Layout from '../components/layout/Layout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
    // Mock data for charts
    const ordersTrend = [
        { day: 'Mon', orders: 45, revenue: 5400 },
        { day: 'Tue', orders: 52, revenue: 6240 },
        { day: 'Wed', orders: 38, revenue: 4560 },
        { day: 'Thu', orders: 65, revenue: 7800 },
        { day: 'Fri', orders: 78, revenue: 9360 },
        { day: 'Sat', orders: 92, revenue: 11040 },
        { day: 'Sun', orders: 85, revenue: 10200 },
    ];

    const popularItems = [
        { name: 'Chicken Biryani', orders: 156, revenue: 24960 },
        { name: 'Paneer Butter Masala', orders: 134, revenue: 16080 },
        { name: 'Veg Thali', orders: 98, revenue: 14700 },
        { name: 'Fish Curry', orders: 87, revenue: 13920 },
        { name: 'Dosa Combo', orders: 76, revenue: 9120 },
    ];

    const mealTypeData = [
        { name: 'Breakfast', value: 25, color: '#F39C12' },
        { name: 'Lunch', value: 45, color: '#3498DB' },
        { name: 'Dinner', value: 30, color: '#9B59B6' },
    ];

    const stats = [
        { label: 'Total Orders', value: '455', change: '+12.5%', positive: true },
        { label: 'Total Revenue', value: '₹54,540', change: '+18.2%', positive: true },
        { label: 'Avg Order Value', value: '₹119.87', change: '+5.3%', positive: true },
        { label: 'Active Customers', value: '312', change: '-2.1%', positive: false },
    ];

    return (
        <Layout title="Analytics">
            {/* Stats Row */}
            <div style={styles.statsRow}>
                {stats.map((stat, idx) => (
                    <div key={idx} style={styles.statCard}>
                        <span style={styles.statLabel}>{stat.label}</span>
                        <span style={styles.statValue}>{stat.value}</span>
                        <span style={{
                            ...styles.statChange,
                            color: stat.positive ? '#27AE60' : '#E74C3C',
                            background: stat.positive ? '#E8F5E9' : '#FFEBEE',
                        }}>
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={styles.chartsRow}>
                {/* Orders Trend Chart */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Orders Trend (This Week)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={ordersTrend}>
                            <defs>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2D7A4F" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2D7A4F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECEF" />
                            <XAxis dataKey="day" stroke="#95A5A6" />
                            <YAxis stroke="#95A5A6" />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="orders"
                                stroke="#2D7A4F"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorOrders)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Meal Type Distribution */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Orders by Meal Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={mealTypeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {mealTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={styles.legend}>
                        {mealTypeData.map((item, idx) => (
                            <div key={idx} style={styles.legendItem}>
                                <span style={{ ...styles.legendDot, background: item.color }} />
                                <span>{item.name}: {item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Items */}
            <div style={styles.popularSection}>
                <h3 style={styles.chartTitle}>Popular Items (This Week)</h3>
                <div style={styles.popularGrid}>
                    {popularItems.map((item, idx) => (
                        <div key={idx} style={styles.popularCard}>
                            <div style={styles.popularRank}>#{idx + 1}</div>
                            <div style={styles.popularInfo}>
                                <span style={styles.popularName}>{item.name}</span>
                                <span style={styles.popularOrders}>{item.orders} orders</span>
                            </div>
                            <div style={styles.popularRevenue}>₹{item.revenue.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Revenue Chart */}
            <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Revenue Trend (This Week)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ordersTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8ECEF" />
                        <XAxis dataKey="day" stroke="#95A5A6" />
                        <YAxis stroke="#95A5A6" />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value) => [`₹${value}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" fill="#3498DB" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Layout>
    );
};

const styles = {
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
    },
    statCard: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    statLabel: {
        fontSize: '14px',
        color: '#95A5A6',
    },
    statValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#2C3E50',
    },
    statChange: {
        alignSelf: 'flex-start',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
    },
    chartsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '24px',
    },
    chartCard: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        marginBottom: '24px',
    },
    chartTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: '0 0 20px 0',
    },
    legend: {
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginTop: '20px',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#7F8C8D',
    },
    legendDot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
    },
    popularSection: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        marginBottom: '24px',
    },
    popularGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    popularCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        background: '#F8F9FA',
        borderRadius: '12px',
        gap: '16px',
    },
    popularRank: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #2D7A4F 0%, #1f5a37 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700',
    },
    popularInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    popularName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#2C3E50',
    },
    popularOrders: {
        fontSize: '13px',
        color: '#95A5A6',
    },
    popularRevenue: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2D7A4F',
    },
};

export default Analytics;
