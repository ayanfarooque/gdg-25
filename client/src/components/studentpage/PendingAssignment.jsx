function PendingAssignments() {
    const assignments = [
      { subject: "DATA STRUCTURES", date: "20 Feb" },
      { subject: "OPERATING SYSTEM", date: "22 Feb" },
    ];
  
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">PENDING ASSIGNMENTS</h2>
        <div className="space-y-2">
          {assignments.map((assignment) => (
            <div
              key={assignment.subject}
              className="flex items-center justify-between bg-red-100 rounded-full px-4 py-2"
            >
              <span className="text-red-600 font-medium">{assignment.subject}</span>
              <span className="text-red-600">{assignment.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default PendingAssignments;
  