const express = require('express');
const { createContact, getContacts, updateContact, deleteContact, searchContacts, uploadSingle, uploadFields } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, uploadFields, createContact);
router.get('/', authMiddleware, getContacts);
router.patch('/:id', authMiddleware, uploadFields, updateContact);
router.delete('/:id', authMiddleware, deleteContact);
router.get('/search/:query', authMiddleware, searchContacts);

module.exports = router;
