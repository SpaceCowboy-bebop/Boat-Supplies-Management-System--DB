const db = require('../config/database');

class Request {
    // Create new request
    static async create(requestData) {
        const { user_id, trip_id, general_comment } = requestData;
        const [result] = await db.execute(
            'INSERT INTO requests (user_id, trip_id, general_comment) VALUES (?, ?, ?)',
            [user_id, trip_id, general_comment]
        );
        return result.insertId;
    }

    // Add items to request
    static async addItems(requestId, items) {
        for (const item of items) {
            await db.execute(
                'INSERT INTO request_items (request_id, item_id, quantity, unit, item_notes) VALUES (?, ?, ?, ?, ?)',
                [requestId, item.item_id, item.quantity, item.unit, item.item_notes || '']
            );
        }
    }

    // Get all requests (for manager)
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT r.*, 
                   u.name as requester_name,
                   u.role as requester_role,
                   t.trip_name,
                   t.departure_date,
                   t.return_date,
                   t.destination,
                   rev.name as reviewer_name
            FROM requests r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN trips t ON r.trip_id = t.id
            LEFT JOIN users rev ON r.reviewed_by = rev.id
            ORDER BY r.created_at DESC
        `);
        return rows;
    }

    // Get requests by user ID
    static async getByUser(userId) {
        const [rows] = await db.execute(`
            SELECT r.*, 
                   t.trip_name,
                   t.departure_date,
                   t.return_date
            FROM requests r
            LEFT JOIN trips t ON r.trip_id = t.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `, [userId]);
        return rows;
    }

    // Get request by ID with items
    static async getById(id) {
        // Get request details
        const [requestRows] = await db.execute(`
            SELECT r.*, 
                   u.name as requester_name,
                   u.role as requester_role,
                   u.username as requester_username,
                   t.trip_name,
                   t.departure_date,
                   t.return_date,
                   t.destination,
                   rev.name as reviewer_name
            FROM requests r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN trips t ON r.trip_id = t.id
            LEFT JOIN users rev ON r.reviewed_by = rev.id
            WHERE r.id = ?
        `, [id]);

        if (requestRows.length === 0) return null;

        // Get request items
        const [itemRows] = await db.execute(`
            SELECT ri.*, 
                   ic.item_name,
                   ic.category,
                   ic.role_category
            FROM request_items ri
            LEFT JOIN item_catalog ic ON ri.item_id = ic.id
            WHERE ri.request_id = ?
        `, [id]);

        return {
            ...requestRows[0],
            items: itemRows
        };
    }

    // Update request status
    static async updateStatus(id, status, reviewed_by, manager_comment = '') {
        await db.execute(
            'UPDATE requests SET status = ?, reviewed_by = ?, reviewed_at = NOW(), manager_comment = ? WHERE id = ?',
            [status, reviewed_by, manager_comment, id]
        );
    }

    // Create log entry
    static async createLog(requestId, action, performedBy, notes = '') {
        await db.execute(
            'INSERT INTO logs (request_id, action, performed_by, notes) VALUES (?, ?, ?, ?)',
            [requestId, action, performedBy, notes]
        );
    }
}

module.exports = Request;
