import React from 'react';
import Sidebar from './Sidebar';
import { MdNotifications, MdPerson } from 'react-icons/md';

const Layout = ({ children, title }) => {
    return (
        <div style={styles.layout}>
            <Sidebar />

            <main style={styles.main}>
                {/* Top Header */}
                <header style={styles.header}>
                    <div style={styles.headerLeft}>
                        <h1 style={styles.pageTitle}>{title}</h1>
                        <p style={styles.breadcrumb}>Admin / {title}</p>
                    </div>

                    <div style={styles.headerRight}>
                        <button style={styles.notificationBtn}>
                            <MdNotifications style={styles.headerIcon} />
                            <span style={styles.notificationBadge}>3</span>
                        </button>

                        <div style={styles.userSection}>
                            <div style={styles.avatar}>
                                <MdPerson style={styles.avatarIcon} />
                            </div>
                            <div style={styles.userInfo}>
                                <span style={styles.userName}>Admin</span>
                                <span style={styles.userRole}>Super Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f5f7fa',
    },
    main: {
        flex: 1,
        marginLeft: '260px',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 32px',
        background: '#fff',
        borderBottom: '1px solid #e8ecef',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    headerLeft: {},
    pageTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: 0,
    },
    breadcrumb: {
        fontSize: '13px',
        color: '#95A5A6',
        margin: '4px 0 0 0',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    notificationBtn: {
        position: 'relative',
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        border: 'none',
        background: '#f5f7fa',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        fontSize: '22px',
        color: '#7F8C8D',
    },
    notificationBadge: {
        position: 'absolute',
        top: '6px',
        right: '6px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: '#E74C3C',
        color: '#fff',
        fontSize: '11px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        background: '#f5f7fa',
        borderRadius: '12px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #2D7A4F 0%, #1f5a37 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarIcon: {
        fontSize: '24px',
        color: '#fff',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2C3E50',
    },
    userRole: {
        fontSize: '12px',
        color: '#95A5A6',
    },
    content: {
        flex: 1,
        padding: '32px',
        overflowY: 'auto',
    },
};

export default Layout;
