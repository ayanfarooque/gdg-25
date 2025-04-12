import React from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from "./Dashboardpages/Header";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DetailedReview = () => {
  const navigate = useNavigate();

  // Sample detailed review data
  const subjects = [
    {
      name: "Mathematics",
      score: 85,
      strengths: ["Algebra", "Geometry"],
      weaknesses: ["Trigonometry", "Calculus"],
      feedback: "You're doing well in algebraic concepts but need more practice with advanced calculus.",
      assignments: [
        { title: "Algebra Basics", score: "18/20", feedback: "Excellent work!" },
        { title: "Trigonometry Quiz", score: "14/20", feedback: "Need to memorize identities better" }
      ]
    },
    {
      name: "Science",
      score: 75,
      strengths: ["Biology", "Chemistry Basics"],
      weaknesses: ["Physics", "Advanced Chemistry"],
      feedback: "Your biology knowledge is strong but physics concepts need reinforcement.",
      assignments: [
        { title: "Cell Biology Project", score: "19/20", feedback: "Very detailed and accurate" },
        { title: "Physics Midterm", score: "12/20", feedback: "Struggled with Newton's Laws" }
      ]
    },
    {
      name: "English",
      score: 90,
      strengths: ["Literature Analysis", "Creative Writing"],
      weaknesses: ["Grammar Rules", "Vocabulary"],
      feedback: "Your writing skills are exceptional. Focus on expanding your vocabulary.",
      assignments: [
        { title: "Shakespeare Essay", score: "20/20", feedback: "Brilliant analysis" },
        { title: "Grammar Test", score: "17/20", feedback: "Watch subject-verb agreement" }
      ]
    },
    {
      name: "Social Studies",
      score: 65,
      strengths: ["History", "Geography"],
      weaknesses: ["Civics", "Economics"],
      feedback: "You understand historical events well but need to work on economic concepts.",
      assignments: [
        { title: "World War II Report", score: "16/20", feedback: "Good historical context" },
        { title: "Economics Quiz", score: "10/20", feedback: "Basic concepts need review" }
      ]
    }
  ];

  // Data for the bar chart
  const chartData = {
    labels: subjects.map(subject => subject.name),
    datasets: [
      {
        label: 'Scores',
        data: subjects.map(subject => subject.score),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Subject Performance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="bg-[#F5F5DD] text-black min-h-screen p-6">
        <Header />
      <div className="max-w-6xl mt-20 mx-auto">
        

        <h1 className="text-3xl font-bold text-center mb-8">Detailed Performance Review</h1>
        
        {/* Overall Performance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Subject-wise Breakdown */}
        <div className="space-y-6">
          {subjects.map((subject, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{subject.name}</h2>
                  <p className="text-2xl font-bold" style={{ color: 
                    subject.score >= 85 ? '#10B981' : 
                    subject.score >= 70 ? '#3B82F6' : 
                    subject.score >= 50 ? '#F59E0B' : '#EF4444'
                  }}>
                    {subject.score}%
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {subject.score >= 85 ? 'Excellent' : 
                   subject.score >= 70 ? 'Good' : 
                   subject.score >= 50 ? 'Average' : 'Needs Improvement'}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {subject.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {subject.weaknesses.map((weakness, i) => (
                      <li key={i}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-lg mb-2">Teacher Feedback</h3>
                <p className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  {subject.feedback}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-lg mb-2">Assignment Details</h3>
                <div className="space-y-3">
                  {subject.assignments.map((assignment, i) => (
                    <div key={i} className="border-b border-gray-200 pb-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{assignment.title}</span>
                        <span className="font-bold">{assignment.score}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{assignment.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedReview;