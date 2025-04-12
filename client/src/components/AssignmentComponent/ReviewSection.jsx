import React from "react";
import { useNavigate } from "react-router-dom";
import SubjectDistribution from "../Dashboardcomponents/overview/SubjectDistribution";

const ReviewSection = () => {
  const navigate = useNavigate();

  const handleViewDetailedReview = () => {
    navigate("/detailed-review");
  };

  return (
    <div className="bg-[#F5F5DD] text-black p-6 rounded-[50px] border-2 border-gray-400 min-h-[300px] shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Review & Performance Evaluation</h2>
      
      {/* Dummy Evaluation */}
      <div className="bg-[#F5F5DD] p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold">Evaluation Summary</h3>
        <ul className="list-disc pl-5">
          <li>Maths: 85% - Good Understanding</li>
          <li>Science: 75% - Needs Improvement in Physics</li>
          <li>English: 90% - Excellent</li>
          <li>SST: 65% - Moderate Performance</li>
        </ul>
        <p className="mt-3 font-medium">Overall Remark: Keep practicing, especially in Science and SST.</p>
      </div>

      {/* Subject Distribution Chart */}
      <div className="mt-6 text-black bg-[#F5F5DD]">
        <SubjectDistribution bgColor="bg-[#F5F5DD]"/>
      </div>

      {/* View Detailed Review Button */}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={handleViewDetailedReview}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Detailed Review
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;