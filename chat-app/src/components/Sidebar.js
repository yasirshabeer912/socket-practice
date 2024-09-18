import React from 'react';

function Sidebar({ users,handleUserClick }) {
  return (
    <div className="bg-gray-100 w-64 p-4 border-r" >
      {users?.map((user, index) => (
        <div key={index} className="mb-4 flex items-center" onClick={()=>handleUserClick(user.id)}>
          <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
          <div className="ml-4">
            <h2 className="font-semibold">{user.username}</h2>
            <p className="text-sm text-gray-500">{user.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
