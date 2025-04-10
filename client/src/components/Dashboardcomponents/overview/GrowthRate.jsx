import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const GrowthData = [
	{ name: "Jul", Growth: 4200 },
	{ name: "Aug", Growth: 3800 },
	{ name: "Sep", Growth: 5100 },
	{ name: "Oct", Growth: 4600 },
	{ name: "Nov", Growth: 5400 },
	{ name: "Dec", Growth: 7200 },
	{ name: "Jan", Growth: 6100 },
	{ name: "Feb", Growth: 5900 },
	{ name: "Mar", Growth: 6800 },
	{ name: "Apr", Growth: 6300 },
	{ name: "May", Growth: 7100 },
	{ name: "Jun", Growth: 7500 },
];

const GrowthRate = ({ bgColor = "bg-gray-800" }) => {
	return (
	  <motion.div
		className={`${bgColor} bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.2 }}
	  >
		<h2 className="text-lg font-medium mb-4 text-gray-100">Growth Overview</h2>
  
		<div className="h-80">
		  <ResponsiveContainer width={"100%"} height={"100%"}>
			<LineChart data={GrowthData}>
			  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
			  <XAxis dataKey={"name"} stroke="#9ca3af" />
			  <YAxis stroke="#9ca3af" />
			  <Tooltip
				contentStyle={{
				  backgroundColor: "rgba(31, 41, 55, 0.8)",
				  borderColor: "#4B5563",
				}}
				itemStyle={{ color: "#E5E7EB" }}
			  />
			  <Line
				type="monotone"
				dataKey="Growth"
				stroke="#6366F1"
				strokeWidth={3}
				dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
				activeDot={{ r: 8, strokeWidth: 2 }}
			  />
			</LineChart>
		  </ResponsiveContainer>
		</div>
	  </motion.div>
	);
  };
  
export default GrowthRate;