import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import "./CalendarStyles.css"; // We'll create this file next

function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  
  // Sample events data - in a real app, this would come from API
  const events = useMemo(() => ({
    "2024-08-05": [{ title: "Math Quiz", type: "quiz" }],
    "2024-08-12": [{ title: "Science Project Due", type: "assignment" }],
    "2024-08-15": [{ title: "Parent-Teacher Meeting", type: "meeting" }],
    "2024-08-20": [{ title: "English Presentation", type: "presentation" }, { title: "Geography Field Trip", type: "event" }],
    "2024-08-25": [{ title: "Computer Science Test", type: "exam" }]
  }), []);

  // Today's events
  const todayEvents = [
    { 
      id: 1, 
      time: "9:00 - 10:30", 
      title: "Mathematics", 
      location: "Room 101", 
      teacher: "Prof. Johnson",
      type: "lecture",
      past: true
    },
    { 
      id: 2, 
      time: "11:00 - 12:30", 
      title: "Computer Science", 
      location: "Lab 2", 
      teacher: "Dr. Smith",
      type: "lab",
      current: true
    },
    { 
      id: 3, 
      time: "14:00 - 15:30", 
      title: "Physics", 
      location: "Room 203", 
      teacher: "Prof. Clark",
      type: "lecture"
    }
  ];

  // Function to check if a date has events
  const hasEvents = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events[dateStr] && events[dateStr].length > 0;
  };

  // Function to render custom tile content
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events[dateStr] || [];
    
    if (dayEvents.length === 0) return null;
    
    return (
      <div className="event-indicators">
        {dayEvents.map((event, index) => (
          <span 
            key={index} 
            className={`event-dot ${event.type}`} 
            title={event.title}
          />
        ))}
      </div>
    );
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="calendar-wrapper"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {date.toLocaleDateString('en-US', { month: 'long' })}
          </h2>
          <p className="text-sm text-gray-500">{date.getFullYear()}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
          <FiCalendar size={20} />
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar 
        onChange={(value) => {
          setDate(value);
          setSelectedDay(value);
        }}
        value={date} 
        className="custom-calendar" 
        tileContent={tileContent}
        tileClassName={({ date }) => hasEvents(date) ? "has-events" : null}
      />

      {/* Daily Schedule */}
      <div className="mt-6 bg-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800">{formatDate(selectedDay)}</h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            3 Classes
          </span>
        </div>
        
        <div className="space-y-3">
          {todayEvents.map(event => (
            <motion.div 
              key={event.id}
              whileHover={{ x: 2 }}
              className={`p-3 rounded-lg border ${
                event.current ? 'border-blue-200 bg-blue-50' : 
                event.past ? 'border-gray-200 bg-gray-50 opacity-75' : 
                'border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{event.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  event.type === 'lecture' ? 'bg-purple-100 text-purple-700' :
                  event.type === 'lab' ? 'bg-green-100 text-green-700' :
                  event.type === 'exam' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-1">
                <div className="flex items-center text-xs text-gray-500">
                  <FiClock className="mr-1" size={12} />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <FiUser className="mr-1" size={12} />
                  <span>{event.teacher}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 col-span-2">
                  <FiMapPin className="mr-1" size={12} />
                  <span>{event.location}</span>
                </div>
              </div>
              
              {event.current && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-700 font-medium">In progress</span>
                    <span className="text-xs text-blue-700">45 min remaining</span>
                  </div>
                  <div className="mt-1 bg-blue-100 h-1.5 rounded-full">
                    <div className="bg-blue-500 h-1.5 rounded-full w-3/5"></div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default CalendarComponent;

