import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    MdDashboard,
    MdRestaurantMenu,
    MdDeliveryDining,
    MdAnalytics,
    MdShoppingCart,
    MdLogout,
    MdSettings,
    MdPeople
} from 'react-icons/md';
import logo from '../../assets/logo.png';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: MdDashboard, label: 'Dashboard' },
        { path: '/orders', icon: MdShoppingCart, label: 'Orders' },
        { path: '/riders', icon: MdDeliveryDining, label: 'Riders' },
        { path: '/users', icon: MdPeople, label: 'Users' },
        { path: '/menu-items', icon: MdRestaurantMenu, label: 'Menu Items' },
        { path: '/analytics', icon: MdAnalytics, label: 'Analytics' },
    ];

    const bottomItems = [
        { path: '/settings', icon: MdSettings, label: 'Settings' },
    ];

    return (
        <aside style={styles.sidebar}>
            {/* Logo Section */}
            <div style={styles.logoSection}>
                <img src={logo} alt="Akshaya" style={styles.logo} />
                <span style={styles.logoText}>Akshaya Admin</span>
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navSection}>
                    <span style={styles.navLabel}>MAIN MENU</span>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={{
                                    ...styles.navItem,
                                    ...(isActive ? styles.navItemActive : {}),
                                }}
                            >
                                <Icon style={{
                                    ...styles.navIcon,
                                    ...(isActive ? styles.navIconActive : {}),
                                }} />
                                <span style={styles.navText}>{item.label}</span>
                                {isActive && <div style={styles.activeIndicator} />}
                            </NavLink>
                        );
                    })}
                </div>

                <div style={styles.navSection}>
                    <span style={styles.navLabel}>SETTINGS</span>
                    {bottomItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={{
                                    ...styles.navItem,
                                    ...(isActive ? styles.navItemActive : {}),
                                }}
                            >
                                <Icon style={{
                                    ...styles.navIcon,
                                    ...(isActive ? styles.navIconActive : {}),
                                }} />
                                <span style={styles.navText}>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div style={styles.logoutSection}>
                <button style={styles.logoutButton}>
                    <MdLogout style={styles.logoutIcon} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: '260px',
        height: '100vh',
        background: 'linear-gradient(180deg, #1a1f2e 0%, #252b3d 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
    },
    logoSection: {
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    logo: {
        width: '45px',
        height: '45px',
        borderRadius: '10px',
        objectFit: 'cover',
    },
    logoText: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '700',
    },
    nav: {
        flex: 1,
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto',
    },
    navSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    navLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '1px',
        padding: '0 12px',
        marginBottom: '8px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
        textDecoration: 'none',
        color: 'rgba(255,255,255,0.7)',
        transition: 'all 0.2s ease',
        position: 'relative',
    },
    navItemActive: {
        background: 'linear-gradient(135deg, #2D7A4F 0%, #1f5a37 100%)',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(45, 122, 79, 0.3)',
    },
    navIcon: {
        fontSize: '22px',
    },
    navIconActive: {
        color: '#fff',
    },
    navText: {
        fontSize: '15px',
        fontWeight: '500',
    },
    activeIndicator: {
        position: 'absolute',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '24px',
        background: '#fff',
        borderRadius: '4px 0 0 4px',
    },
    logoutSection: {
        padding: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    logoutButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        borderRadius: '10px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    logoutIcon: {
        fontSize: '20px',
    },
};

export default Sidebar;
