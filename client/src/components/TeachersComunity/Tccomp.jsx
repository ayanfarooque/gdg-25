import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tccomp = () => {
  const [doubt, setDoubt] = useState("");
  const [isPosting, setIsPosting] = useState(false);

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

  const handlePostDoubt = async () => {
    if (!doubt.trim()) {
      toast.warning("Please enter your doubt before posting");
      return;
    }

    setIsPosting(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/moderate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: doubt,
          username: "Mr Pawar" // You might want to get this from auth context
        }),
      });

      const data = await response.json();

      if (!data.allow_post) {
        toast.error(`Message not allowed: ${data.message}`);
      } else if (data.allow_post === "warning") {
        toast.warning(`Warning: ${data.message}`);
        // You might still want to post it with a warning
        proceedWithPosting();
      } else {
        proceedWithPosting();
      }
    } catch (error) {
      console.error("Moderation error:", error);
      toast.error("Failed to check message. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const proceedWithPosting = () => {
    // Here you would normally send the doubt to your backend
    toast.success("Doubt posted successfully!");
    setDoubt("");
    // Add your actual API call to post the doubt to your database
    // ...
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          WELCOME TO COMMUNITY, Mr Pawar
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
          <div key={q.id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md">
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
            <button className="bg-blue-500 text-white py-2 px-4 mt-3 rounded-lg hover:bg-blue-600 transition">
              ANSWER
            </button>
          </div>
        ))}

        {/* Post Doubt Section */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-md mt-6">
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
            className="bg-blue-500 text-white py-2 px-4 mt-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            onClick={handlePostDoubt}
            disabled={isPosting}
          >
            {isPosting ? "Checking..." : "POST"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tccomp;