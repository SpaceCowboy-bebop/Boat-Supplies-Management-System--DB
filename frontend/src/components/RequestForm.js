import React, { useState, useEffect } from 'react';
import api from '../services/api';

function RequestForm({ user, onSubmit, loading }) {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const response = await api.getItemsByRole(user.role);
            setItems(response.data.items || []);
        } catch (error) {
            console.error('Error loading items:', error);
        }
    };

    const handleQuantityChange = (itemId, delta) => {
        setSelectedItems(prev => {
            const current = prev[itemId] || 0;
            const newQuantity = Math.max(0, current + delta);
            
            if (newQuantity === 0) {
                const { [itemId]: removed, ...rest } = prev;
                return rest;
            }
            
            return {
                ...prev,
                [itemId]: newQuantity
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const itemsArray = Object.entries(selectedItems).map(([itemId, quantity]) => {
            const item = items.find(i => i.id === parseInt(itemId));
            return {
                item_id: parseInt(itemId),
                quantity: quantity,
                unit: item.unit,
                item_notes: ''
            };
        });

        if (itemsArray.length === 0) {
            alert('Please select at least one item');
            return;
        }

        onSubmit({
            user_id: user.id,
            items: itemsArray,
            general_comment: comment
        });
    };

    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedItemsList = Object.entries(selectedItems).map(([itemId, quantity]) => {
        const item = items.find(i => i.id === parseInt(itemId));
        return { ...item, quantity };
    });

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit}>
                <div style={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.itemsGrid}>
                    {filteredItems.map(item => (
                        <div key={item.id} style={styles.itemCard}>
                            <div style={styles.itemInfo}>
                                <h4 style={styles.itemName}>{item.item_name}</h4>
                                <div style={styles.itemDetails}>
                                    <span style={styles.category}>{item.category}</span>
                                    <span style={styles.unit}>{item.unit}</span>
                                </div>
                            </div>
                            <div style={styles.quantityControls}>
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    style={styles.quantityBtn}
                                >
                                    -
                                </button>
                                <span style={styles.quantity}>
                                    {selectedItems[item.id] || 0}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    style={styles.quantityBtn}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.selectedSection}>
                    <h3>Selected Items:</h3>
                    {selectedItemsList.length === 0 ? (
                        <p style={styles.noItems}>No items selected</p>
                    ) : (
                        <div style={styles.selectedList}>
                            {selectedItemsList.map(item => (
                                <div key={item.id} style={styles.selectedItem}>
                                    <span>{item.item_name}</span>
                                    <span>{item.quantity} {item.unit}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={styles.commentSection}>
                    <textarea
                        placeholder="Additional comments (optional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={styles.commentInput}
                        rows="3"
                    />
                </div>

                <div style={styles.submitSection}>
                    <button
                        type="submit"
                        disabled={loading || selectedItemsList.length === 0}
                        style={styles.submitButton}
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px'
    },
    searchSection: {
        marginBottom: '20px'
    },
    searchInput: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '6px'
    },
    itemsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
    },
    itemCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemInfo: {
        flex: 1
    },
    itemName: {
        margin: '0 0 5px 0',
        fontSize: '16px'
    },
    itemDetails: {
        display: 'flex',
        gap: '10px',
        fontSize: '14px',
        color: '#666'
    },
    category: {
        backgroundColor: '#e9ecef',
        padding: '2px 8px',
        borderRadius: '4px'
    },
    unit: {
        color: '#6c757d'
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    quantityBtn: {
        width: '30px',
        height: '30px',
        border: '1px solid #1a5f7a',
        backgroundColor: 'white',
        color: '#1a5f7a',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px'
    },
    quantity: {
        minWidth: '30px',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    selectedSection: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    noItems: {
        textAlign: 'center',
        color: '#6c757d',
        fontStyle: 'italic'
    },
    selectedList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    selectedItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '4px'
    },
    commentSection: {
        marginBottom: '20px'
    },
    commentInput: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        resize: 'vertical'
    },
    submitSection: {
        textAlign: 'center'
    },
    submitButton: {
        padding: '15px 40px',
        fontSize: '18px',
        backgroundColor: '#1a5f7a',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default RequestForm;
