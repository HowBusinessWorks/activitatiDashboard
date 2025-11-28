import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface MonthSelectorProps {
  onMonthChange: (year: number, month: number) => void
}

const MONTHS_RO = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
]

export default function MonthSelector({ onMonthChange }: MonthSelectorProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [isOpen, setIsOpen] = useState(false)

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth)
    onMonthChange(year, newMonth)
    setIsOpen(false)
  }

  const handleYearChange = (direction: "prev" | "next") => {
    const newYear = direction === "prev" ? year - 1 : year + 1
    setYear(newYear)
    onMonthChange(newYear, month)
  }

  const displayMonth = MONTHS_RO[month - 1]

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Selectați Luna
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-left bg-white hover:bg-slate-50 transition flex items-center justify-between"
        >
          <span className="text-sm">
            {displayMonth.charAt(0).toUpperCase() + displayMonth.slice(1)} {year}
          </span>
          <ChevronDown
            size={16}
            className={`transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 border border-slate-300 rounded-lg bg-white shadow-lg z-10 p-4">
            {/* Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleYearChange("prev")}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← {year - 1}
              </button>
              <span className="text-sm font-semibold text-slate-900">{year}</span>
              <button
                onClick={() => handleYearChange("next")}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {year + 1} →
              </button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
              {MONTHS_RO.map((m, index) => (
                <button
                  key={m}
                  onClick={() => handleMonthChange(index + 1)}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    month === index + 1
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
