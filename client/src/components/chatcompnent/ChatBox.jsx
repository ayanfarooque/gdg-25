import React from 'react';
import { Lock, Send } from 'lucide-react';

const ChatBox = () => {
  return (
    <div className="flex-1 p-8">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">What can I help you with?</h1>
        <div className="flex items-center border rounded-md p-2 mb-4">
          <input type="text" placeholder="Message or Ask Doubt" className="flex-1 p-2 outline-none" />
          <Lock className="w-5 h-5 text-gray-500" />
          <Send className="w-5 h-5 text-teal-500 cursor-pointer ml-2" />
        </div>
        <button className="px-4 py-2 bg-teal-400 text-white rounded-md shadow">Select Subject</button>
        <div className="flex justify-center gap-4 mt-4">
          <button className="bg-yellow-300 px-4 py-1 rounded-md">Concepts</button>
          <button className="bg-blue-300 px-4 py-1 rounded-md">Solve Numericals</button>
          <button className="bg-green-300 px-4 py-1 rounded-md">Code</button>
          <button className="bg-red-300 px-4 py-1 rounded-md">Summarize</button>
        </div>
      </div>
      <div className="flex  items-center border rounded-full mt-8 p-2">
        <input type="text" placeholder="Message or Ask Doubt" className="flex-1 p-2 outline-none" />
        <Lock className="w-5 h-5 text-gray-500" />
        <Send className="w-5 h-5 text-teal-500 cursor-pointer ml-2" />
      </div>
    </div>
  );
};

export default ChatBox;