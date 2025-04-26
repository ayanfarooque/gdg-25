import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from "recharts";

const Subject_DATA = [
	{ name: "Mathematics", value: 45600, color: "#6366F1" },
	{ name: "Science", value: 38200, color: "#8B5CF6" },
	{ name: "English", value: 29800, color: "#EC4899" },
	{ name: "Social Studies", value: 18700, color: "#10B981" },
];

const SubAnalysis = () => {
	return (
		<motion.div
			className='bg-white backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-200/30'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
			whileHover={{ 
				boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
			}}
		>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h2 className="text-lg font-medium text-gray-800">Performance by Subject</h2>
					<p className="text-sm text-gray-500">Score distribution across curriculum</p>
				</div>
				
				<div className="flex gap-2">
					<div className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">
						12 Month View
					</div>
					<div className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
						+8.3% Average
					</div>
				</div>
			</div>

			<div className='h-80'>
				<ResponsiveContainer>
					<BarChart data={Subject_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
						<defs>
							{Subject_DATA.map((entry, index) => (
								<linearGradient
									key={`gradient-${index}`}
									id={`gradient-${index}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
									<stop offset="100%" stopColor={entry.color} stopOpacity={0.3} />
								</linearGradient>
							))}
						</defs>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
						<XAxis 
							dataKey="name" 
							stroke="#9CA3AF"
							tickLine={false}
							axisLine={{ stroke: '#E5E7EB' }}
							tick={{ fill: '#6B7280', fontSize: 12 }}  
						/>
						<YAxis 
							stroke="#9CA3AF"
							tickLine={false}
							axisLine={{ stroke: '#E5E7EB' }}
							tick={{ fill: '#6B7280', fontSize: 12 }}
							width={40}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "white",
								borderRadius: "8px",
								boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
								borderColor: "#E5E7EB",
							}}
							cursor={{ fill: 'rgba(229, 231, 235, 0.3)' }}
							itemStyle={{ color: "#111827" }}
							labelStyle={{ color: "#4B5563", fontWeight: "600", marginBottom: "4px" }}
							formatter={(value) => [`${value}`, 'Score']}
						/>
						<Legend 
							wrapperStyle={{ paddingTop: 10 }}
							formatter={(value) => <span style={{ color: "#4B5563", fontSize: 12 }}>Subject Performance</span>}
						/>
						<Bar 
							dataKey="value" 
							name="Score"
							radius={[10, 10, 0, 0]}
							barSize={40}
							animationDuration={1500}
							animationEasing="ease-in-out"
						>
							{Subject_DATA.map((entry, index) => (
								<Cell 
									key={`cell-${index}`} 
									fill={`url(#gradient-${index})`} 
									stroke={entry.color}
									strokeWidth={1}
								/>
							))}
							<LabelList 
								dataKey="value" 
								position="top" 
								formatter={(value) => `${Math.round(value / 1000)}K`}
								style={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
			
			{/* Performance Highlights */}
			<div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200 mt-4">
				{Subject_DATA.map((subject, index) => (
					<div key={index} className="text-center">
						<div className="text-sm font-medium text-gray-500">{subject.name}</div>
						<div 
							className="text-base font-semibold mt-1"
							style={{ color: subject.color }}
						>
							{Math.round(subject.value / 1000)}K
						</div>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default SubAnalysis;