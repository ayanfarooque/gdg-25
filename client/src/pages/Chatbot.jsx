import React, { useState } from "react";
import { Menu, Send } from "lucide-react";

const Chatbot = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello, how can I assist you today?", sender: "bot" },
  ]);

  const handleSendMessage = () => {
    if (prompt.trim() === "") return;

    setMessages([...messages, { text: prompt, sender: "user" }]);
    setPrompt(""); // Clear input field

    // Simulating a bot response after user message
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sure! Poisson's Law describes the probability of a given number of events happening in a fixed interval of time or space.",
          sender: "bot",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex w-full h-screen bg-gray-900 text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-lg max-w-md shadow-md ${
                  msg.sender === "user"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 w-full bg-gray-800 flex items-center space-x-2 border-t border-gray-700">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-blue-500 transition flex items-center"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar (Right Side) */}
      <div
        className={`bg-gray-800 p-4 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isSidebarOpen ? (
          <>
            {/* Sidebar Header with Close Button */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Previous Chats</span>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <Menu />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 space-y-3">
              <button onClick={() => setMessages([])} className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-blue-500 transition">
                New Chat
              </button>
              <button className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition text-left">
                What is Poisson's Law?
              </button>
              <button className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition text-left">
                Who was Hitler?
              </button>
            </div>

            {/* Sidebar Footer */}
            <div className="mt-6 space-y-2">
              <button className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition">
                Home
              </button>
              <button className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition">
                Saved
              </button>
            </div>
          </>
        ) : (
          <button
            className="text-white px-4 py-2 rounded-lg hover:bg-gray-50 transition absolute top-4 right-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
