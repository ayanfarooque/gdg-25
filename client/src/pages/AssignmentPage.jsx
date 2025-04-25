import React from 'react'
import AssignmentBot from '../components/AssignmentComponent/AssignmentBot'
import ReviewSection from '../components/AssignmentComponent/ReviewSection'
import SubmittedAssignments from '../components/AssignmentComponent/SubmittedAssignments'
import PendingAssignment from '../components/AssignmentComponent/PendingAssignments'
import Header from '../pages/Dashboardpages/Header'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi' // Import an icon from react-icons

const AssignmentPage = () => {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen w-full bg-[#ECE7CA] overflow-hidden">
      <Header/>
      <div className="flex flex-col flex-1 p-6 gap-6 overflow-auto mt-10 pt-13">

        <div className='flex gap-6'>

          <div className="flex flex-col gap-10 rounded-lg w-[750px] overflow-auto ml-50 mr-20">
            <AssignmentBot />
            <ReviewSection />
          </div>

          <div className="flex flex-col w-[30%] gap-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Your Submissions</h3>
              <button 
                onClick={() => navigate('/viewall')}
                className="flex items-center gap-2 px-4 py-2 bg-[#3A7CA5] text-white rounded-lg shadow-md hover:bg-[#2F6690] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-lg"
              >
                View All
                <FiArrowRight className="text-sm" />
              </button>
            </div>
            <SubmittedAssignments/>
            <PendingAssignment/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentPage