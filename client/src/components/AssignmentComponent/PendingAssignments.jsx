import React, { useState } from "react";

const PendingAssignment = () => {
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [submitted, setSubmitted] = useState({});

  const assignments = [
    {
      subject: "Hindi",
      details: {
        title: "Essay on Indian Culture",
        dueDate: "2023-12-15",
        description: "Write a 500-word essay on traditional Indian culture and its modern relevance.",
        attachments: ["Essay_Guidelines.pdf"]
      }
    },
    {
      subject: "German",
      details: {
        title: "Verb Conjugation Exercise",
        dueDate: "2023-12-18",
        description: "Complete the worksheet on regular verb conjugation in present tense.",
        attachments: ["German_Verbs_Worksheet.docx"]
      }
    }
  ];

  const toggleAssignment = (index) => {
    setExpandedAssignment(expandedAssignment === index ? null : index);
  };

  const handleSubmit = (index) => {
    setSubmitted({ ...submitted, [index]: true });
    setTimeout(() => {
      setExpandedAssignment(null);
      setSubmitted({ ...submitted, [index]: false });
    }, 1500);
  };

  return (
    <div className=" p-6 rounded-[30px] text-white w-full max-w-md mx-auto">
      <h2 className="text-[#21294F] text-2xl font-semibold mb-4 text-center tracking-wide">
        Pending Assignments
      </h2>

      <div className="grid grid-cols-1 gap-3">
        {assignments.map((assignment, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => toggleAssignment(index)}
              className={`bg-[#EF5350] text-black font-medium py-3 rounded-[30px] shadow-md transition-all transform hover:scale-105 hover:shadow-xl w-full text-left px-4 ${
                expandedAssignment === index ? "rounded-b-none" : ""
              }`}
            >
              {assignment.subject}
            </button>

            {expandedAssignment === index && (
              <div className="bg-white text-[#21294F] p-4 rounded-b-[30px] shadow-md border-t-2 border-[#EF5350]">
                <div className="mb-3">
                  <h3 className="font-bold text-lg">{assignment.details.title}</h3>
                  <p className="text-sm text-gray-600">Due: {assignment.details.dueDate}</p>
                </div>
                
                <p className="mb-3">{assignment.details.description}</p>
                
                {assignment.details.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-1">Attachments:</h4>
                    <ul className="text-sm space-y-1">
                      {assignment.details.attachments.map((file, i) => (
                        <li key={i} className="text-blue-600 hover:underline cursor-pointer">
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleSubmit(index)}
                    disabled={submitted[index]}
                    className={`px-4 py-2 rounded-full ${
                      submitted[index]
                        ? "bg-green-500 text-white"
                        : "bg-[#49ABB0] text-white hover:bg-[#3a8a8e]"
                    } transition-colors shadow`}
                  >
                    {submitted[index] ? "Submitted ✓" : "Submit Assignment"}
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

export default PendingAssignment;