import { useEffect, useState } from "react";
import axios from "axios";

function TestScores({ currentStudentId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestScores = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/test-scores/test-results");
      const allScores = response.data;
      const filteredScores = allScores.filter(score => score.studentId?._id === currentStudentId);
      setScores(filteredScores);
    } catch (err) {
      setError("Failed to fetch test scores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestScores();
  }, [currentStudentId]);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Your Test Scores</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : scores.length === 0 ? (
        <p className="text-gray-500">No test scores available.</p>
      ) : (
        <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <table className="w-full border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800 border-b">
              <tr>
                <th className="text-left p-3">Subject</th>
                <th className="text-left p-3">Classroom</th>
                <th className="text-left p-3">Teacher</th>
                <th className="text-left p-3">Score</th>
                <th className="text-left p-3">Max Marks</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr key={score._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">{score.subjectName || "N/A"}</td>
                  <td className="p-3">{score.classroomId}</td>
                  <td className="p-3">{score.teacherName}</td>
                  <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">{score.score}</td>
                  <td className="p-3">{score.MaximumMarks}</td>
                  <td className="p-3">{new Date(score.CratedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
    </div>
  );
}

export default TestScores;
