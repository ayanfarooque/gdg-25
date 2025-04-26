import React, { useState } from "react";
import { FiCheckCircle, FiChevronDown, FiChevronUp, FiFileText, FiCalendar, FiAward } from 'react-icons/fi';

const SubmittedAssignments = () => {
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [assignments, setAssignments] = useState([
    { subject: "Maths", submitted: true },
    { subject: "Science", submitted: true },
    { subject: "English", submitted: true },
    { subject: "SST", submitted: true }
  ]);

  // Enhanced assignment details data
  const assignmentDetails = {
    Maths: {
      title: "Algebra Problem Set",
      description: "Complete exercises 1-10 on page 45 about algebraic equations.",
      submittedDate: "2023-12-10",
      dueDate: "2023-12-15",
      score: "18/20",
      feedback: "Excellent work on solving the quadratic equations!",
      attachments: "worksheet.pdf (2.4MB)"
    },
    Science: {
      title: "Chemistry Lab Report",
      description: "Complete lab report on chemical reaction rates.",
      submittedDate: "2023-12-08",
      dueDate: "2023-12-10",
      score: "15/20",
      feedback: "Good observations, include more detailed analysis next time.",
      attachments: "lab_manual.pdf (3.5MB)"
    },
    English: {
      title: "Shakespeare Essay",
      description: "Write a 1000-word essay analyzing Hamlet's character.",
      submittedDate: "2023-12-05",
      dueDate: "2023-12-08",
      score: "20/20",
      feedback: "Outstanding analysis of Hamlet's character development.",
      attachments: "essay_rubric.pdf (0.8MB)"
    },
    SST: {
      title: "History Presentation",
      description: "Create a presentation on the causes of World War I.",
      submittedDate: "2023-12-12",
      dueDate: "2023-12-15",
      score: "13/20",
      feedback: "Good work but could use more analysis of long-term causes.",
      attachments: "presentation_guidelines.pdf (1.2MB)"
    }
  };

  const toggleAssignment = (index) => {
    setExpandedAssignment(expandedAssignment === index ? null : index);
    setShowDetails(null); // Reset details view when collapsing
  };

  const toggleDetails = (subject) => {
    setShowDetails(showDetails === subject ? null : subject);
  };

  const handleCancelSubmission = (subject) => {
    setAssignments(assignments.filter(a => a.subject !== subject));
  };

  return (
    <div className="space-y-3">
      {assignments.map((assignment, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-l-4 border-green-500 overflow-hidden">
          <button
            onClick={() => toggleAssignment(index)}
            className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <div className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-2" />
              <span className="font-medium text-gray-800">{assignment.subject}</span>
            </div>
            {expandedAssignment === index ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </button>

          {expandedAssignment === index && (
            <div className="p-4 pt-0 border-t border-gray-100">
              <div className="pb-3">
                <h3 className="font-bold text-gray-800">{assignmentDetails[assignment.subject].title}</h3>
                
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-start">
                    <FiCalendar className="mt-0.5 text-[#3A7CA5] mr-2" size={16} />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Submitted</p>
                      <p className="text-sm">{assignmentDetails[assignment.subject].submittedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiAward className="mt-0.5 text-[#3A7CA5] mr-2" size={16} />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Score</p>
                      <p className="text-sm font-medium">{assignmentDetails[assignment.subject].score}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-start">
                  <FiFileText className="mt-0.5 text-[#3A7CA5] mr-2" size={16} />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Feedback</p>
                    <p className="text-sm">{assignmentDetails[assignment.subject].feedback}</p>
                  </div>
                </div>
              </div>

              {showDetails === assignment.subject && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-gray-700">Description:</p>
                      <p className="text-gray-600">{assignmentDetails[assignment.subject].description}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-700">Due Date:</p>
                      <p className="text-gray-600">{assignmentDetails[assignment.subject].dueDate}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-700">Attachments:</p>
                      <p className="text-gray-600">
                        <a href="#" className="text-blue-500 hover:text-blue-700 hover:underline">
                          {assignmentDetails[assignment.subject].attachments}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={() => handleCancelSubmission(assignment.subject)}
                  className="flex-1 py-2 px-4 bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  Cancel Submission
                </button>
                <button
                  onClick={() => toggleDetails(assignment.subject)}
                  className="flex-1 py-2 px-4 bg-white border border-[#3A7CA5] text-[#3A7CA5] hover:bg-blue-50 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {showDetails === assignment.subject ? "Hide Details" : "View Details"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubmittedAssignments;