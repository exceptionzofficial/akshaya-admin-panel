import React from 'react';
import Layout from '../components/layout/Layout';
import { MdPerson, MdNotifications, MdSecurity, MdPalette, MdStore } from 'react-icons/md';

const Settings = () => {
    const settingsSections = [
        {
            icon: MdStore,
            title: 'Store Settings',
            description: 'Manage your store name, address, and business hours',
            items: [
                { label: 'Store Name', value: 'Akshaya Kitchen' },
                { label: 'Address', value: '123 Main Street, City' },
                { label: 'Phone', value: '+91 98765 43210' },
            ]
        },
        {
            icon: MdPerson,
            title: 'Profile Settings',
            description: 'Update your admin profile and credentials',
            items: [
                { label: 'Admin Name', value: 'Super Admin' },
                { label: 'Email', value: 'admin@akshaya.com' },
            ]
        },
        {
            icon: MdNotifications,
            title: 'Notifications',
            description: 'Configure notification preferences',
            items: [
                { label: 'Order Alerts', value: 'Enabled', toggle: true },
                { label: 'Rider Updates', value: 'Enabled', toggle: true },
                { label: 'Daily Reports', value: 'Disabled', toggle: true },
            ]
        },
        {
            icon: MdSecurity,
            title: 'Security',
            description: 'Manage passwords and security settings',
            items: [
                { label: 'Two-Factor Auth', value: 'Disabled', toggle: true },
                { label: 'Last Password Change', value: '30 days ago' },
            ]
        },
    ];

    return (
        <Layout title="Settings">
            <div style={styles.container}>
                {settingsSections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <div key={idx} style={styles.section}>
                            <div style={styles.sectionHeader}>
                                <div style={styles.sectionIcon}>
                                    <Icon style={styles.icon} />
                                </div>
                                <div>
                                    <h3 style={styles.sectionTitle}>{section.title}</h3>
                                    <p style={styles.sectionDesc}>{section.description}</p>
                                </div>
                            </div>
                            <div style={styles.sectionContent}>
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} style={styles.settingRow}>
                                        <span style={styles.settingLabel}>{item.label}</span>
                                        {item.toggle ? (
                                            <div style={{
                                                ...styles.toggle,
                                                background: item.value === 'Enabled' ? '#2D7A4F' : '#E8ECEF',
                                            }}>
                                                <div style={{
                                                    ...styles.toggleDot,
                                                    transform: item.value === 'Enabled' ? 'translateX(20px)' : 'translateX(0)',
                                                }} />
                                            </div>
                                        ) : (
                                            <span style={styles.settingValue}>{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    section: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid #F0F2F5',
    },
    sectionIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #2D7A4F 0%, #1f5a37 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: '24px',
        color: '#fff',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: '0 0 4px 0',
    },
    sectionDesc: {
        fontSize: '14px',
        color: '#95A5A6',
        margin: 0,
    },
    sectionContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    settingRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#F8F9FA',
        borderRadius: '10px',
    },
    settingLabel: {
        fontSize: '15px',
        fontWeight: '500',
        color: '#2C3E50',
    },
    settingValue: {
        fontSize: '15px',
        color: '#7F8C8D',
    },
    toggle: {
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        padding: '2px',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    toggleDot: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#fff',
        transition: 'transform 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
};

export default Settings;
