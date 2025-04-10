import React from "react";

const SearchBar = () => {
    return(
        <div className="bg-white p-3 transition-transform transform hover:scale-105 rounded-md shadow-md flex items-center w-full max-w-lg">
      <input type="text" placeholder="Search......." className="flex-1 p-2 border-none rounded-md outline-none text-gray-600" />
      <button className="ml-2 p-2 bg-white text-gray-600 rounded-md shadow-md">🔍</button>
    </div>
    )
}

export default SearchBar