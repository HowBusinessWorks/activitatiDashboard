import { useState } from "react"
import { Calendar } from "lucide-react"

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: string, endDate: string) => void
}

export default function DateRangeSelector({
  onDateRangeChange,
}: DateRangeSelectorProps) {
  const today = new Date().toISOString().split("T")[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]

  const [startDate, setStartDate] = useState(thirtyDaysAgo)
  const [endDate, setEndDate] = useState(today)

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    if (newStartDate <= endDate) {
      onDateRangeChange(newStartDate, endDate)
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)
    if (startDate <= newEndDate) {
      onDateRangeChange(startDate, newEndDate)
    }
  }

  return (
    <div>
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs text-slate-600 mb-1">De la</label>
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-3 text-slate-400 pointer-events-none"
            />
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-slate-600 mb-1">Până la</label>
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-3 text-slate-400 pointer-events-none"
            />
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
