// [#E195AB]

import React, { useState } from "react";
import { Menu, Send } from "lucide-react";
import Header from "../pages/Dashboardpages/Header";
import FacHeader from "./Dashboardpages/facheader";

const FacChatbot = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello, how can I assist you today?", sender: "bot" },
  ]);

  const handleSendMessage = () => {
    if (prompt.trim() === "") return;

    setMessages([...messages, { text: prompt, sender: "user" }]);
    setPrompt("");

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
    <div className="flex w-full h-screen bg-[#ECE7CA] ">
      <FacHeader/>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col ml-30 bg-transparent p-6 pt-10 mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">💬 AI Faculty-Chatbot</h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4  rounded-lg p-6 h-[80vh]">
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
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 w-full bg-gray-100 flex items-center space-x-2 border-t border-gray-300 rounded-lg">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-white text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-[#E195AB] mr-5 shadow-lg p-4 pt-10 mt-25 flex flex-col transition-all duration-300 rounded-lg ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isSidebarOpen ? (
          <>
            {/* Sidebar Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Previous Chats</span>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <Menu />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 space-y-3">
              <button onClick={() => setMessages([])} className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition shadow-md">
                New Chat
              </button>
              <button className="w-full bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400 transition text-left shadow-md">
                Create Assignment for students
              </button>
              <button className="w-full bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400 transition text-left shadow-md">
                write a message regarding upcoming test
              </button>
            </div>

            {/* Sidebar Footer */}
            <div className="mt-6 space-y-2">
              <button className="w-full bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400 transition shadow-md">
                Home
              </button>
              <button className="w-full bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400 transition shadow-md">
                Saved
              </button>
            </div>
          </>
        ) : (
          <button
            className="text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition absolute top-4 right-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FacChatbot;
