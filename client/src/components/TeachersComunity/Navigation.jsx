import React from "react";

const Navigation = () => {
  return (
    <div className="bg-gray-400 p-6 rounded-lg  text-gray-800">
      <h3 className="text-2xl font-semibold mb-3 text-gray-900">Navigation</h3>
      <ul className="space-y-2">
        <li className="hover:text-xl cursor-pointer">🏠 Home</li>
        <li className="hover:text-xl cursor-pointer">❓ Questions</li>
        <li className="hover:text-xl cursor-pointer">🏷️ Tags</li>
      </ul>
      <hr className="my-4 border-gray-300" />
      <ul className="space-y-2">
        <li className="hover:text-xl cursor-pointer">📌 Saved</li>
        <li className="hover:text-xl cursor-pointer">👤 Profile</li>
      </ul>
    </div>
  );
};

export default Navigation;
