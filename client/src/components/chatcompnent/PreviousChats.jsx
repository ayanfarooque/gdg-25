import React from 'react';

const chats = ["Matrices", "Bernoulli's Theorem", "Wolff–Kishner Reaction"];

const PreviousChats = () => {
  return (
    <div className="w-64 h-full mr-10 bg-teal-300 p-4 rounded-l-2xl shadow-md">
      <h2 className="text-lg font-bold text-gray-800 mb-4">PREVIOUS CHATS</h2>
      <div className="flex flex-col gap-2">
        {chats.map((chat, index) => (
          <button key={index} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
            {chat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreviousChats;