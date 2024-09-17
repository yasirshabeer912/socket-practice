const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const senderId = req.userId;

  try {
    const message = await Message.create({ chatId, senderId, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.findAll({ where: { chatId } });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { sendMessage, getMessages };
