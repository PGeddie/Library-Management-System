const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

router.post('/add', bookController.addBook);
router.put('/update/:id', bookController.updateBook);
router.delete('/delete/:id', bookController.deleteBook);
router.get('/find', bookController.findBooks);

module.exports = router;
