import React, { useState } from "react";

const TogelSection = () => {
    const [activeTab, setActiveTab] = useState("news");

    return (

        <div className="w-1/4 bg-gray-50 p-4 rounded-md  ml-4">

          <div className="flex  mb-2">
            <button 
              className={`px-3 py-1 rounded-md shadow-md ${activeTab === "news" ? "bg-teal-500 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => setActiveTab("news")}
            >
              NEWS
            </button>
            <button 
              className={`px-3 py-1 rounded-md shadow-md ${activeTab === "resources" ? "bg-teal-500 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => setActiveTab("resources")}
            >
              RESOURCES
            </button>
          </div>
          
        </div>
    );
}

export default TogelSection;
