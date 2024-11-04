const express = require('express');
const circulationController = require('../controllers/circulationController');
const router = express.Router();

router.post('/issue', circulationController.issueBook);
router.put('/return/:id', circulationController.returnBook);
router.put('/renew/:id', circulationController.renewBook);

module.exports = router;
