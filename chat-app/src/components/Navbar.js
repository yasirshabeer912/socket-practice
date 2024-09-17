import React from 'react';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">Chat App</h1>
        <button className="bg-white text-blue-600 px-4 py-2 rounded">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
