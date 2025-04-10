import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { Calendar as CalendarIcon } from "react-feather"

function CalendarComponent() {
  const [date, setDate] = useState(new Date())

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <div className="text-4xl font-bold tracking-tight">AUGUST</div>
          <div className="text-xl text-gray-500">2024</div>
        </div>
        <CalendarIcon className="w-6 h-6" />
      </div>
      <Calendar onChange={setDate} value={date} className="rounded-md border" />
    </div>
  )
}

export default CalendarComponent

