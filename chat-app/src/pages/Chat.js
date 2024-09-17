import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chatbox from '../components/Chatbox';

function Chat() {
  const [messages, setMessages] = useState([
    { text: 'Hello!', fromMe: false },
    { text: 'Hi, how are you?', fromMe: true }
  ]);
  const users = [
    { name: 'John Doe', avatar: 'https://via.placeholder.com/40', lastMessage: 'See you later!' },
    { name: 'Jane Smith', avatar: 'https://via.placeholder.com/40', lastMessage: 'Hello!' }
  ];

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, { text: newMessage, fromMe: true }]);
  };

  return (
    <div className="flex h-full">
      <Sidebar users={users} />
      <Chatbox messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default Chat;
