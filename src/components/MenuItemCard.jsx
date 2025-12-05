import React from 'react';

const MenuItemCard = ({ item, onEdit, onDelete }) => {

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={item.image || 'https://via.placeholder.com/400'}
          alt={item.name}
          style={styles.image}
        />
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.name}>{item.name}</h3>
          <span style={styles.dayBadge}>{item.day}</span>
        </div>

        <p style={styles.description}>
          {item.description || 'No description'}
        </p>

        <div style={styles.meta}>
          <span style={styles.metaItem}>
            ⭐ {item.rating || 4.5}
          </span>
          <span style={styles.metaItem}>
            💰 ₹{item.price}
          </span>
        </div>

        <div style={styles.footer}>
          <div style={styles.actions}>
            <button
              style={styles.editButton}
              onClick={() => onEdit(item)}
            >
              ✏️ Edit
            </button>
            <button
              style={styles.deleteButton}
              onClick={() => onDelete(item.id)}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mealBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  content: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  name: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2C3E50',
    margin: 0,
  },
  dayBadge: {
    background: '#2D7A4F',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  description: {
    fontSize: '14px',
    color: '#7F8C8D',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  metaItem: {
    fontSize: '13px',
    color: '#95A5A6',
    fontWeight: '600',
  },
  footer: {
    paddingTop: '16px',
    borderTop: '1px solid #E8ECEF',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    flex: 1,
    padding: '10px 16px',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '10px 16px',
    background: '#F44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default MenuItemCard;
