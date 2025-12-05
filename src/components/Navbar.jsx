import React from 'react';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <span style={styles.logo}>🍃</span>
          <h1 style={styles.title}>Satvamirtham Admin</h1>
        </div>
        <div style={styles.info}>
          <span style={styles.badge}>Menu Management</span>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: '#2D7A4F',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    fontSize: '32px',
  },
  title: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  badge: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default Navbar;
