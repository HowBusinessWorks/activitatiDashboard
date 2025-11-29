import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Period, getAvailablePeriods } from "@/lib/period-utils"

interface PeriodSelectorProps {
  onPeriodChange: (period: Period) => void
  selectedPeriod: Period
}

export default function PeriodSelector({
  onPeriodChange,
  selectedPeriod,
}: PeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const periods = getAvailablePeriods(new Date(), 24)

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Selectați Perioada
      </label>
      <p className="text-xs text-slate-500 mb-1">
        {selectedPeriod.startDate} → {selectedPeriod.endDate}
      </p>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-left bg-white hover:bg-slate-50 transition flex items-center justify-between"
        >
          <span className="text-sm">{selectedPeriod.label}</span>
          <ChevronDown
            size={16}
            className={`transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-1 border border-slate-300 rounded-lg bg-white shadow-2xl z-50 min-w-80 w-full">
              <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                {periods.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-2">
                    Nu sunt perioade disponibile
                  </p>
                ) : (
                  periods.map((period) => (
                    <button
                      key={`${period.startDate}-${period.endDate}`}
                      onClick={() => {
                        onPeriodChange(period)
                        setIsOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        selectedPeriod.startDate === period.startDate &&
                        selectedPeriod.endDate === period.endDate
                          ? "bg-blue-100 text-blue-900 font-medium"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="block truncate">{period.label}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
