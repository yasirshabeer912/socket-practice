import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Chatbox = ({ userData }) => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return; // Wait until the token is set

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/chat/messages/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setMessages(response.data);
        console.log('totoal messages',messages)
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();
  }, [id, token]); // Fetch messages only when the token is available

  const sendMessage = async () => {
    if (!token) return; // Prevent sending if the token is not set

    try {
      await axios.post('http://localhost:3001/chat/message', {
        chatId: id,
        content: newMessage,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setNewMessage('');
      const response = await axios.get(`http://localhost:3001/chat/messages/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="chatbox">
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            {message.senderId === userData.id ? 'Me' : 'User'}: {message.content}
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbox;
