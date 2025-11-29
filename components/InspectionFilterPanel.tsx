import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface InspectionFilterPanelProps {
  categories: string[]
  selectedCategories: string[]
  onSelectCategories: (categories: string[]) => void
}

export default function InspectionFilterPanel({
  categories,
  selectedCategories,
  onSelectCategories,
}: InspectionFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    onSelectCategories(updated)
  }

  const handleClearAll = () => {
    onSelectCategories([])
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Filtrare după Tip de Inspecție
      </label>
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-left bg-white hover:bg-slate-50 transition flex items-center justify-between"
        >
          <span className="text-sm">
            {selectedCategories.length > 0
              ? `${selectedCategories.length} selectate`
              : "Toate categoriile"}
          </span>
          <ChevronDown
            size={16}
            className={`transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 border border-slate-300 rounded-lg bg-white shadow-lg z-50" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-2">
                  Nu sunt categorii disponibile
                </p>
              ) : (
                <>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleToggleCategory(category)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700 flex-1 truncate">
                        {category}
                      </span>
                    </label>
                  ))}
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="w-full mt-2 pt-2 border-t border-slate-200 text-xs text-blue-600 hover:text-blue-700 py-1"
                    >
                      Ștergeți tot
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
