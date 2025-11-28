import { useState } from "react"
import { Calendar } from "lucide-react"

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void
}

export default function DateRangeFilter({
  onDateRangeChange,
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    onDateRangeChange(value || null, endDate || null)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    onDateRangeChange(startDate || null, value || null)
  }

  const handleClear = () => {
    setStartDate("")
    setEndDate("")
    onDateRangeChange(null, null)
  }

  const formatDisplayDate = (date: string) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Interval de Date
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-left bg-white hover:bg-slate-50 transition flex items-center justify-between"
        >
          <span className="text-sm flex items-center gap-2">
            <Calendar size={16} />
            {startDate && endDate
              ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
              : startDate
              ? `De la ${formatDisplayDate(startDate)}`
              : endDate
              ? `Până la ${formatDisplayDate(endDate)}`
              : "Selectați intervalul de date"}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 border border-slate-300 rounded-lg bg-white shadow-lg z-10 p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Data Inițială
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Data Finală
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={handleClear}
                className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1 border-t border-slate-200 pt-3"
              >
                Ștergeți Datele
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
