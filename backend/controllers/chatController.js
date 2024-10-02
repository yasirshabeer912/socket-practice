const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create or find chat between two users
const findOrCreateChat = async (req, res) => {
  console.log('here')
  const { userId1, userId2 } = req.body;

  try {
    // Check if a chat already exists between the two users
    let chat = await Chat.findOne({
      where: {
        userId1: userId1,
        userId2: userId2
      }
    }) || await Chat.findOne({
      where: {
        userId1: userId2,
        userId2: userId1
      }
    });
    console.log(chat)
    // If chat doesn't exist, create one
    if (!chat) {
      chat = await Chat.create({ userId1, userId2 });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error finding or creating chat' });
  }
};

const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const senderId = req.userId;

  try {
    const message = await Message.create({ chatId, senderId, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: `Failed to send message : ${error}` });
  }
};

const getMessages = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const messages = await Message.findAll({ where: { chatId:id } });
    // console.log(messages)
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { sendMessage, getMessages, findOrCreateChat };
