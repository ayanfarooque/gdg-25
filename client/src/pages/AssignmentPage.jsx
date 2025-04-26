import React from 'react'
import AssignmentBot from '../components/AssignmentComponent/AssignmentBot'
import ReviewSection from '../components/AssignmentComponent/ReviewSection'
import SubmittedAssignments from '../components/AssignmentComponent/SubmittedAssignments'
import PendingAssignment from '../components/AssignmentComponent/PendingAssignments'
import Header from '../pages/Dashboardpages/Header'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiClock } from 'react-icons/fi' 

const AssignmentPage = () => {
  const navigate = useNavigate()
  
  return (
    <div className="flex flex-col  h-screen w-full bg-[#ECE7CA] overflow-hidden ml-10">
      <Header/>
      <div className="flex-1 p-6 overflow-y-auto mt-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Assignment Dashboard</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Assignment Area (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Assignment Bot Card */}
              <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#3A7CA5] transition-all duration-300 hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <span className="bg-[#3A7CA5] text-white p-2 rounded-lg mr-2 inline-flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Assignment Assistant
                </h2>
                <AssignmentBot />
              </div>
              
              {/* Review Section Card */}
              <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#2F6690] transition-all duration-300 hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <span className="bg-[#2F6690] text-white p-2 rounded-lg mr-2 inline-flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Assignment Reviews
                </h2>
                <ReviewSection />
              </div>
            </div>
            
            {/* Sidebar (1/3 width on large screens) */}
            <div className="space-y-6">
              {/* Submissions Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="text-[#3A7CA5] mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Your Submissions
                </h2>
                <button 
                  onClick={() => navigate('/viewall')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3A7CA5] text-white rounded-lg shadow-md hover:bg-[#2F6690] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-lg"
                >
                  View All
                  <FiArrowRight className="text-sm" />
                </button>
              </div>
              
              {/* Submitted Assignments Card */}
              <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" />
                  Submitted
                </h3>
                <SubmittedAssignments/>
              </div>
              
              {/* Pending Assignments Card */}
              <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <FiClock className="text-yellow-500 mr-2" />
                  Pending
                </h3>
                <PendingAssignment/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentPage