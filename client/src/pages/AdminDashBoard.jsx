import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import AdminHeader from './Dashboardpages/AdminHeader';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const AdminDashboard = () => {
  // Sample data - in a real app, you'd fetch this from an API
  const classroomPerformance = {
    labels: ['Class A', 'Class B', 'Class C', 'Class D', 'Class E'],
    datasets: [
      {
        label: 'Average Score %',
        data: [85, 78, 92, 88, 75],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const subjectDistribution = {
    labels: ['Mathematics', 'Science', 'English', 'History', 'Arts'],
    datasets: [
      {
        label: 'Subject Performance',
        data: [88, 85, 92, 78, 82],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const performanceTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Overall Performance Trend',
        data: [72, 75, 78, 82, 85, 88],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

  const attendanceData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [85, 10, 5],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="p-6 bg-[#ECE7CA] min-h-screen">
        <AdminHeader />
      <div className="max-w-7xl mt-20 mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-black text-sm font-medium">Total Classrooms</h3>
            <p className="text-3xl text-black font-bold mt-2">24</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-black text-sm font-medium">Total Students</h3>
            <p className="text-3xl text-black font-bold mt-2">648</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-black text-sm font-medium">Total Teachers</h3>
            <p className="text-3xl text-black font-bold mt-2">42</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-black text-sm font-medium">Avg. Performance</h3>
            <p className="text-3xl  font-bold mt-2 text-green-600">84%</p>
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid text-black grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Classroom Performance Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Classroom Performance</h2>
            <div className="h-80">
              <Bar 
                data={classroomPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Average Scores by Classroom',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Subject Distribution Pie Chart */}
          <div className="bg-white text-black p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl text-black font-semibold mb-4">Subject Performance Distribution</h2>
            <div className="h-80">
              <Pie 
                data={subjectDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Performance Across Subjects',
                    },
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Secondary Charts Section */}
        <div className="grid text-black grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Trend Line Chart */}
          <div className="bg-white text-black p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Performance Trend</h2>
            <div className="h-80">
              <Line 
                data={performanceTrend}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Monthly Performance Trend',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Attendance Pie Chart */}
          <div className="bg-white text-black p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Attendance Overview</h2>
            <div className="h-80">
              <Pie 
                data={attendanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'School-wide Attendance',
                    },
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white text-black p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl text-black font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto text-black">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Classroom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y text-black divide-gray-200">
                <tr>
                  <td className="px-6 text-black py-4 whitespace-nowrap">New assignment created</td>
                  <td className="px-6 text-black py-4 whitespace-nowrap">Class B</td>
                  <td className="px-6 text-black py-4 whitespace-nowrap">2023-06-15</td>
                  <td className="px-6 text-black py-4 whitespace-nowrap">
                    <span className="px-2 py-1  bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Test scheduled</td>
                  <td className="px-6 py-4 whitespace-nowrap">Class D</td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-06-14</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Upcoming</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Teacher meeting</td>
                  <td className="px-6 py-4 whitespace-nowrap">All</td>
                  <td className="px-6 py-4 whitespace-nowrap">2023-06-12</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;