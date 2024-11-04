const User = require('../models/User');

exports.addUser = (req, res) => {
    const newUser = req.body;
    User.addUser(newUser, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ id: result.insertId, ...newUser });
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;
    User.updateUser(userId, updatedData, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(`User with ID ${userId} updated successfully.`);
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    User.deleteUser(userId, (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(`User with ID ${userId} deleted successfully.`);
    });
};

exports.findUsers = (req, res) => {
    const searchParams = req.query;
    User.findUsers(searchParams, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
};
