import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'; // Import Socket.io client

const Chatbox = ({ userData }) => {
  const { id } = useParams(); // Chat ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [token, setToken] = useState('');
  const [socket, setSocket] = useState(null); // To manage the socket connection

  // Retrieve the token from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Initialize Socket.io connection when the component mounts
  useEffect(() => {
    const socketConnection = io('http://localhost:3001'); // Adjust to your server URL
    setSocket(socketConnection);

    // Clean up when the component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Fetch messages when chat ID or token changes
  useEffect(() => {
    if (!token) return; // Wait until the token is set

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/chat/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();
  }, [id, token]); // Re-fetch messages when chat ID or token changes

  // Listen for incoming messages via Socket.io
  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  // Send a new message
  const sendMessage = async () => {
    if (!token || !newMessage.trim()) return; // Prevent sending if no token or message

    try {
      // Emit message to the server via Socket.io
      const messageData = {
        chatId: id,
        content: newMessage,
        senderId: userData.id,
      };
      socket.emit('chatMessage', messageData); // Send the message via WebSocket

      setNewMessage(''); // Clear input after sending
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="chatbox">
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.senderId === userData.id ? 'Me' : 'User'}: {message.content}
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()} // Send message on Enter key press
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbox;
