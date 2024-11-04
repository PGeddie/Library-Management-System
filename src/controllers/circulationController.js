const Circulation = require('../models/Circulation');

exports.issueBook = (req, res) => {
    const issueData = req.body;
    Circulation.issueBook(issueData, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ id: result.insertId, ...issueData });
    });
};

exports.returnBook = (req, res) => {
    const circulationId = req.params.id;
    const { returnDate } = req.body;
    Circulation.returnBook(circulationId, returnDate, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(`Book returned successfully. Fines calculated.`);
    });
};

exports.renewBook = (req, res) => {
    const circulationId = req.params.id;
    const { newDueDate } = req.body;
    Circulation.renewBook(circulationId, newDueDate, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(`Book due date extended successfully.`);
    });
};
