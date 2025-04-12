import React from "react";

const Stats = () => {
    const students = [
        { date: "----", id: "SC001", name: "Hashim Ansari", status: false, score: "---" },
        { date: "----", id: "SC001", name: "Ayan Farooque", status: false, score: "---" },
        { date: "----", id: "SC001", name: "Vedant Korade", status: false, score: "---" },
        { date: "----", id: "SC001", name: "Ronit Dhose", status: false, score: "---" },
        { date: "----", id: "SC001", name: "Himanshu Mishra", status: false, score: "---" },
        { date: "10/02/2025", id: "SC001", name: "Saiesh Sharma", status: true, score: "10/10" },
        { date: "11/02/2025", id: "SC001", name: "Sulabh Ambule", status: true, score: "09/10" },
        { date: "11/02/2025", id: "SC001", name: "Siya Dadpe", status: true, score: "02/10" },
        { date: "11/02/2025", id: "SC001", name: "Akshay Ambulge", status: true, score: "10/10" },
        { date: "13/02/2025", id: "SC001", name: "Suyash Munje", status: true, score: "07/10" },
      ];
    return(
        <div className="bg-[#f5f0dc] w-full p-6 rounded-lg min-h-[500px]">
      <div className="flex justify-between items-center bg-white p-3 w-full rounded-md shadow-md">
        <span className="font-bold text-lg">AS2002N HINDI 17 FEBRUARY 25’</span>
        <div className="flex items-center bg-white p-2 rounded-md shadow-md">
          <input type="text" placeholder="Search......." className="p-2 border-none outline-none text-gray-600" />
          <button className="ml-2 p-2 text-gray-600">🔍</button>
        </div>
      </div>
      
      <table className="w-full mt-4 bg-white rounded-lg shadow-md text-center">
        <thead>
          <tr className="bg-[#eae0c8] text-gray-700">
            <th className="p-2">Date Submitted</th>
            <th className="p-2">Std. ID.</th>
            <th className="p-2">Std. Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">Score</th>
            <th className="p-2">File</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="p-2">{student.date}</td>
              <td className="p-2">{student.id}</td>
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.status ? "✅" : "❌"}</td>
              <td className="p-2">{student.score}</td>
              <td className="p-2">
                {student.status && <button className="bg-[#e76f51] text-white px-3 py-1 rounded">View File</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center bg-[#f5f0dc] p-3 rounded-md ">
        <span>Total: 10 Submitted: 5 Pending: 5</span>
        <div className="flex gap-2">
          <button className="bg-[#e9c46a] px-4 py-2 rounded">Send Warning</button>
          <button className="bg-[#2a9d8f] text-white px-4 py-2 rounded">Extend Date</button>
          <button className="bg-[#e63946] text-white px-4 py-2 rounded">Close Assignment</button>
        </div>
      </div>
    </div>
    )
}

export default Stats