import React, { useEffect, useState } from "react";
import { newsdata } from '../../assets/dumy.js';
import Card from "./Card.jsx";
import { useParams } from "react-router-dom";

const ResourceSection = () => {
  const {newsId} = useParams();
  const [newsinfo,setnewinfo] = useState()

  const fetchnewsinfo = async () => {
    const newsinfo = newsdata.find(news => news._id === newsId);
    setnewinfo(newsinfo)
    console.log(newsinfo);
    
  }
  useEffect(() => {
    fetchnewsinfo();
  }, [newsdata, newsId]);
  return (
    <div className="w-1/4 h-100 bg-teal-400 p-4 rounded-md shadow-md transition-transform transform hover:scale-105 ml-4">
      <h2 className="text-lg font-bold text-black">TEACHER RECOMMENDED</h2>
      <div className="mt-2 space-y-2  flex flex-col h-full">
        {newsdata.slice(0, 2).map((news, index) => (
          <Card 
          key={index} 
          newsId={news.newsId} 
          newsHeading={news.newsHeading} 
          newsContent={news.newsContent} 
          newsImage={news.newsImage}
          />
        ))}
      </div>
    </div>
  );
}

export default ResourceSection;
