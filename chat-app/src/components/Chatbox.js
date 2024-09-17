import React, { useState } from 'react';

function Chatbox({ messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.fromMe ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.fromMe ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded px-4 py-2"
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbox;
