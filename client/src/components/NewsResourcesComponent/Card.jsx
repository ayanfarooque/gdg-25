import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ newsId, newsHeading, newsContent, newsImage }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="p-4 transition-transform transform hover:scale-105 border rounded-2xl border-black bg-gray-50 shadow-md h-20 w-full cursor-pointer"
      onClick={() => navigate(`/news/${newsId}`)} 
    >
      <h3 className="font-semibold text-black">{newsHeading}</h3>
    </div>
  );
};

export default Card;
