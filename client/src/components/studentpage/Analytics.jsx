import {
  LineChart,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

function Analytics() {
  const lineData = [
    { name: "Oct 24", growth: 65, marks: 70 },
    { name: "Nov 24", growth: 68, marks: 75 },
    { name: "Dec 24", growth: 70, marks: 78 },
    { name: "Jan 25", growth: 73, marks: 82 },
    { name: "Feb 25", growth: 75, marks: 85 },
  ];

  const pieData = [
    { name: "Oct", value: 45, fill: "#ff6b6b" },
    { name: "Nov", value: 40, fill: "#51cf66" },
    { name: "Dec", value: 45, fill: "#339af0" },
    { name: "Jan", value: 55, fill: "#000000" },
    { name: "Feb", value: 60, fill: "#ffd43b" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 ">
      <h2 className="text-lg font-semibold mb-6">Analytics</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#339af0"
                name="Growth Points"
              />
              <Line
                type="monotone"
                dataKey="marks"
                stroke="#ff6b6b"
                name="Marks Percentage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">Hours Spent</div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
