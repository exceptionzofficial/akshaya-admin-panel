import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { menuAPI } from '../services/api';

const MenuItemForm = ({ onItemAdded, editItem, onEditComplete }) => {
  const [formData, setFormData] = useState(editItem || {
    name: '',
    description: '',
    price: '',
    day: 'Monday',
    image: '',
    rating: '4.5',
  });
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.day) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating) || 4.5,
      };

      let response;
      if (editItem) {
        response = await menuAPI.updateItem(editItem.id, itemData);
        toast.success('Menu item updated successfully!');
        onEditComplete();
      } else {
        response = await menuAPI.createItem(itemData);
        toast.success('Menu item created successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        day: 'Monday',
        image: '',
        rating: '4.5',
      });

      onItemAdded();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(error.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formTitle}>
        {editItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Day and Meal Type Selection */}
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Day *</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              style={styles.select}
              required
            >
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Item Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Item Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g., Organic Salad Bowl"
            required
          />
        </div>

        {/* Description */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Brief description of the item"
            rows="3"
          />
        </div>

        {/* Price and Rating */}
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={styles.input}
              placeholder="120"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Rating (0-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              style={styles.input}
              placeholder="4.5"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        {/* Image URL */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            style={styles.input}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Preview */}
        {formData.image && (
          <div style={styles.previewContainer}>
            <label style={styles.label}>Image Preview:</label>
            <img
              src={formData.image}
              alt="Preview"
              style={styles.previewImage}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}

        {/* Info Box */}
        <div style={styles.infoBox}>
          <span style={styles.infoIcon}>ℹ️</span>
          <div style={styles.infoText}>
            <strong>Note:</strong> This item will be available on <strong>{formData.day}</strong>.
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? '⏳ Saving...' : editItem ? '💾 Update Item' : '➕ Add Item'}
          </button>

          {editItem && (
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onEditComplete}
            >
              ❌ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '32px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2C3E50',
  },
  input: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #E8ECEF',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border 0.3s',
  },
  select: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #E8ECEF',
    borderRadius: '8px',
    outline: 'none',
    background: 'white',
    cursor: 'pointer',
  },
  textarea: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #E8ECEF',
    borderRadius: '8px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  previewContainer: {
    marginTop: '8px',
  },
  previewImage: {
    width: '200px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '8px',
    border: '2px solid #E8ECEF',
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: '#E8F5E9',
    borderRadius: '8px',
    borderLeft: '4px solid #2D7A4F',
  },
  infoIcon: {
    fontSize: '20px',
  },
  infoText: {
    fontSize: '14px',
    color: '#2D7A4F',
    lineHeight: '1.5',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  submitButton: {
    flex: 1,
    padding: '16px 32px',
    background: '#2D7A4F',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  cancelButton: {
    padding: '16px 32px',
    background: '#F44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};

export default MenuItemForm;
