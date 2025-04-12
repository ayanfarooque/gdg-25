import React, { useState } from "react";
import { newsdata } from "../assets/dumy.js";
import { recdata } from "../assets/recommend.js";
import FacHeader from "../pages/Dashboardpages/facheader.jsx";

// Dummy resources data
const resourcedata = [
  {
    "resourceId": "RES001",
    "resourceType": "Lecture Notes",
    "resourceDate": "2025-02-10T10:30:00Z",
    "resourceHeading": "Mathematics Chapter 5 Notes",
    "resourceContent": "Complete lecture notes for Chapter 5 covering advanced calculus concepts.",
    "resourceFile": "https://example.com/math_notes.pdf",
    "subject": "Mathematics"
  },
  {
    "resourceId": "RES002",
    "resourceType": "Video Lecture",
    "resourceDate": "2025-02-11T15:45:00Z",
    "resourceHeading": "Chemistry Lab Demonstration",
    "resourceContent": "Video demonstration of the latest chemistry lab experiment procedures.",
    "resourceFile": "https://example.com/chem_video.mp4",
    "subject": "Chemistry"
  },
  {
    "resourceId": "RES003",
    "resourceType": "Assignment",
    "resourceDate": "2025-02-12T08:15:00Z",
    "resourceHeading": "History Term Paper Guidelines",
    "resourceContent": "Detailed guidelines and requirements for the upcoming history term paper.",
    "resourceFile": "https://example.com/history_assign.pdf",
    "subject": "History"
  },
  {
    "resourceId": "RES004",
    "resourceType": "Practice Test",
    "resourceDate": "2025-02-13T12:00:00Z",
    "resourceHeading": "Physics Practice Problems",
    "resourceContent": "Collection of practice problems for the upcoming physics midterm exam.",
    "resourceFile": "https://example.com/physics_test.pdf",
    "subject": "Physics"
  },
  {
    "resourceId": "RES005",
    "resourceType": "Reference Book",
    "resourceDate": "2025-02-14T09:30:00Z",
    "resourceHeading": "Literature Reading List",
    "resourceContent": "Recommended reading list for the modern literature course.",
    "resourceFile": "https://example.com/literature_books.pdf",
    "subject": "Literature"
  }
]

const ResourcePage = () => {
  const [news] = useState(newsdata);
  const [rec] = useState(recdata);
  const [resources] = useState(resourcedata);
  const [showNews, setShowNews] = useState(true); // Toggle state

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#ECE7CA] p-6">
      <FacHeader/>
      <div className="pt-10 mt-10 w-full max-w-7xl">
        {/* Toggle Switch */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setShowNews(true)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${showNews ? 'bg-[#E195AB] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              News
            </button>
            <button
              onClick={() => setShowNews(false)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${!showNews ? 'bg-[#E195AB] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Resources
            </button>
          </div>
        </div>

        {showNews ? (
          <div className="flex flex-row gap-x-12">
            {/* News Section */}
            <div className="flex-1">
              <div className="flex flex-row items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📰 Latest News</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.length > 0 ? (
                  news.map((item) => (
                    <div
                      key={item._id}
                      className="bg-[#F5F5DD] text-black shadow-lg rounded-lg p-5 transition-transform hover:scale-[1.02] duration-300"
                    >
                      <h2 className="text-xl font-semibold text-gray-900">{item.newsHeading}</h2>
                      <p className="text-sm text-gray-600 mt-2">{item.newsContent}</p>

                      {item.newsImage && (
                        <div className="mt-3 flex justify-center">
                          <img
                            src={item.newsImage}
                            alt="News"
                            className="w-full max-h-60 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-3">
                        🗓 Published on: {new Date(item.newsDate).toLocaleDateString()}
                      </p>

                      <div className="mt-4 flex justify-end">
                        <a
                          href={`/news/${item.newsId}`}
                          className="text-white bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-lg">No news available</p>
                )}
              </div>
            </div>

            {/* Recommended Section */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-[#E195AB] p-5 rounded-[25px] sticky top-6">
                <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">Recommended</h1>
                {rec.length > 0 ? (
                  rec.map((item) => (
                    <div
                      key={item._id}
                      className="bg-[#F5F5DD] text-black shadow-lg rounded-lg p-5 mb-6 transition-transform hover:scale-[1.02] duration-300"
                    >
                      <h2 className="text-xl font-semibold text-gray-900">{item.newsHeading}</h2>
                      <p className="text-sm text-gray-600 mt-2">{item.newsContent}</p>

                      {item.newsImage && (
                        <div className="mt-3 flex justify-center">
                          <img
                            src={item.newsImage}
                            alt="News"
                            className="w-full max-h-60 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-3">
                        🗓 Published on: {new Date(item.newsDate).toLocaleDateString()}
                      </p>

                      <div className="mt-4 flex justify-end">
                        <a
                          href={`/news/${item.newsId}`}
                          className="text-white bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-lg">No recommended news</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-x-12">
            {/* Resources Section */}
            <div className="flex-1">
              <div className="flex flex-row items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📚 Teaching Resources</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.length > 0 ? (
                  resources.map((item) => (
                    <div
                      key={item.resourceId}
                      className="bg-[#F5F5DD] text-black shadow-lg rounded-lg p-5 transition-transform hover:scale-[1.02] duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{item.resourceHeading}</h2>
                          <span className="inline-block text-black bg-[#E195AB] bg-opacity-20  text-xs px-2 py-1 rounded-full mt-1">
                            {item.resourceType}
                          </span>
                        </div>
                        <span className="bg-[#E195AB] bg-opacity-20 text-black text-xs px-2 py-1 rounded-full">
                          {item.subject}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-2">{item.resourceContent}</p>

                      <p className="text-xs text-gray-400 mt-3">
                        🗓 Uploaded on: {new Date(item.resourceDate).toLocaleDateString()}
                      </p>

                      <div className="mt-4 flex justify-between items-center">
                        <a
                          href={item.resourceFile}
                          className="text-white bg-[#E195AB] px-4 py-2 rounded-md shadow-md hover:bg-[#3a8a8f] transition duration-300"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download File
                        </a>
                        <button className="text-[#E195AB] hover:text-[#c97f96]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-lg">No resources available</p>
                )}
              </div>
            </div>

            {/* Recommended Section - Empty for resources view */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-[#E195AB] p-5 rounded-[25px] sticky top-6">
                <h1 className="text-2xl text-black text-center font-bold  mb-6">Quick Links</h1>
                <div className="space-y-4 text-black">
                  <a href="#" className="block  bg-[#F5F5DD] p-3 rounded-lg hover:bg-opacity-90 transition">
                    <p className="font-medium">Upload New Resource</p>
                  </a>
                  <a href="#" className="block bg-[#F5F5DD] p-3 rounded-lg hover:bg-opacity-90 transition">
                    <p className="font-medium">Resource Guidelines</p>
                  </a>
                  <a href="#" className="block bg-[#F5F5DD] p-3 rounded-lg hover:bg-opacity-90 transition">
                    <p className="font-medium">Shared Resources</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePage;