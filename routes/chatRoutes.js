const express = require('express');
const router = express.Router();
const {
    initiateChat,
    sendMessage,
    getMessages,
    getChatList,
    blockSession,
} = require('../controllers/chatController');

// Initiate a chat session (after QR scan)
router.post('/initiate', initiateChat);

// Send a message (with anti-spam checks)
router.post('/send', sendMessage);

// Get all messages for a session
router.get('/messages/:sessionId', getMessages);

// Get all chat sessions for a user
router.get('/list/:mobile', getChatList);

// Block a chat session (owner only)
router.post('/block/:sessionId', blockSession);

module.exports = router;
