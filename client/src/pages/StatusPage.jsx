import React from 'react'
import Sidebar from '../components/Status/Sidebar'
import ActiveAssignment from '../components/Status/ActiveAssignment'
import Stats from '../components/Status/Stats'
import PreviousAssignment from '../components/Status/PreviousAssignment'

const StatusPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#eae0c8]">
      <Sidebar />
      <div className="flex flex-1 p-6 gap-6">
        
        {/* Main Review Section */}
        <div className="flex w-full flex-col items-center  bg-[#f5f0dc] p-6 rounded-lg shadow-md">
          <Stats />
        </div>


        {/* Right Section  */}

        <div className="flex flex-col w-[30%] gap-6">
          <div className="bg-[#E195AB] p-4 rounded-lg shadow-md">
            <ActiveAssignment />
          </div>
          <div className="bg-[#E195AB] p-4 rounded-lg shadow-md">
            <PreviousAssignment />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusPage
