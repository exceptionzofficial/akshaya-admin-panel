import React from 'react';
import MenuItemCard from './MenuItemCard';

const MenuItemList = ({ items, loading, onEdit, onDelete, currentDay }) => {
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading menu items...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📭</div>
        <h3>No menu items for {currentDay}</h3>
        <p>Add menu items for today using the form above</p>
      </div>
    );
  }

  // Group items by meal type
  const groupedItems = {
    breakfast: items.filter(item => item.mealType === 'breakfast'),
    lunch: items.filter(item => item.mealType === 'lunch'),
    dinner: items.filter(item => item.mealType === 'dinner')
  };

  const mealTypeLabels = {
    breakfast: { label: 'Breakfast', icon: '🌅', color: '#FFB800' },
    lunch: { label: 'Lunch', icon: '☀️', color: '#FF6347' },
    dinner: { label: 'Dinner', icon: '🌙', color: '#9C27B0' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📅 {currentDay}'s Menu ({items.length} items)</h2>
      </div>
      
      {Object.keys(groupedItems).map(mealType => {
        const mealItems = groupedItems[mealType];
        if (mealItems.length === 0) return null;

        const mealInfo = mealTypeLabels[mealType];
        
        return (
          <div key={mealType} style={styles.mealSection}>
            <div style={styles.mealHeader}>
              <span style={styles.mealIcon}>{mealInfo.icon}</span>
              <h3 style={{ ...styles.mealTitle, color: mealInfo.color }}>
                {mealInfo.label} ({mealItems.length})
              </h3>
            </div>
            
            <div style={styles.grid}>
              {mealItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2C3E50',
  },
  mealSection: {
    marginBottom: '32px',
  },
  mealHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #E8ECEF',
  },
  mealIcon: {
    fontSize: '28px',
    marginRight: '12px',
  },
  mealTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
  },
  spinner: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
};

export default MenuItemList;
