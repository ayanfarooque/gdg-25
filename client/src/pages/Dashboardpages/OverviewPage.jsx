import React, { useState } from 'react'
import Header from './Header'
import { motion } from "framer-motion"
import { BarChart2, BookOpen, Calendar, Users, Activity, TrendingUp, Target } from "lucide-react"
import GrowthRate from '../../components/Dashboardcomponents/overview/GrowthRate'
import SubjectDistribution from '../../components/Dashboardcomponents/overview/SubjectDistribution'
import SubAnalysis from '../../components/Dashboardcomponents/overview/SubAnalysis'

// New premium stat card component
const PremiumStatCard = ({ title, value, icon: Icon, trend, color, bgGradient }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl shadow-lg ${bgGradient} p-6 border border-gray-200/30`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <span className="text-2xl font-bold text-gray-800 mt-1">{value}</span>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="ml-1 text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="absolute -bottom-6 -right-6 opacity-10">
        <Icon className="h-24 w-24 text-gray-900" />
      </div>
    </motion.div>
  )
}

// New section title component
const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

const OverviewPage = ({ role }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('monthly')
  
  return (
    <div className='flex-1 bg-gradient-to-br from-white to-[#f5f5f0] overflow-auto relative z-10 mt-10 pt-8'>
      <Header title='Academic Dashboard' role={role}/>

      <main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        {/* Welcome section */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Scholar</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your academic performance today.
          </p>
        </motion.div>

        {/* Timeframe selector */}
        <motion.div 
          className="flex space-x-4 mb-8" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {['weekly', 'monthly', 'yearly'].map(timeframe => (
            <button 
              key={timeframe}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
                activeTimeframe === timeframe 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Stats grid */}
        <motion.div 
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <PremiumStatCard 
            title="Subjects Enrolled" 
            value="5" 
            icon={BookOpen}
            trend={{ value: "2.5%", isPositive: true }}
            color="bg-gradient-to-r from-blue-500 to-indigo-600"
            bgGradient="bg-gradient-to-br from-blue-50 to-indigo-50"
          />
          <PremiumStatCard 
            title="Learning Network" 
            value="34" 
            icon={Users}
            trend={{ value: "12%", isPositive: true }}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            bgGradient="bg-gradient-to-br from-purple-50 to-pink-50"
          />
          <PremiumStatCard 
            title="Assignments Completed" 
            value="24/30" 
            icon={Target}
            trend={{ value: "8%", isPositive: true }}
            color="bg-gradient-to-r from-amber-500 to-orange-500"
            bgGradient="bg-gradient-to-br from-amber-50 to-orange-50"
          />
          <PremiumStatCard 
            title="Overall Progress" 
            value="82.5%" 
            icon={TrendingUp}
            trend={{ value: "4.3%", isPositive: true }}
            color="bg-gradient-to-r from-emerald-500 to-green-500"
            bgGradient="bg-gradient-to-br from-emerald-50 to-green-50"
          />
        </motion.div>

        {/* Main content area */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main chart - takes 2 columns */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SectionTitle 
              title="Learning Progress" 
              subtitle="Track your academic performance trends over time"
            />
            <GrowthRate bgColor="bg-white" />
          </motion.div>
          
          {/* Side chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SectionTitle 
              title="Subject Distribution" 
              subtitle="Time allocation across subjects"
            />
            <SubjectDistribution bgColor="bg-white" />
          </motion.div>
          
          {/* Full width bottom chart */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SectionTitle 
              title="Performance Analytics" 
              subtitle="Detailed breakdown of subject performance metrics"
            />
            <SubAnalysis />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default OverviewPage
