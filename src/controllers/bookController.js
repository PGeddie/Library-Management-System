const Book = require('../models/Book');

exports.addBook = (req, res) => {
    const newBook = req.body;
    Book.addBook(newBook, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ id: result.insertId, ...newBook });
    });
};

exports.updateBook = (req, res) => {
    const bookId = req.params.id;
    const updatedData = req.body;
    Book.updateBook(bookId, updatedData, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(`Book with ID ${bookId} updated successfully.`);
    });
};

exports.deleteBook = (req, res) => {
    const bookId = req.params.id;
    Book.deleteBook(bookId, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(`Book with ID ${bookId} deleted successfully.`);
    });
};

exports.findBooks = (req, res) => {
    const searchParams = req.query;
    Book.findBooks(searchParams, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
};
