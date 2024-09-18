const express = require('express');
const { sendMessage, getMessages ,findOrCreateChat } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/message', authMiddleware, sendMessage);
router.get('/messages/:id', authMiddleware, getMessages);
router.post('/find-or-create-chat', authMiddleware, findOrCreateChat);

module.exports = router;
