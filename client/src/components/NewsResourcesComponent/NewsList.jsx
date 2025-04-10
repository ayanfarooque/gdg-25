import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('technology');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://127.0.0.1:5000/api/news?category=${category}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white text-gray-800">Latest News</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="category" className="text-white">Filter by:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option className='text-black' value="technology">Technology</option>
            <option className='text-black' value="ai">Artificial Intelligence</option>
            <option className='text-black' value="education">Education</option>
            <option className='text-black' value="neet-jee">NEET/JEE</option>
            <option className='text-black' value="physics">Physics</option>
          </select>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-xl">No news articles found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {item.newsImage && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.newsImage} 
                    alt={item.newsHeading}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/400x200?text=News+Image";
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl text-black font-semibold mb-2 hover:text-blue-600 transition-colors duration-200">
                  <Link to={`/news/${item.id}`}>
                    {item.newsHeading}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  {new Date(item.newsDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {item.detailedContent}
                </p>
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/news/${item.id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;