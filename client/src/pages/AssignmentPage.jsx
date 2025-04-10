import React from 'react'
import AssignmentBot from '../components/AssignmentComponent/AssignmentBot'
import ReviewSection from '../components/AssignmentComponent/ReviewSection'
import SubmittedAssignments from '../components/AssignmentComponent/SubmittedAssignments'
import PendingAssignment from '../components/AssignmentComponent/PendingAssignments'

const AssignmentPage = () => {
  return (
    <div className="flex h-screen w-full bg-gray-300 overflow-hidden">
      <div className="flex flex-col flex-1 p-6 gap-6 overflow-auto">
        
        {/* AI Assignment Bot at the Top */}
        <div className="w-full">
          <AssignmentBot />
        </div>

        <div className="flex gap-6">
          {/* Right Section (Assignments) */}
          <div className="flex flex-col w-[30%] gap-6">
            <div className="bg-gray-400 transition-transform transform hover:scale-105 p-4 rounded-lg shadow-md">
              <SubmittedAssignments />
            </div>
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 transition-transform transform hover:scale-105 p-4 rounded-lg shadow-md">
              <PendingAssignment />
            </div>
          </div>

          {/* Review Section at the Bottom */}
          <div className="rounded-lg w-full shadow-md overflow-auto">
            <ReviewSection />

          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentPage
