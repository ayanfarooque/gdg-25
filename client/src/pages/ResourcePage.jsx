import React, { useState } from "react";
import { newsdata } from "../assets/dumy.js";
import { recdata } from "../assets/recommend.js";
import Header from "../pages/Dashboardpages/Header.jsx";
import { useNavigate } from "react-router-dom";

const resourcedata = [
  {
    resourceId: "RES001",
    resourceType: "Lecture Notes",
    resourceDate: "2025-02-10T10:30:00Z",
    resourceHeading: "Mathematics Chapter 5 Notes",
    resourceContent: "Complete lecture notes for Chapter 5 covering advanced calculus concepts.",
    resourceFile: "https://example.com/math_notes.pdf",
    subject: "Mathematics"
  },
  {
    resourceId: "RES002",
    resourceType: "Video Lecture",
    resourceDate: "2025-02-11T15:45:00Z",
    resourceHeading: "Chemistry Lab Demonstration",
    resourceContent: "Video demonstration of the latest chemistry lab experiment procedures.",
    resourceFile: "https://example.com/chem_video.mp4",
    subject: "Chemistry"
  }
];

const ResourcePage = () => {
  const [news] = useState(newsdata);
  const [rec] = useState(recdata);
  const [resources] = useState(resourcedata);
  const [showNews, setShowNews] = useState(true);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#ECE7CA] p-6">
      <Header />
      <div className="pt-10 mt-10 w-full max-w-7xl">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setShowNews(true)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${showNews ? 'bg-[#49ABB0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              News
            </button>
            <button
              onClick={() => setShowNews(false)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${!showNews ? 'bg-[#49ABB0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Resources
            </button>
          </div>
        </div>

        {showNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item) => (
              <div key={item._id} className="bg-[#F5F5DD] shadow-lg rounded-lg p-5 hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-xl font-semibold text-gray-900">{item.newsHeading}</h2>
                <p className="text-sm text-gray-600 mt-2">{item.newsContent}</p>
                {item.newsImage && <img src={item.newsImage} alt="News" className="mt-3 w-full max-h-60 object-cover rounded-lg" />}
                <p className="text-xs text-gray-400 mt-3">🗓 Published on: {new Date(item.newsDate).toLocaleDateString()}</p>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => navigate(`/news/${item.newsId}`)} className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">Read More →</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((item) => (
              <div key={item.resourceId} className="bg-[#F5F5DD] shadow-lg rounded-lg p-5 hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-xl font-semibold text-gray-900">{item.resourceHeading}</h2>
                <p className="text-sm text-gray-600 mt-2">{item.resourceContent}</p>
                <p className="text-xs text-gray-400 mt-3">📚 Subject: {item.subject}</p>
                <p className="text-xs text-gray-400">🗓 Published on: {new Date(item.resourceDate).toLocaleDateString()}</p>
                <div className="mt-4 flex justify-end">
                  <a href={item.resourceFile} className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">View Resource →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePage;
