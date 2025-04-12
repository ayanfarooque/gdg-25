import React from "react";

const Solution = () => {
  return (
    <div className="bg-[#F5F5DD] p-6 rounded-lg text-gray-800 ">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
        💡 <span>Solutions</span>
      </h3>
      <ul className="space-y-3">
        {[
          "📖 Can we solve the equation of continuity with ...",
          "📚 How to solve matrices with ease ...",
          "⚙️ What causes friction in real life? ...",
          "🧮 Derivation of tanx, sinx, cosx ..."
        ].map((text, index) => (
          <li
            key={index}
            className="cursor-pointer transition-transform transform hover:scale-105 hover:font-medium hover:text-gray-900"
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Solution;
