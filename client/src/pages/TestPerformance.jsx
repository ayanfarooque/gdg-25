import { useParams } from 'react-router-dom';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import Header from './Dashboardpages/Header';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

function TestPerformance() {
  const { testCode } = useParams();
  
  // Mock data - in a real app, you'd fetch this based on testCode
  const testData = {
    "SSTUT01": {
      title: "Social Science Unit Test 1",
      date: "22/01/2025",
      score: "12/15",
      percentage: 80,
      averageScore: "10/15",
      classAverage: 67,
      topicBreakdown: [
        { topic: "History", score: 4 },
        { topic: "Geography", score: 3 },
        { topic: "Civics", score: 5 }
      ],
      trendData: [65, 70, 75, 80], // Last 4 test scores in this subject
      trendLabels: ['Test 1', 'Test 2', 'Test 3', 'Test 4']
    },
    "SCIUT01": {
      title: "Science Unit Test 1",
      date: "23/01/2025",
      score: "15/15",
      percentage: 100,
      averageScore: "12/15",
      classAverage: 80,
      topicBreakdown: [
        { topic: "Physics", score: 5 },
        { topic: "Chemistry", score: 5 },
        { topic: "Biology", score: 5 }
      ],
      trendData: [85, 90, 95, 100],
      trendLabels: ['Test 1', 'Test 2', 'Test 3', 'Test 4']
    },
    "HINUT01": {
      title: "Hindi Unit Test 1",
      date: "24/01/2025",
      score: "14/15",
      percentage: 93,
      averageScore: "11/15",
      classAverage: 73,
      topicBreakdown: [
        { topic: "Grammar", score: 5 },
        { topic: "Literature", score: 4 },
        { topic: "Writing", score: 5 }
      ],
      trendData: [80, 85, 88, 93],
      trendLabels: ['Test 1', 'Test 2', 'Test 3', 'Test 4']
    }
  };

  const data = testData[testCode] || testData["SSTUT01"];

  // Pie chart data
  const pieData = {
    labels: data.topicBreakdown.map(t => t.topic),
    datasets: [
      {
        data: data.topicBreakdown.map(t => t.score),
        backgroundColor: ['#3B82F6', '#10B981', '#6366F1'],
        borderWidth: 1,
      },
    ],
  };

  // Line chart data (performance trend)
  const lineData = {
    labels: data.trendLabels,
    datasets: [
      {
        label: 'Your Score',
        data: data.trendData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Bar chart data (comparison)
  const barData = {
    labels: ['Your Score', 'Class Average'],
    datasets: [
      {
        label: 'Percentage',
        data: [data.percentage, data.classAverage],
        backgroundColor: ['#3B82F6', '#10B981'],
      },
    ],
  };

  return (
    <div className="bg-[#ECE7CA] ml-32 text-black   overflow-hidden p-6">
        <Header />
      <div className="mb-6 mt-20 ">
        <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
        <p className="text-gray-600">Test Date: {data.date}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Your Score</h3>
          <p className="text-3xl font-bold text-blue-600">{data.score}</p>
          <p className="text-blue-700">{data.percentage}%</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Class Average</h3>
          <p className="text-3xl font-bold text-green-600">{data.averageScore}</p>
          <p className="text-green-700">{data.classAverage}%</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-purple-800">Performance</h3>
          <p className="text-3xl font-bold text-purple-600">
            {data.percentage > data.classAverage ? 'Above' : data.percentage === data.classAverage ? 'Equal to' : 'Below'} Average
          </p>
          <p className="text-purple-700">
            {Math.abs(data.percentage - data.classAverage)}% {data.percentage > data.classAverage ? 'higher' : 'lower'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Topic-wise Performance</h3>
          <div className="h-64">
            <Pie 
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {data.topicBreakdown.map((topic, index) => (
              <div key={index} className="text-center">
                <p className="font-medium">{topic.topic}</p>
                <p className="text-sm text-gray-600">{topic.score}/5</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Performance Trend</h3>
          <div className="h-64">
            <Line 
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    min: Math.min(...data.trendData) - 10,
                    max: 100,
                  },
                },
              }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Your progress in this subject over last 4 tests
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-medium mb-4">Comparison with Class</h3>
        <div className="h-64">
          <Bar 
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Download Detailed Report
        </button>
      </div>
    </div>
  );
}

export default TestPerformance;