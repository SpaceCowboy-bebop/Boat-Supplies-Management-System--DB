const db = require('../config/database');

class Item {
    // Get all items from catalog
    static async getAll() {
        try {
            const [rows] = await db.execute(
                `SELECT ic.*, u.name as added_by_name 
                 FROM item_catalog ic 
                 LEFT JOIN users u ON ic.added_by = u.id 
                 WHERE ic.is_active = TRUE 
                 ORDER BY ic.category, ic.item_name`
            );
            return rows;
        } catch (error) {
            console.error('Error in Item.getAll:', error);
            throw error;
        }
    }

    // Get items by role category (chef, captain, mechanic, etc.)
    static async getByRoleCategory(role) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM item_catalog 
                 WHERE role_category = ? AND is_active = TRUE 
                 ORDER BY item_name`,
                [role]
            );
            return rows;
        } catch (error) {
            console.error('Error in Item.getByRoleCategory:', error);
            throw error;
        }
    }

    // Get items by category (food, beverage, safety, equipment, etc.)
    static async getByCategory(category) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM item_catalog 
                 WHERE category = ? AND is_active = TRUE 
                 ORDER BY item_name`,
                [category]
            );
            return rows;
        } catch (error) {
            console.error('Error in Item.getByCategory:', error);
            throw error;
        }
    }

    // Add new item to catalog (for manager)
    static async create(itemData) {
        try {
            const { item_name, category, unit, added_by, role_category, description } = itemData;
            const [result] = await db.execute(
                'INSERT INTO item_catalog (item_name, category, unit, added_by, role_category, description) VALUES (?, ?, ?, ?, ?, ?)',
                [item_name, category, unit, added_by, role_category, description]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error in Item.create:', error);
            throw error;
        }
    }

    // Get item by ID
    static async getById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM item_catalog WHERE id = ? AND is_active = TRUE',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error in Item.getById:', error);
            throw error;
        }
    }

    // Search items by name
    static async searchByName(searchTerm) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM item_catalog 
                 WHERE item_name LIKE ? AND is_active = TRUE 
                 ORDER BY item_name`,
                [`%${searchTerm}%`]
            );
            return rows;
        } catch (error) {
            console.error('Error in Item.searchByName:', error);
            throw error;
        }
    }

    // Update item
    static async update(id, itemData) {
        try {
            const { item_name, category, unit, role_category, description } = itemData;
            const [result] = await db.execute(
                'UPDATE item_catalog SET item_name = ?, category = ?, unit = ?, role_category = ?, description = ? WHERE id = ?',
                [item_name, category, unit, role_category, description, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in Item.update:', error);
            throw error;
        }
    }

    // Soft delete item (set is_active = FALSE)
    static async delete(id) {
        try {
            const [result] = await db.execute(
                'UPDATE item_catalog SET is_active = FALSE WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in Item.delete:', error);
            throw error;
        }
    }

    // Get popular items (most requested)
    static async getPopularItems(limit = 10) {
        try {
            const [rows] = await db.execute(
                `SELECT ic.*, COUNT(ri.id) as request_count
                 FROM item_catalog ic
                 LEFT JOIN request_items ri ON ic.id = ri.item_id
                 WHERE ic.is_active = TRUE
                 GROUP BY ic.id
                 ORDER BY request_count DESC, ic.item_name
                 LIMIT ?`,
                [limit]
            );
            return rows;
        } catch (error) {
            console.error('Error in Item.getPopularItems:', error);
            throw error;
        }
    }
}

module.exports = Item;
