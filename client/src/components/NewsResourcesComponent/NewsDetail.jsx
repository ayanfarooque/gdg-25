import React from "react";
import { useParams } from "react-router-dom";
import { newsdata } from "../../assets/dumy";

const NewsDetail = () => {
    const { newsId } = useParams();
    const news = newsdata.find((item) => item.newsId === newsId);

    if (!news) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-semibold text-red-500">News not found!</h1>
            </div>
        );
    }

    return (
        <div className="flex text-black items-center justify-center min-h-screen p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-900">{news.newsHeading}</h1>
                <img 
                    src={news.newsImage} 
                    alt={news.newsHeading} 
                    className="w-full h-64 object-cover rounded-lg mt-4"
                />
                <p className="text-gray-700 mt-4 leading-relaxed">{news.newsContent}</p>
            </div>
        </div>
    );
}

export default NewsDetail;
