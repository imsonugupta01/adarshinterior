const express = require('express');
const { addContact, findAllContacts, updateStatus } = require('../Controllers/contactController');
const router = express.Router();


router.post('/add',addContact);
router.get('/find',findAllContacts);
router.get("/update/:id",updateStatus)

module.exports = router;
