import React from 'react'
import Header from '../Dashboardpages/Header';
import {motion} from "framer-motion"
import StatCard from '../Dashboardpages/StatCard'
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import GrowthRate from '../../components/Dashboardcomponents/overview/GrowthRate';
import SubjectDistribution from '../../components/Dashboardcomponents/overview/SubjectDistribution';
import SubAnalysis from '../../components/Dashboardcomponents/overview/SubAnalysis';
const TeachersOverview = ({role}) => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Teachers Dashboard' role={role}/>

      <main className='max-w-7xl mx-auto py-6 lg:px-8'>
        <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}>
            <StatCard name='Subjects' icon={Zap} value='5' color='#6366F1' />
					<StatCard name='Total Students' icon={Users} value='34' color='#8B5CF6' />
					<StatCard name='Total Assignments Assigned' icon={ShoppingBag} value='567' color='#EC4899' />
					<StatCard name='Attendance' icon={BarChart2} value='82.5%' color='#10B981' />
        </motion.div>

        {/* charts */}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<GrowthRate />
					<SubjectDistribution />
					<SubAnalysis />
				</div>
      </main>
    </div>
  )
}

export default TeachersOverview
