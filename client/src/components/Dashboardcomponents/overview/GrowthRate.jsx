import { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Area,
  AreaChart,
  ReferenceLine,
  ReferenceArea
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrendingUp, FiCalendar, FiFilter, FiChevronDown, FiInfo } from "react-icons/fi";

// Sample academic performance data
const GrowthData = [
  { name: "Jul", Growth: 4200, avgClass: 3800 },
  { name: "Aug", Growth: 3800, avgClass: 3700 },
  { name: "Sep", Growth: 5100, avgClass: 3900 },
  { name: "Oct", Growth: 4600, avgClass: 4000 },
  { name: "Nov", Growth: 5400, avgClass: 4100 },
  { name: "Dec", Growth: 7200, avgClass: 4300 },
  { name: "Jan", Growth: 6100, avgClass: 4500 },
  { name: "Feb", Growth: 5900, avgClass: 4600 },
  { name: "Mar", Growth: 6800, avgClass: 4700 },
  { name: "Apr", Growth: 6300, avgClass: 4800 },
  { name: "May", Growth: 7100, avgClass: 4900 },
  { name: "Jun", Growth: 7500, avgClass: 5000 }
];

// Time period options
const timePeriods = [
  { value: "1M", label: "Last Month" },
  { value: "3M", label: "Last 3 Months" },
  { value: "6M", label: "Last 6 Months" },
  { value: "1Y", label: "Last Year" },
  { value: "All", label: "All Time" }
];

const GrowthRate = ({ bgColor = "bg-white" }) => {
  const [periodFilter, setPeriodFilter] = useState("1Y");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Calculate filtered data based on selected period
  const filteredData = () => {
    switch (periodFilter) {
      case "1M":
        return GrowthData.slice(-1);
      case "3M":
        return GrowthData.slice(-3);
      case "6M":
        return GrowthData.slice(-6);
      case "1Y":
      default:
        return GrowthData;
    }
  };

  // Calculate KPI metrics
  const calculateMetrics = () => {
    const data = filteredData();
    const highest = Math.max(...data.map(d => d.Growth));
    const average = Math.round(data.reduce((acc, d) => acc + d.Growth, 0) / data.length);
    
    // Calculate improvement percentage
    const firstValue = data[0]?.Growth || 0;
    const lastValue = data[data.length - 1]?.Growth || 0;
    const improvement = firstValue > 0 
      ? Math.round(((lastValue - firstValue) / firstValue) * 100) 
      : 0;
      
    return { highest, average, improvement };
  };

  const { highest, average, improvement } = calculateMetrics();
  const data = filteredData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 inline-block bg-indigo-500 rounded-full mr-2"></span>
              <span className="text-gray-600">Your Score: </span>
              <span className="font-semibold ml-1">{payload[0].value}</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 inline-block bg-gray-400 rounded-full mr-2"></span>
              <span className="text-gray-600">Class Average: </span>
              <span className="font-semibold ml-1">{payload[1].value}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {payload[0].value > payload[1].value 
                ? `${Math.round((payload[0].value - payload[1].value) / payload[1].value * 100)}% above average`
                : `${Math.round((payload[1].value - payload[0].value) / payload[1].value * 100)}% below average`
              }
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className={`${bgColor} shadow-sm rounded-xl p-6 border border-gray-100`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)" 
      }}
    >
      <div className="flex justify-between items-start mb-6 relative">
        <div>
          <h2 className="flex items-center text-lg font-semibold text-gray-800">
            Academic Performance Trend
            <button 
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowInfo(!showInfo)}
            >
              <FiInfo size={16} />
            </button>
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Monthly progress metrics</p>
          
          {/* Animated info popover */}
          <AnimatePresence>
            {showInfo && (
              <motion.div 
                className="absolute top-8 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 text-xs text-gray-600 max-w-xs"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                This chart shows your academic performance trend compared to the class average.
                Higher scores indicate better performance on assessments, participation, and other metrics.
                <div className="mt-2 flex">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 inline-block bg-indigo-500 rounded-full mr-1"></span>
                    Your Score
                  </span>
                  <span className="inline-flex items-center ml-3">
                    <span className="w-2 h-2 inline-block bg-gray-400 rounded-full mr-1"></span>
                    Class Average
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Time Period Filter */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            <FiCalendar size={14} />
            <span>{timePeriods.find(p => p.value === periodFilter)?.label}</span>
            <FiChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200 py-1 w-40"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {timePeriods.map(period => (
                  <button
                    key={period.value}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      periodFilter === period.value ? 'font-medium text-indigo-600 bg-indigo-50' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setPeriodFilter(period.value);
                      setDropdownOpen(false);
                    }}
                  >
                    {period.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="classGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            
            <YAxis 
              stroke="#94a3b8"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              width={40}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="avgClass"
              name="Class Average"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#classGradient)"
              activeDot={false}
              strokeDasharray="5 5"
            />
            
            <Area
              type="monotone"
              dataKey="Growth"
              name="Your Performance"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#growthGradient)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 pt-4 mt-2">
        <KpiCard 
          value={highest} 
          label="Highest Score"
          icon={<FiTrendingUp />}
          color="text-indigo-600"
        />
        <KpiCard 
          value={average} 
          label="Average"
          icon={<FiFilter />}
          color="text-gray-700"
          border
        />
        <KpiCard 
          value={`${improvement > 0 ? '+' : ''}${improvement}%`} 
          label="Improvement"
          icon={<FiTrendingUp />}
          color={improvement >= 0 ? "text-emerald-600" : "text-rose-600"}
        />
      </div>
    </motion.div>
  );
};

// KPI Card Component
const KpiCard = ({ value, label, icon, color, border = false }) => (
  <div className={`text-center p-3 rounded-lg ${border ? 'border-x border-gray-100' : ''}`}>
    <div className="flex items-center justify-center">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <span className={`ml-1 ${color}`}>{icon}</span>
    </div>
    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
  </div>
);
  
export default GrowthRate;