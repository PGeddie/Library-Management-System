
const db = require('../db');

const User = {
    addUser: (userData, callback) => {
        const sql = "INSERT INTO Users SET ?";
        db.query(sql, userData, callback);
    },
    updateUser: (userId, updatedData, callback) => {
        const sql = "UPDATE Users SET ? WHERE id = ?";
        db.query(sql, [updatedData, userId], callback);
    },
    deleteUser: (userId, callback) => {
        const sql = "DELETE FROM Users WHERE id = ?";
        db.query(sql, userId, callback);
    },
    findUsers: (searchParams, callback) => {
        let sql = "SELECT * FROM Users WHERE 1=1";
        if (searchParams.name) sql += " AND name LIKE ?";
        if (searchParams.email) sql += " AND email = ?";
        db.query(sql, [
            `%${searchParams.name || ''}%`,
            searchParams.email || '%'
        ], callback);
    }
};

module.exports = User;
