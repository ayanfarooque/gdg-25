import React, { useState } from "react";

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
    <div className="bg-[#49ABB0] p-6 rounded-[30px] text-white w-full max-w-md mx-auto">
      <h2 className="text-2xl text-[#21294F] font-semibold mb-4 text-center tracking-wide">
        Submitted Assignments
      </h2>

      <div className="flex flex-col gap-3">
        {assignments.map((assignment, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => toggleAssignment(index)}
              className={`bg-[rgba(33,41,79,0.3)] text-black font-medium py-3 rounded-[30px] shadow-md transition-all transform hover:scale-105 hover:shadow-xl w-full text-left px-4 ${
                expandedAssignment === index ? "rounded-b-none" : ""
              }`}
            >
              {assignment.subject}
            </button>

            {expandedAssignment === index && (
              <div className="bg-white text-[#21294F] p-4 rounded-b-[30px] shadow-md border-t-2 border-[rgba(33,41,79,0.3)]">
                <div className="mb-4">
                  <h3 className="font-bold text-lg">{assignmentDetails[assignment.subject].title}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-sm font-semibold">Submitted:</p>
                      <p>{assignmentDetails[assignment.subject].submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Score:</p>
                      <p>{assignmentDetails[assignment.subject].score}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Feedback:</p>
                    <p>{assignmentDetails[assignment.subject].feedback}</p>
                  </div>
                </div>

                {showDetails === assignment.subject && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold">Description:</p>
                    <p className="text-sm mb-2">{assignmentDetails[assignment.subject].description}</p>
                    
                    <p className="text-sm font-semibold">Due Date:</p>
                    <p className="text-sm mb-2">{assignmentDetails[assignment.subject].dueDate}</p>
                    
                    <p className="text-sm font-semibold">Attachments:</p>
                    <p className="text-sm">{assignmentDetails[assignment.subject].attachments}</p>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleCancelSubmission(assignment.subject)}
                    className="px-4 py-2 bg-[#EF5350] text-white rounded-full hover:bg-[#d32f2f] transition-colors shadow"
                  >
                    Cancel Submission
                  </button>
                  <button
                    onClick={() => toggleDetails(assignment.subject)}
                    className="px-4 py-2 bg-[#49ABB0] text-white rounded-full hover:bg-[#3a8a8e] transition-colors shadow"
                  >
                    {showDetails === assignment.subject ? "Hide Details" : "View Details"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmittedAssignments;