const Item = require('../models/Item');

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.getAll();
        
        res.json({
            success: true,
            items
        });

    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

exports.getItemsByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const items = await Item.getByRoleCategory(role);
        
        res.json({
            success: true,
            items
        });

    } catch (error) {
        console.error('Get items by role error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

exports.getItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const items = await Item.getByCategory(category);
        
        res.json({
            success: true,
            items
        });

    } catch (error) {
        console.error('Get items by category error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

exports.addItem = async (req, res) => {
    try {
        const itemData = req.body;
        itemData.added_by = req.user.id;

        const itemId = await Item.create(itemData);
        
        res.json({
            success: true,
            message: 'Item added successfully',
            itemId
        });

    } catch (error) {
        console.error('Add item error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};
