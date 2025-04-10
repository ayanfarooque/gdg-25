import React from "react";

import SubjectDistribution from "../Dashboardcomponents/overview/SubjectDistribution";
const ReviewSection = () => {
    return(
      <div className="bg-gray-50 text-black p-6 rounded-lg min-h-[300px] shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Review & Performance Evaluation</h2>
      
      {/* Dummy Evaluation */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
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
      <div className="mt-6 text-black bg-gray-50">
        <SubjectDistribution bgColor="bg-white"/>
      </div>

    </div>
    )
}
export default ReviewSection