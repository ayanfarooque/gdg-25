const TestScores = () => {
    return (
      <div className="bg-gray-100 w-3/4 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Test Scores</h2>
        <div className="space-y-4">
          {["Social Science", "Science", "Mathematics"].map((subject) => (
            <div key={subject} className="bg-white p-3 rounded-lg shadow">
              <h3 className="font-semibold text-gray-800">{subject}</h3>
              {testData.filter((item) => item.subject === subject).map((test) => (
                <div key={test.code} className="flex justify-between text-sm mt-2">
                  <span>{test.date}</span>
                  <span>{test.code}</span>
                  <span>{test.subject}</span>
                  <span>{test.teacher}</span>
                  <span className="font-bold">{test.score}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default TestScores;
  