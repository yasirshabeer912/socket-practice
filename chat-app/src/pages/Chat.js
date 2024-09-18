import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chatbox from '../components/Chatbox';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Chat({userData }) {
  const [messages, setMessages] = useState([
    { text: 'Hello!', fromMe: false },
    { text: 'Hi, how are you?', fromMe: true }
  ]);
  console.log("userData",userData)
  const [users, setUsers] = useState([]); // Start with an empty list
  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const navigate = useNavigate()

  // Debounce the searchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay of 500ms (you can adjust this)

    // Cleanup the timeout if searchTerm changes (i.e., user is still typing)
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Trigger the search when debouncedSearchTerm changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearchTerm.trim() === '') {
        setUsers([]); // If search is empty, show no users
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/auth/search-users?username=${debouncedSearchTerm.trim()}`);
        const data = await response.json();
        setUsers(data); // Update users based on search result
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [debouncedSearchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, { text: newMessage, fromMe: true }]);
  };

  const handleUserClick = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post('http://localhost:3001/chat/find-or-create-chat', {
            userId1: userData.id,
            userId2: userId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Navigate to the chat page for the newly created or existing chat
        navigate(`/chat/${response.data.id}`);
    } catch (error) {
        console.error('Error creating or finding chat', error);
    }
};


  return (
    <div className="flex h-full">
    <div className="w-1/4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for users..."
        className="w-full p-2 border-b mb-2"
      />
      <Sidebar users={users} handleUserClick={handleUserClick} />
    </div>
    {/* <Chatbox messages={messages} onSendMessage={handleSendMessage} /> */}
  </div>
  );
}

export default Chat;
