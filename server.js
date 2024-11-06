// server.js
const express = require('express');
const mysql = require('mysql2');
const app = express();


// Middleware to parse JSON data
app.use(express.json());

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '2002', 
    database: 'library_management' 
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Endpoint to get all books
app.get('/api/books', (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});


// --- User Management Routes ---

// 1. Register New User
app.post('/users/add', (req, res) => {
    const { name, address, phone, email } = req.body;
    const sql = "INSERT INTO users (name, address, phone, email) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [name, address, phone, email], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: "User added successfully", userId: result.insertId });
    });
});

// 2. Update User Information
app.put('/users/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, address, phone, email } = req.body;
    const sql = "UPDATE users SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?";
    
    db.query(sql, [name, address, phone, email, id], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "User updated successfully" });
    });
});

// 3. Delete User
app.delete('/users/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "User deleted successfully" });
    });
});

// --- Book Management Routes ---

// 1. Add a New Book
app.post('/books/add', (req, res) => {
    const { title, author, isbn, genre, year } = req.body;
    const sql = "INSERT INTO books (title, author, isbn, genre, year) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [title, author, isbn, genre, year], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: "Book added successfully", bookId: result.insertId });
    });
});

// 2. Update Book Information
app.put('/books/update/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, isbn, genre, year } = req.body;
    const sql = "UPDATE books SET title = ?, author = ?, isbn = ?, genre = ?, year = ? WHERE id = ?";
    
    db.query(sql, [title, author, isbn, genre, year, id], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Book updated successfully" });
    });
});

// 3. Delete a Book
app.delete('/books/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM books WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Book deleted successfully" });
    });
});

// --- Renew Book Route ---

// Route to renew a book by extending the due date
app.put('/books/renew/:id', (req, res) => {
    const { id } = req.params;
    const { additionalDays } = req.body; // Number of days to extend

    // Calculate new due date by adding additionalDays to the current due date
    const sql = "UPDATE issued_books SET due_date = DATE_ADD(due_date, INTERVAL ? DAY) WHERE book_id = ?";
    
    db.query(sql, [additionalDays, id], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Book renewed successfully, due date extended." });
    });
});

// --- Get User Fines Route ---

// Route to get the fines for a specific user
app.get('/users/:id/fines', (req, res) => {
    const { id } = req.params;

    // Query to get the total fines for the user
    const sql = `
        SELECT SUM(fine_amount) AS total_fines 
        FROM fines 
        WHERE user_id = ?`;
    
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        
        if (results.length > 0 && results[0].total_fines != null) {
            res.status(200).json({ totalFines: results[0].total_fines });
        } else {
            res.status(200).json({ totalFines: 0 }); // No fines found
        }
    });
});

//email code
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Database connection setup (if not already defined in `server.js`)
const db1 = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to the database.");
    }
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Scheduled job to send due date reminders and overdue notices
cron.schedule('0 0 * * *', () => {
    console.log("Running daily notification check...");

    // Due Date Reminder (Books due in 3 days)
    const dueSoonQuery = `
        SELECT users.email, books.title, borrow_records.due_date
        FROM borrow_records
        JOIN users ON users.id = borrow_records.user_id
        JOIN books ON books.id = borrow_records.book_id
        WHERE borrow_records.due_date = CURDATE() + INTERVAL 3 DAY
    `;

    db.query(dueSoonQuery, (err, dueSoonResults) => {
        if (err) throw err;

        dueSoonResults.forEach(user => {
            const emailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Library Due Date Reminder',
                text: `Dear user, just a reminder that the book "${user.title}" is due on ${user.due_date}. Please return or renew it by then to avoid fines.`
            };

            transporter.sendMail(emailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending due date reminder:", error);
                } else {
                    console.log('Due date reminder sent:', info.response);
                }
            });
        });
    });

    // Overdue Notice (Books overdue)
    const overdueQuery = `
        SELECT users.email, books.title, borrow_records.due_date
        FROM borrow_records
        JOIN users ON users.id = borrow_records.user_id
        JOIN books ON books.id = borrow_records.book_id
        WHERE borrow_records.due_date < CURDATE() AND borrow_records.returned = 0
    `;

    db.query(overdueQuery, (err, overdueResults) => {
        if (err) throw err;

        overdueResults.forEach(user => {
            const emailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Library Overdue Notice',
                text: `Dear user, the book "${user.title}" was due on ${user.due_date} and is now overdue. Please return it to avoid additional fines.`
            };

            transporter.sendMail(emailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending overdue notice:", error);
                } else {
                    console.log('Overdue notice sent:', info.response);
                }
            });
        });
    });
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});