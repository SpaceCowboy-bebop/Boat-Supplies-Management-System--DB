const db = require('../config/database');

class User {
    // Find user by username
    static async findByUsername(username) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
            [username]
        );
        return rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, username, name, email, role, created_at FROM users WHERE id = ? AND is_active = TRUE',
            [id]
        );
        return rows[0];
    }

    // Get all users
    static async getAll() {
        const [rows] = await db.execute(
            'SELECT id, username, name, email, role, created_at, is_active FROM users'
        );
        return rows;
    }

    // Create new user
    static async create(userData) {
        const { username, name, email, role, password_hash } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (username, name, email, role, password_hash) VALUES (?, ?, ?, ?, ?)',
            [username, name, email, role, password_hash]
        );
        return result.insertId;
    }
}

module.exports = User;
