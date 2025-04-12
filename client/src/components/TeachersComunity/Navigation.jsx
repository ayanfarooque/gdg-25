import React from "react";

const Navigation = () => {
  return (
    <div className="bg-[#F5F5DD] p-6 rounded-lg text-gray-800 ">
      <h3 className="text-2xl font-semibold mb-3 text-gray-900">Navigation</h3>
      <ul className="space-y-3">
        {["🏠 Home", "❓ Questions", "🏷️ Tags"].map((item, index) => (
          <li
            key={index}
            className="cursor-pointer transition-transform transform hover:scale-105 hover:font-medium hover:text-gray-900"
          >
            {item}
          </li>
        ))}
      </ul>
      <hr className="my-4 border-gray-300" />
      <ul className="space-y-3">
        {["📌 Saved", "👤 Profile"].map((item, index) => (
          <li
            key={index}
            className="cursor-pointer transition-transform transform hover:scale-105 hover:font-medium hover:text-gray-900"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;
