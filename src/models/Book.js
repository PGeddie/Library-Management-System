
const db = require('../db');

const Book = {
    addBook: (bookData, callback) => {
        const sql = "INSERT INTO Books SET ?";
        db.query(sql, bookData, callback);
    },
    updateBook: (bookId, updatedData, callback) => {
        const sql = "UPDATE Books SET ? WHERE id = ?";
        db.query(sql, [updatedData, bookId], callback);
    },
    deleteBook: (bookId, callback) => {
        const sql = "DELETE FROM Books WHERE id = ?";
        db.query(sql, bookId, callback);
    },
    findBooks: (searchParams, callback) => {
        let sql = "SELECT * FROM Books WHERE 1=1";
        if (searchParams.title) sql += " AND title LIKE ?";
        if (searchParams.author) sql += " AND author LIKE ?";
        if (searchParams.genre) sql += " AND genre LIKE ?";
        if (searchParams.isbn) sql += " AND isbn = ?";
        db.query(sql, [
            `%${searchParams.title || ''}%`,
            `%${searchParams.author || ''}%`,
            `%${searchParams.genre || ''}%`,
            searchParams.isbn || '%'
        ], callback);
    }
};

module.exports = Book;
