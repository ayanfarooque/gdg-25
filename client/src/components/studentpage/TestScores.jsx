import { useNavigate } from 'react-router-dom';

function TestScores() {
  const navigate = useNavigate();
  const scores = [
    {
      date: "22/01/2025",
      code: "SSTUT01",
      subject: "Social Science",
      teacher: "Vikul J Pawar",
      score: "12/15",
      percentage: 80,
    },
    {
      date: "23/01/2025",
      code: "SCIUT01",
      subject: "Science",
      teacher: "S C Sharma",
      score: "15/15",
      percentage: 100,
    },
    {
      date: "24/01/2025",
      code: "HINUT01",
      subject: "Hindi",
      teacher: "V C Pandey",
      score: "14/15",
      percentage: 93,
    },
  ];

  const handleViewPerformance = (testCode) => {
    navigate(`/test-performance/${testCode}`);
  };

  return (
    <div className="bg-[#ECE7CA] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Test Scores</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scores.map((score) => (
                <tr key={score.code} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm text-gray-700">
                    <div className="font-medium">{score.date}</div>
                    <div className="text-xs text-gray-500">{score.code}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm font-medium text-gray-800">{score.subject}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-gray-700">{score.teacher}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm font-semibold text-gray-800">{score.score}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            score.percentage >= 90 ? 'bg-green-500' :
                            score.percentage >= 75 ? 'bg-blue-500' :
                            score.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score.percentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        score.percentage >= 90 ? 'text-green-600' :
                        score.percentage >= 75 ? 'text-blue-600' :
                        score.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {score.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleViewPerformance(score.code)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      View Performance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {scores.length} of {scores.length} tests
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestScores;