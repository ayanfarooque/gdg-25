import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const categories = [
  "All Communities",
  "Science",
  "Mathematics",
  "Computer Science",
  "Literature",
  "History",
  "Economics",
  "My Communities"
];

const CommunityCategories = ({ onCategorySelect, onSearch }) => {
  const [activeCategory, setActiveCategory] = useState("All Communities");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (onCategorySelect) onCategorySelect(category);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </form>
      
      {/* Categories */}
      <h3 className="font-semibold text-lg mb-3 text-gray-800">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunityCategories;