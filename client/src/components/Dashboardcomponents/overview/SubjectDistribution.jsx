import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SubjectData = [
	{ name: "Mathematics", value: 4500 },
	{ name: "Science", value: 3200 },
	{ name: "English", value: 2800 },
	{ name: "Social Studies", value: 2100 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const SubjectDistribution = ({ bgColor = "bg-[#F5F5DD]" }) => {
	return (
		<motion.div
			className={`${bgColor} bg-opacity-100 shadow-lg rounded-xl p-6 border border-gray-200/30 backdrop-blur-sm`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
			whileHover={{ 
				boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
			}}
		>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h2 className="text-lg font-medium text-gray-800">Subject Distribution</h2>
					<p className="text-sm text-gray-500">Time allocation by subject</p>
				</div>
				<div className="bg-purple-50 text-purple-600 text-xs font-medium px-3 py-1 rounded-full">
					Updated Today
				</div>
			</div>

			<div className="h-64">
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={SubjectData}
							cx={"50%"}
							cy={"50%"}
							innerRadius={60}
							outerRadius={80}
							fill="#8884d8"
							paddingAngle={5}
							dataKey="value"
							labelLine={false}
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{SubjectData.map((entry, index) => (
								<Cell 
									key={`cell-${index}`} 
									fill={COLORS[index % COLORS.length]}
									stroke="white"
									strokeWidth={2}
								/>
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "white",
								borderRadius: "8px",
								boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
								borderColor: "#E5E7EB",
							}}
							itemStyle={{ color: "#111827" }}
							formatter={(value, name) => [`${value} hours`, name]}
						/>
						<Legend 
							layout="vertical"
							align="end"
							verticalAlign="middle"
							iconType="circle"
							iconSize={8}
							formatter={(value) => (
								<span style={{ color: "#4B5563", fontSize: 12, marginLeft: 8 }}>
									{value}
								</span>
							)}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>

			{/* Subject Metrics */}
			<div className="mt-4 border-t border-gray-200 pt-4">
				<div className="text-center">
					<div className="text-sm font-medium text-gray-500">Most Focus</div>
					<div className="flex items-center justify-center mt-1">
						<div className="h-3 w-3 rounded-full bg-indigo-600 mr-2"></div>
						<div className="text-base font-semibold text-gray-800">Mathematics</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};
export default SubjectDistribution;