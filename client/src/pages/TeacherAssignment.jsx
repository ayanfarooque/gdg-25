import React from 'react'

import Sidebar from '../components/TeacherHome/Sidebar'

import ActiveAssignment from '../components/TecherAssignment/ActiveAssignment'
import ReviewSection from '../components/TecherAssignment/ReviewSection'
import PreviousAssignment from '../components/TecherAssignment/PreviousAssignment'

const TeacherAssignment = () => {
  return (

    <div className="flex h-screen text-black w-full overflow-auto relative z-10 bg-gray-50">
      <div className="flex flex-1 p-6 gap-6">
        
        {/* Main Review Section */}
        <div className="flex flex-col items-center w-[70%] bg-white p-6 rounded-lg shadow-md">

          <ReviewSection />
        </div>

        {/* Right Section (Assignments) */}
        <div className="flex flex-col w-[30%] gap-6">

          <div className="bg-white p-4 rounded-lg shadow-md">
            <ActiveAssignment />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">

            <PreviousAssignment />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherAssignment
