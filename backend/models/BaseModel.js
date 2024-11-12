// models/BaseModel.js
const pool = require('../database/db');

class BaseModel {
    constructor(table) {
        this.table = table; // Constructor initializing the table name
    }

    // Common method to get a row by email
    async getByEmail(email) {
        const res = await pool.query(`SELECT * FROM ${this.table} WHERE email = $1`, [email]);
        return res.rows[0];
    }

    // Additional CRUD methods can be added here (e.g., insert, delete, update)
}

module.exports = BaseModel;
