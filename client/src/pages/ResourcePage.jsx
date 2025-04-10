import React, { useEffect, useState } from "react";

const ResourcePage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/news/news") // Ensure this URL is correct
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched News:", data);
        setNews(data);
      })
      .catch((error) => console.error("Error fetching news:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📰 Latest News</h1>

      <div className="w-full max-w-4xl h-[80vh] overflow-y-auto bg-white shadow-lg rounded-lg p-6">
        {news.length > 0 ? (
          news.map((item) => (
            <div 
              key={item._id} 
              className="bg-gray-50 shadow-md rounded-lg p-5 mb-6 transition-transform transform hover:scale-105 duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-900">{item.newsHeading}</h2>
              <p className="text-sm text-gray-600 mt-2">{item.newsContent}</p>

              {item.newsImage && (
                <div className="mt-3 flex justify-center">
                  
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
  );
};

export default ResourcePage;
