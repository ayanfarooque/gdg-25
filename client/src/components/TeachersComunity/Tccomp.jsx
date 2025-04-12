import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const Tccomp = ({ welcomeText , buttonColor , hoverColor}) => {
  const [doubt, setDoubt] = useState("");

  const questions = [
    {
      id: 1,
      text: "What is the reason behind tennis ball swinging and spinning at the same time? Explain and justify this using Bernoulli's theorem.",
      answers: 0,
      upvotes: 8,
      downvotes: 3,
      chapter: "",
    },
  ];

  return (
    <div className="h-screen p-6 rounded-lg">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          {welcomeText}
        </h1>

        {/* Search Box */}
        <div className="flex items-center text-black bg-gray-100 p-2 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent p-2 outline-none"
          />
          <FiSearch className="text-gray-500 text-xl" />
        </div>

        <h2 className="text-lg font-medium mb-3 text-gray-700">
          RECOMMENDED FOR YOU
        </h2>

        {/* Questions List */}
        {questions.map((q) => (
          <div key={q.id} className="bg-[#F5F5DD] p-4 mb-4 rounded-lg shadow-md">
            <p className="font-medium text-gray-800">Q: {q.text}</p>
            <p className="text-red-600 font-semibold mt-2">NO ANSWER YET</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-700">▲</span>
                <span>{q.upvotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-700">▼</span>
                <span>{q.downvotes}</span>
              </div>
            </div>
            <button 
              className={`bg-[${buttonColor}] text-white py-2 px-4 mt-3 rounded-lg hover:${hoverColor} transition`}
              style={{ backgroundColor: buttonColor }}
            >
              ANSWER
            </button>
          </div>
        ))}

        {/* Post Doubt Section */}
        <div className="bg-[#F5F5DD] p-4 rounded-lg shadow-md mt-6">
          <h3 className="text-lg text-black font-semibold mb-2 text-gray-800">
            POST YOUR DOUBT
          </h3>
          <textarea
            className="w-full bg-white text-black p-2 rounded-md border"
            placeholder="TYPE YOUR DOUBTS HERE..."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
          ></textarea>
          <button 
            className={`bg-[${buttonColor}] text-white py-2 px-4 mt-3 rounded-lg hover:${hoverColor} transition`}
            style={{ backgroundColor: buttonColor }}
          >
            POST
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tccomp;