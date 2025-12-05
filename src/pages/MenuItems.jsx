import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { toast } from 'react-toastify';
import { packagesAPI, singlesAPI } from '../services/api';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdVisibility, MdVisibilityOff, MdClose, MdRestaurantMenu, MdFastfood, MdRefresh, MdImage } from 'react-icons/md';

const MenuItems = () => {
    // Menu Type: 'package' or 'single'
    const [menuType, setMenuType] = useState('package');
    const [loading, setLoading] = useState(false);

    // Package Meal States
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [selectedMealType, setSelectedMealType] = useState('all');
    const [showPackageForm, setShowPackageForm] = useState(false);
    const [editPackage, setEditPackage] = useState(null);
    const [packageMeals, setPackageMeals] = useState([]);
    const [packageFormData, setPackageFormData] = useState({
        name: '',
        description: '',
        price: '',
        day: 'Monday',
        mealType: 'lunch',
        image: '',
        items: [], // Now stores objects: { name: string, image: string }
    });
    // New item form with name and image
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState('');

    // Package Details Modal
    const [showPackageDetails, setShowPackageDetails] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Single Meal States
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showSingleForm, setShowSingleForm] = useState(false);
    const [editSingle, setEditSingle] = useState(null);
    const [singleMeals, setSingleMeals] = useState([]);
    const [singleFormData, setSingleFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Soups',
        image: '',
        isVisible: true,
    });

    const [searchQuery, setSearchQuery] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = [
        { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: '#F39C12' },
        { id: 'lunch', label: 'Lunch', icon: '☀️', color: '#3498DB' },
        { id: 'dinner', label: 'Dinner', icon: '🌙', color: '#9B59B6' },
    ];

    const singleMealCategories = [
        'Soups',
        'Classic Soups',
        'Traditional & Healthy Soups',
        'Salads',
        'International Salads',
        'Shutters Veg',
        'Starters & Snacks',
        'Chaat',
        'Sandwich',
        'Mojito',
        'Milk Shake',
        'Fresh Juices',
        'Falooda & Desserts',
    ];

    // Fetch packages when day changes
    useEffect(() => {
        if (menuType === 'package') {
            fetchPackages();
        }
    }, [selectedDay, menuType]);

    // Fetch singles when menu type changes to single
    useEffect(() => {
        if (menuType === 'single') {
            fetchSingles();
        }
    }, [menuType]);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const mealTypeParam = selectedMealType !== 'all' ? selectedMealType : null;
            const response = await packagesAPI.getByDay(selectedDay, mealTypeParam);
            if (response.success) {
                setPackageMeals(response.data.packages || []);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
            toast.error('Failed to load packages');
        } finally {
            setLoading(false);
        }
    };

    const fetchSingles = async () => {
        setLoading(true);
        try {
            const response = await singlesAPI.getAll(true);
            if (response.success) {
                setSingleMeals(response.data.items || []);
            }
        } catch (error) {
            console.error('Error fetching singles:', error);
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    // Filtered data based on selections
    const filteredPackages = packageMeals.filter(pkg => {
        const matchesMealType = selectedMealType === 'all' || pkg.mealType === selectedMealType;
        const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesMealType && matchesSearch;
    });

    const filteredSingles = singleMeals.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Package Meal Handlers
    const handleAddPackageItem = () => {
        if (newItemName.trim()) {
            const newItem = {
                name: newItemName.trim(),
                image: newItemImage.trim() || 'https://via.placeholder.com/150',
            };
            setPackageFormData(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));
            setNewItemName('');
            setNewItemImage('');
        } else {
            toast.error('Please enter item name');
        }
    };

    const handleRemovePackageItem = (index) => {
        setPackageFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handlePackageSubmit = async (e) => {
        e.preventDefault();
        if (!packageFormData.name || !packageFormData.price || packageFormData.items.length === 0) {
            toast.error('Please fill name, price and add at least one item');
            return;
        }

        try {
            const data = {
                ...packageFormData,
                price: parseFloat(packageFormData.price),
            };

            if (editPackage) {
                await packagesAPI.update(editPackage.id, data);
                toast.success('Package updated successfully!');
            } else {
                await packagesAPI.create(data);
                toast.success('Package created successfully!');
            }
            resetPackageForm();
            fetchPackages();
        } catch (error) {
            console.error('Error saving package:', error);
            toast.error('Failed to save package');
        }
    };

    const handleEditPackage = (pkg) => {
        setEditPackage(pkg);
        // Convert items to new format if they are strings
        const items = (pkg.items || []).map(item =>
            typeof item === 'string' ? { name: item, image: 'https://via.placeholder.com/150' } : item
        );
        setPackageFormData({
            name: pkg.name,
            description: pkg.description || '',
            price: pkg.price.toString(),
            day: pkg.day,
            mealType: pkg.mealType,
            image: pkg.image || '',
            items: items,
        });
        setShowPackageForm(true);
    };

    const handleViewPackageDetails = (pkg) => {
        setSelectedPackage(pkg);
        setShowPackageDetails(true);
    };

    const handleDeletePackage = async (id) => {
        if (window.confirm('Delete this package?')) {
            try {
                await packagesAPI.delete(id);
                toast.success('Package deleted');
                fetchPackages();
            } catch (error) {
                toast.error('Failed to delete package');
            }
        }
    };

    const resetPackageForm = () => {
        setPackageFormData({
            name: '',
            description: '',
            price: '',
            day: selectedDay,
            mealType: 'lunch',
            image: '',
            items: [],
        });
        setEditPackage(null);
        setShowPackageForm(false);
        setNewItemName('');
        setNewItemImage('');
    };

    // Single Meal Handlers
    const handleSingleSubmit = async (e) => {
        e.preventDefault();
        if (!singleFormData.name || !singleFormData.price || !singleFormData.category) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const data = {
                ...singleFormData,
                price: parseFloat(singleFormData.price),
            };

            if (editSingle) {
                await singlesAPI.update(editSingle.id, data);
                toast.success('Item updated successfully!');
            } else {
                await singlesAPI.create(data);
                toast.success('Item created successfully!');
            }
            resetSingleForm();
            fetchSingles();
        } catch (error) {
            console.error('Error saving item:', error);
            toast.error('Failed to save item');
        }
    };

    const handleEditSingle = (item) => {
        setEditSingle(item);
        setSingleFormData({
            name: item.name,
            description: item.description || '',
            price: item.price.toString(),
            category: item.category,
            image: item.image || '',
            isVisible: item.isVisible,
        });
        setShowSingleForm(true);
    };

    const handleDeleteSingle = async (id) => {
        if (window.confirm('Delete this item?')) {
            try {
                await singlesAPI.delete(id);
                toast.success('Item deleted');
                fetchSingles();
            } catch (error) {
                toast.error('Failed to delete item');
            }
        }
    };

    const toggleVisibility = async (item) => {
        try {
            await singlesAPI.toggleVisibility(item.id, !item.isVisible);
            toast.success(`Item ${!item.isVisible ? 'shown' : 'hidden'}`);
            fetchSingles();
        } catch (error) {
            toast.error('Failed to toggle visibility');
        }
    };

    const resetSingleForm = () => {
        setSingleFormData({
            name: '',
            description: '',
            price: '',
            category: 'Soups',
            image: '',
            isVisible: true,
        });
        setEditSingle(null);
        setShowSingleForm(false);
    };

    const getMealTypeStyle = (mealType) => {
        return mealTypes.find(t => t.id === mealType) || mealTypes[1];
    };

    // Helper to get item display (handles both string and object formats)
    const getItemName = (item) => typeof item === 'string' ? item : item.name;
    const getItemImage = (item) => typeof item === 'string' ? 'https://via.placeholder.com/150' : (item.image || 'https://via.placeholder.com/150');

    return (
        <Layout title="Menu Items">
            {/* Menu Type Toggle */}
            <div style={styles.menuTypeToggle}>
                <button
                    style={{
                        ...styles.menuTypeBtn,
                        ...(menuType === 'package' ? styles.menuTypeBtnActive : {}),
                    }}
                    onClick={() => setMenuType('package')}
                >
                    <MdRestaurantMenu style={styles.menuTypeIcon} />
                    <div style={styles.menuTypeBtnContent}>
                        <span style={styles.menuTypeBtnTitle}>Package Meals</span>
                        <span style={styles.menuTypeBtnDesc}>Bundled items for specific days</span>
                    </div>
                </button>
                <button
                    style={{
                        ...styles.menuTypeBtn,
                        ...(menuType === 'single' ? styles.menuTypeBtnActive : {}),
                    }}
                    onClick={() => setMenuType('single')}
                >
                    <MdFastfood style={styles.menuTypeIcon} />
                    <div style={styles.menuTypeBtnContent}>
                        <span style={styles.menuTypeBtnTitle}>Single Meals</span>
                        <span style={styles.menuTypeBtnDesc}>Individual items, available all days</span>
                    </div>
                </button>
            </div>

            {/* PACKAGE MEALS SECTION */}
            {menuType === 'package' && (
                <>
                    {/* Day Selector */}
                    <div style={styles.daySelector}>
                        {days.map((day) => (
                            <button
                                key={day}
                                style={{
                                    ...styles.dayBtn,
                                    ...(selectedDay === day ? styles.dayBtnActive : {}),
                                }}
                                onClick={() => setSelectedDay(day)}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div style={styles.toolbar}>
                        <div style={styles.searchBox}>
                            <MdSearch style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search packages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>

                        <div style={styles.mealTypeFilter}>
                            <button
                                style={{
                                    ...styles.mealTypeBtn,
                                    ...(selectedMealType === 'all' ? styles.mealTypeBtnActive : {}),
                                }}
                                onClick={() => setSelectedMealType('all')}
                            >
                                All
                            </button>
                            {mealTypes.map((type) => (
                                <button
                                    key={type.id}
                                    style={{
                                        ...styles.mealTypeBtn,
                                        ...(selectedMealType === type.id ? { ...styles.mealTypeBtnActive, background: type.color } : {}),
                                    }}
                                    onClick={() => setSelectedMealType(type.id)}
                                >
                                    {type.icon} {type.label}
                                </button>
                            ))}
                        </div>

                        <button style={styles.refreshBtn} onClick={fetchPackages}>
                            <MdRefresh />
                        </button>

                        <button style={styles.addBtn} onClick={() => { setEditPackage(null); setShowPackageForm(true); }}>
                            <MdAdd /> Add Package
                        </button>
                    </div>

                    {/* Package Cards */}
                    <div style={styles.itemsGrid}>
                        {loading ? (
                            <div style={styles.loadingState}>Loading packages...</div>
                        ) : filteredPackages.length === 0 ? (
                            <div style={styles.emptyState}>
                                <span style={styles.emptyIcon}>📦</span>
                                <p>No packages found for {selectedDay}</p>
                                <button style={styles.addFirstBtn} onClick={() => setShowPackageForm(true)}>
                                    Create First Package
                                </button>
                            </div>
                        ) : (
                            filteredPackages.map((pkg) => {
                                const mealStyle = getMealTypeStyle(pkg.mealType);
                                return (
                                    <div key={pkg.id} style={styles.packageCard}>
                                        <div style={styles.packageImageContainer}>
                                            <img
                                                src={pkg.image || 'https://via.placeholder.com/300x180'}
                                                alt={pkg.name}
                                                style={styles.packageImage}
                                            />
                                            <span style={{ ...styles.mealTypeBadge, background: mealStyle.color }}>
                                                {mealStyle.icon} {mealStyle.label}
                                            </span>
                                            <span style={styles.dayBadge}>{pkg.day}</span>
                                        </div>
                                        <div style={styles.packageContent}>
                                            <div style={styles.packageHeader}>
                                                <h3 style={styles.packageName}>{pkg.name}</h3>
                                                <span style={styles.packagePrice}>₹{pkg.price}</span>
                                            </div>
                                            <p style={styles.packageDesc}>{pkg.description}</p>

                                            <div style={styles.packageItems}>
                                                <span style={styles.packageItemsLabel}>
                                                    Includes {(pkg.items || []).length} items:
                                                </span>
                                                <div style={styles.packageItemsPreview}>
                                                    {(pkg.items || []).slice(0, 4).map((item, idx) => (
                                                        <div key={idx} style={styles.itemPreviewChip}>
                                                            <img
                                                                src={getItemImage(item)}
                                                                alt={getItemName(item)}
                                                                style={styles.itemPreviewImg}
                                                            />
                                                            <span style={styles.itemPreviewName}>{getItemName(item)}</span>
                                                        </div>
                                                    ))}
                                                    {(pkg.items || []).length > 4 && (
                                                        <span style={styles.moreItems}>+{pkg.items.length - 4} more</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={styles.packageActions}>
                                                <button style={styles.viewBtn} onClick={() => handleViewPackageDetails(pkg)}>
                                                    <MdVisibility /> View Details
                                                </button>
                                                <button style={styles.editBtn} onClick={() => handleEditPackage(pkg)}>
                                                    <MdEdit /> Edit
                                                </button>
                                                <button style={styles.deleteBtn} onClick={() => handleDeletePackage(pkg.id)}>
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}

            {/* SINGLE MEALS SECTION */}
            {menuType === 'single' && (
                <>
                    {/* Category Selector */}
                    <div style={styles.categorySelector}>
                        <button
                            style={{
                                ...styles.categoryBtn,
                                ...(selectedCategory === 'all' ? styles.categoryBtnActive : {}),
                            }}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All Categories
                        </button>
                        {singleMealCategories.map((cat) => (
                            <button
                                key={cat}
                                style={{
                                    ...styles.categoryBtn,
                                    ...(selectedCategory === cat ? styles.categoryBtnActive : {}),
                                }}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div style={styles.toolbar}>
                        <div style={styles.searchBox}>
                            <MdSearch style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>

                        <button style={styles.refreshBtn} onClick={fetchSingles}>
                            <MdRefresh />
                        </button>

                        <button style={styles.addBtn} onClick={() => { setEditSingle(null); setShowSingleForm(true); }}>
                            <MdAdd /> Add Item
                        </button>
                    </div>

                    {/* Single Meal Cards */}
                    <div style={styles.itemsGrid}>
                        {loading ? (
                            <div style={styles.loadingState}>Loading items...</div>
                        ) : filteredSingles.length === 0 ? (
                            <div style={styles.emptyState}>
                                <span style={styles.emptyIcon}>🍽️</span>
                                <p>No items found in this category</p>
                                <button style={styles.addFirstBtn} onClick={() => setShowSingleForm(true)}>
                                    Add First Item
                                </button>
                            </div>
                        ) : (
                            filteredSingles.map((item) => (
                                <div key={item.id} style={{
                                    ...styles.singleCard,
                                    opacity: item.isVisible ? 1 : 0.6,
                                }}>
                                    <div style={styles.singleImageContainer}>
                                        <img
                                            src={item.image || 'https://via.placeholder.com/300x180'}
                                            alt={item.name}
                                            style={styles.singleImage}
                                        />
                                        <span style={styles.categoryBadge}>{item.category}</span>
                                        {!item.isVisible && (
                                            <div style={styles.hiddenOverlay}>
                                                <MdVisibilityOff style={styles.hiddenIcon} />
                                                <span>Hidden</span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={styles.singleContent}>
                                        <div style={styles.singleHeader}>
                                            <h3 style={styles.singleName}>{item.name}</h3>
                                            <span style={styles.singlePrice}>₹{item.price}</span>
                                        </div>
                                        <p style={styles.singleDesc}>{item.description}</p>

                                        <div style={styles.singleActions}>
                                            <button
                                                style={{
                                                    ...styles.visibilityBtn,
                                                    background: item.isVisible ? '#E8F5E9' : '#FFEBEE',
                                                    color: item.isVisible ? '#2D7A4F' : '#E74C3C',
                                                }}
                                                onClick={() => toggleVisibility(item)}
                                            >
                                                {item.isVisible ? <MdVisibility /> : <MdVisibilityOff />}
                                                {item.isVisible ? 'Visible' : 'Hidden'}
                                            </button>
                                            <button style={styles.editBtnSmall} onClick={() => handleEditSingle(item)}>
                                                <MdEdit />
                                            </button>
                                            <button style={styles.deleteBtnSmall} onClick={() => handleDeleteSingle(item.id)}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* PACKAGE FORM MODAL */}
            {showPackageForm && (
                <div style={styles.modalOverlay} onClick={resetPackageForm}>
                    <div style={styles.modalLarge} onClick={e => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>
                            {editPackage ? '✏️ Edit Package' : '📦 Create Package'}
                        </h2>
                        <form onSubmit={handlePackageSubmit} style={styles.form}>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Day *</label>
                                    <select
                                        value={packageFormData.day}
                                        onChange={(e) => setPackageFormData({ ...packageFormData, day: e.target.value })}
                                        style={styles.select}
                                    >
                                        {days.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Meal Type *</label>
                                    <select
                                        value={packageFormData.mealType}
                                        onChange={(e) => setPackageFormData({ ...packageFormData, mealType: e.target.value })}
                                        style={styles.select}
                                    >
                                        {mealTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Package Name *</label>
                                <input
                                    type="text"
                                    value={packageFormData.name}
                                    onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                                    style={styles.input}
                                    placeholder="e.g., Friday Special Lunch"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={packageFormData.description}
                                    onChange={(e) => setPackageFormData({ ...packageFormData, description: e.target.value })}
                                    style={styles.textarea}
                                    placeholder="Brief description"
                                    rows={2}
                                />
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Package Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={packageFormData.price}
                                        onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                                        style={styles.input}
                                        placeholder="150"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Package Cover Image URL</label>
                                    <input
                                        type="url"
                                        value={packageFormData.image}
                                        onChange={(e) => setPackageFormData({ ...packageFormData, image: e.target.value })}
                                        style={styles.input}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Package Items with Images */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Items in Package * (with images)</label>
                                <div style={styles.addItemSection}>
                                    <div style={styles.addItemInputs}>
                                        <input
                                            type="text"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                            style={{ ...styles.input, flex: 2 }}
                                            placeholder="Item name (e.g., Rice, Sambar)"
                                        />
                                        <input
                                            type="url"
                                            value={newItemImage}
                                            onChange={(e) => setNewItemImage(e.target.value)}
                                            style={{ ...styles.input, flex: 3 }}
                                            placeholder="Item image URL (optional)"
                                        />
                                        <button type="button" style={styles.addItemBtn} onClick={handleAddPackageItem}>
                                            <MdAdd /> Add
                                        </button>
                                    </div>
                                </div>

                                {/* Items Grid */}
                                <div style={styles.itemsEditGrid}>
                                    {packageFormData.items.map((item, idx) => (
                                        <div key={idx} style={styles.itemEditCard}>
                                            <img
                                                src={getItemImage(item)}
                                                alt={getItemName(item)}
                                                style={styles.itemEditImage}
                                            />
                                            <div style={styles.itemEditInfo}>
                                                <span style={styles.itemEditName}>{getItemName(item)}</span>
                                                <button
                                                    type="button"
                                                    style={styles.itemRemoveBtn}
                                                    onClick={() => handleRemovePackageItem(idx)}
                                                >
                                                    <MdClose />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {packageFormData.items.length === 0 && (
                                    <div style={styles.noItemsHint}>
                                        <MdImage style={{ fontSize: 24, opacity: 0.5 }} />
                                        <span>Add items with images to this package</span>
                                    </div>
                                )}
                            </div>

                            <div style={styles.modalActions}>
                                <button type="button" style={styles.cancelBtn} onClick={resetPackageForm}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitBtn}>
                                    {editPackage ? 'Update Package' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PACKAGE DETAILS MODAL */}
            {showPackageDetails && selectedPackage && (
                <div style={styles.modalOverlay} onClick={() => setShowPackageDetails(false)}>
                    <div style={styles.detailsModal} onClick={e => e.stopPropagation()}>
                        <div style={styles.detailsHeader}>
                            <img
                                src={selectedPackage.image || 'https://via.placeholder.com/600x200'}
                                alt={selectedPackage.name}
                                style={styles.detailsCoverImage}
                            />
                            <div style={styles.detailsOverlay}>
                                <div style={styles.detailsBadges}>
                                    <span style={{ ...styles.detailsMealBadge, background: getMealTypeStyle(selectedPackage.mealType).color }}>
                                        {getMealTypeStyle(selectedPackage.mealType).icon} {getMealTypeStyle(selectedPackage.mealType).label}
                                    </span>
                                    <span style={styles.detailsDayBadge}>{selectedPackage.day}</span>
                                </div>
                                <h2 style={styles.detailsTitle}>{selectedPackage.name}</h2>
                                <p style={styles.detailsDesc}>{selectedPackage.description}</p>
                                <span style={styles.detailsPrice}>₹{selectedPackage.price}</span>
                            </div>
                            <button style={styles.detailsCloseBtn} onClick={() => setShowPackageDetails(false)}>
                                <MdClose />
                            </button>
                        </div>

                        <div style={styles.detailsBody}>
                            <h3 style={styles.detailsItemsTitle}>
                                Package Items ({(selectedPackage.items || []).length})
                            </h3>
                            <div style={styles.detailsItemsGrid}>
                                {(selectedPackage.items || []).map((item, idx) => (
                                    <div key={idx} style={styles.detailsItemCard}>
                                        <img
                                            src={getItemImage(item)}
                                            alt={getItemName(item)}
                                            style={styles.detailsItemImage}
                                        />
                                        <span style={styles.detailsItemName}>{getItemName(item)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SINGLE MEAL FORM MODAL */}
            {showSingleForm && (
                <div style={styles.modalOverlay} onClick={resetSingleForm}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>
                            {editSingle ? '✏️ Edit Item' : '🍽️ Add Single Item'}
                        </h2>
                        <form onSubmit={handleSingleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Category *</label>
                                <select
                                    value={singleFormData.category}
                                    onChange={(e) => setSingleFormData({ ...singleFormData, category: e.target.value })}
                                    style={styles.select}
                                >
                                    {singleMealCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Item Name *</label>
                                <input
                                    type="text"
                                    value={singleFormData.name}
                                    onChange={(e) => setSingleFormData({ ...singleFormData, name: e.target.value })}
                                    style={styles.input}
                                    placeholder="e.g., Tomato Soup"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={singleFormData.description}
                                    onChange={(e) => setSingleFormData({ ...singleFormData, description: e.target.value })}
                                    style={styles.textarea}
                                    placeholder="Brief description"
                                    rows={2}
                                />
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={singleFormData.price}
                                        onChange={(e) => setSingleFormData({ ...singleFormData, price: e.target.value })}
                                        style={styles.input}
                                        placeholder="80"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Image URL</label>
                                    <input
                                        type="url"
                                        value={singleFormData.image}
                                        onChange={(e) => setSingleFormData({ ...singleFormData, image: e.target.value })}
                                        style={styles.input}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Visibility</label>
                                <div style={styles.visibilityToggle}>
                                    <button
                                        type="button"
                                        style={{
                                            ...styles.visibilityOption,
                                            ...(singleFormData.isVisible ? styles.visibilityOptionActive : {}),
                                        }}
                                        onClick={() => setSingleFormData({ ...singleFormData, isVisible: true })}
                                    >
                                        <MdVisibility /> Visible
                                    </button>
                                    <button
                                        type="button"
                                        style={{
                                            ...styles.visibilityOption,
                                            ...(!singleFormData.isVisible ? styles.visibilityOptionHidden : {}),
                                        }}
                                        onClick={() => setSingleFormData({ ...singleFormData, isVisible: false })}
                                    >
                                        <MdVisibilityOff /> Hidden
                                    </button>
                                </div>
                            </div>

                            <div style={styles.infoBox}>
                                <span>ℹ️</span>
                                <span>Single items are available <strong>every day</strong>. Use visibility toggle to temporarily hide items.</span>
                            </div>

                            <div style={styles.modalActions}>
                                <button type="button" style={styles.cancelBtn} onClick={resetSingleForm}>
                                    Cancel
                                </button>
                                <button type="submit" style={styles.submitBtn}>
                                    {editSingle ? 'Update Item' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

const styles = {
    menuTypeToggle: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
    },
    menuTypeBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px 24px',
        background: '#fff',
        border: '2px solid #E8ECEF',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
    },
    menuTypeBtnActive: {
        background: 'linear-gradient(135deg, #2D7A4F 0%, #1f5a37 100%)',
        borderColor: '#2D7A4F',
        color: '#fff',
    },
    menuTypeIcon: {
        fontSize: '32px',
    },
    menuTypeBtnContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    menuTypeBtnTitle: {
        fontSize: '18px',
        fontWeight: '700',
    },
    menuTypeBtnDesc: {
        fontSize: '13px',
        opacity: 0.8,
    },
    daySelector: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto',
        padding: '4px',
    },
    dayBtn: {
        padding: '12px 24px',
        background: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    dayBtnActive: {
        background: 'linear-gradient(135deg, #2D7A4F 0%, #1f5a37 100%)',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(45, 122, 79, 0.3)',
    },
    categorySelector: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto',
        padding: '4px',
        flexWrap: 'wrap',
    },
    categoryBtn: {
        padding: '10px 16px',
        background: '#fff',
        border: 'none',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    categoryBtnActive: {
        background: '#2D7A4F',
        color: '#fff',
    },
    toolbar: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '12px',
        padding: '0 16px',
        flex: 1,
        minWidth: '250px',
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
    mealTypeFilter: {
        display: 'flex',
        gap: '8px',
    },
    mealTypeBtn: {
        padding: '10px 16px',
        background: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    mealTypeBtnActive: {
        background: '#2D7A4F',
        color: '#fff',
    },
    refreshBtn: {
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        border: 'none',
        background: '#fff',
        color: '#7F8C8D',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: '#2D7A4F',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    itemsGrid: {
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
        fontSize: '16px',
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
    addFirstBtn: {
        marginTop: '16px',
        padding: '12px 24px',
        background: '#2D7A4F',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    packageCard: {
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    packageImageContainer: {
        position: 'relative',
        height: '180px',
    },
    packageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    mealTypeBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#fff',
    },
    dayBadge: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
    },
    packageContent: {
        padding: '20px',
    },
    packageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px',
    },
    packageName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: 0,
    },
    packagePrice: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#2D7A4F',
    },
    packageDesc: {
        fontSize: '14px',
        color: '#7F8C8D',
        margin: '0 0 16px 0',
    },
    packageItems: {
        marginBottom: '16px',
    },
    packageItemsLabel: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#95A5A6',
        marginBottom: '10px',
        display: 'block',
    },
    packageItemsPreview: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
    },
    itemPreviewChip: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px 4px 4px',
        background: '#F0F4F8',
        borderRadius: '20px',
    },
    itemPreviewImg: {
        width: '28px',
        height: '28px',
        borderRadius: '14px',
        objectFit: 'cover',
    },
    itemPreviewName: {
        fontSize: '12px',
        color: '#2C3E50',
        fontWeight: '500',
    },
    moreItems: {
        fontSize: '12px',
        color: '#7F8C8D',
        fontWeight: '600',
    },
    packageActions: {
        display: 'flex',
        gap: '10px',
        paddingTop: '16px',
        borderTop: '1px solid #F0F2F5',
    },
    viewBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px',
        background: '#E8F5E9',
        border: 'none',
        borderRadius: '8px',
        color: '#2D7A4F',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    editBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px',
        background: '#E3F2FD',
        border: 'none',
        borderRadius: '8px',
        color: '#1976D2',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    deleteBtn: {
        width: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        background: '#FFEBEE',
        border: 'none',
        borderRadius: '8px',
        color: '#E74C3C',
        fontSize: '18px',
        cursor: 'pointer',
    },
    singleCard: {
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'opacity 0.2s',
    },
    singleImageContainer: {
        position: 'relative',
        height: '160px',
    },
    singleImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    categoryBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        background: '#2D7A4F',
        color: '#fff',
    },
    hiddenOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        gap: '8px',
    },
    hiddenIcon: {
        fontSize: '32px',
    },
    singleContent: {
        padding: '16px',
    },
    singleHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '6px',
    },
    singleName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: 0,
    },
    singlePrice: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2D7A4F',
    },
    singleDesc: {
        fontSize: '13px',
        color: '#7F8C8D',
        margin: '0 0 12px 0',
    },
    singleActions: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    visibilityBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        flex: 1,
    },
    editBtnSmall: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: 'none',
        background: '#E3F2FD',
        color: '#1976D2',
        fontSize: '18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtnSmall: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: 'none',
        background: '#FFEBEE',
        color: '#E74C3C',
        fontSize: '18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalLarge: {
        background: '#fff',
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#2C3E50',
        margin: '0 0 24px 0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
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
        border: '2px solid #E8ECEF',
        borderRadius: '10px',
        fontSize: '15px',
        outline: 'none',
    },
    select: {
        padding: '12px 16px',
        border: '2px solid #E8ECEF',
        borderRadius: '10px',
        fontSize: '15px',
        outline: 'none',
        background: '#fff',
        cursor: 'pointer',
    },
    textarea: {
        padding: '12px 16px',
        border: '2px solid #E8ECEF',
        borderRadius: '10px',
        fontSize: '15px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    addItemSection: {
        marginBottom: '16px',
    },
    addItemInputs: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    addItemBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '12px 20px',
        background: '#2D7A4F',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    itemsEditGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
    },
    itemEditCard: {
        background: '#F8F9FA',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    itemEditImage: {
        width: '100%',
        height: '100px',
        objectFit: 'cover',
    },
    itemEditInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
    },
    itemEditName: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2C3E50',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    itemRemoveBtn: {
        width: '24px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        background: '#FFEBEE',
        color: '#E74C3C',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noItemsHint: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '40px',
        color: '#95A5A6',
        fontSize: '14px',
    },
    visibilityToggle: {
        display: 'flex',
        gap: '10px',
    },
    visibilityOption: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        border: '2px solid #E8ECEF',
        borderRadius: '10px',
        background: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
    },
    visibilityOptionActive: {
        borderColor: '#2D7A4F',
        background: '#E8F5E9',
        color: '#2D7A4F',
    },
    visibilityOptionHidden: {
        borderColor: '#E74C3C',
        background: '#FFEBEE',
        color: '#E74C3C',
    },
    infoBox: {
        display: 'flex',
        gap: '10px',
        padding: '14px 16px',
        background: '#FFF8E1',
        borderRadius: '10px',
        fontSize: '13px',
        color: '#F57C00',
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    cancelBtn: {
        flex: 1,
        padding: '14px',
        background: '#F5F7FA',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        color: '#7F8C8D',
        cursor: 'pointer',
    },
    submitBtn: {
        flex: 1,
        padding: '14px',
        background: '#2D7A4F',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        color: '#fff',
        cursor: 'pointer',
    },
    // Details Modal Styles
    detailsModal: {
        background: '#fff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    detailsHeader: {
        position: 'relative',
    },
    detailsCoverImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    },
    detailsOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        color: '#fff',
    },
    detailsBadges: {
        display: 'flex',
        gap: '10px',
        marginBottom: '12px',
    },
    detailsMealBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    detailsDayBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        background: 'rgba(255,255,255,0.2)',
    },
    detailsTitle: {
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 8px 0',
    },
    detailsDesc: {
        fontSize: '14px',
        opacity: 0.9,
        margin: '0 0 12px 0',
    },
    detailsPrice: {
        fontSize: '28px',
        fontWeight: '700',
    },
    detailsCloseBtn: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        border: 'none',
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsBody: {
        padding: '24px',
    },
    detailsItemsTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: '20px',
    },
    detailsItemsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '16px',
    },
    detailsItemCard: {
        background: '#F8F9FA',
        borderRadius: '12px',
        overflow: 'hidden',
        textAlign: 'center',
    },
    detailsItemImage: {
        width: '100%',
        height: '100px',
        objectFit: 'cover',
    },
    detailsItemName: {
        display: 'block',
        padding: '12px 10px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#2C3E50',
    },
};

export default MenuItems;
