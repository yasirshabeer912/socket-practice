require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Setup express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// HTTP server to attach socket.io
const http = require('http');
const server = http.createServer(app);

// Setup socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust as necessary)
    methods: ['GET', 'POST']
  }
});

// Middleware for token validation
app.post('/validate-token', async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    try {
      const user = await User.findOne({
        where: { id: decoded.id }, 
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Token is valid', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database connected and synced');
  
  // Socket.io connection event
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for 'chatMessage' event from client
    socket.on('chatMessage', async (messageData) => {
      const { chatId, content, senderId } = messageData;
      
      // Store the message in the database (example, using Sequelize)
      try {
        const newMessage = await sequelize.models.Message.create({
          chatId,
          content,
          senderId,
        });

        // Broadcast the new message to all connected clients
        io.emit('message', newMessage); // Broadcast to everyone
      } catch (error) {
        console.error('Error saving message to DB:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
