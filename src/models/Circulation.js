
const db = require('../db');

const calculateFine = (dueDate, returnDate, finePerDay = 0.5) => {
    const daysLate = Math.max(0, Math.ceil((new Date(returnDate) - new Date(dueDate)) / (1000 * 60 * 60 * 24)));
    return daysLate * finePerDay;
};

const Circulation = {
    issueBook: (circulationData, callback) => {
        const sql = "INSERT INTO Circulation SET ?";
        db.query(sql, circulationData, callback);
    },
    returnBook: (circulationId, returnDate, callback) => {
        const sql = "SELECT due_date FROM Circulation WHERE id = ?";
        db.query(sql, [circulationId], (err, results) => {
            if (err) return callback(err);
            const dueDate = results[0].due_date;
            const fine = calculateFine(dueDate, returnDate);
            const updateSql = "UPDATE Circulation SET return_date = ?, fine = ? WHERE id = ?";
            db.query(updateSql, [returnDate, fine, circulationId], callback);
        });
    },
    renewBook: (circulationId, newDueDate, callback) => {
        const sql = "UPDATE Circulation SET due_date = ? WHERE id = ?";
        db.query(sql, [newDueDate, circulationId], callback);
    }
};

module.exports = Circulation;
