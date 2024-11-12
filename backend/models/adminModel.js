// models/AdminModel.js
const pool = require('../database/db');

class AdminModel {
    constructor() {
        this.table = 'admin';
    }

    // Encapsulation: restricting access to the database details
    async getByEmail(email) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE email = $1`, [email]);
        return res.rows[0];
    }
}

module.exports = new AdminModel(); // Singleton pattern to reuse the instance
