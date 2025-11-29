import { useState } from "react"
import { Contract } from "@/lib/types"
import { ChevronDown } from "lucide-react"

interface ContractSelectorProps {
  contracts: Contract[]
  selectedContractIds: string[]
  onSelectContracts: (contractIds: string[]) => void
}

export default function ContractSelector({
  contracts,
  selectedContractIds,
  onSelectContracts,
}: ContractSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleContract = (contractId: string) => {
    const updated = selectedContractIds.includes(contractId)
      ? selectedContractIds.filter((id) => id !== contractId)
      : [...selectedContractIds, contractId]
    onSelectContracts(updated)
  }

  const handleSelectAll = () => {
    if (selectedContractIds.length === contracts.length) {
      onSelectContracts([])
    } else {
      onSelectContracts(contracts.map((c) => c.id))
    }
  }

  const handleClearAll = () => {
    onSelectContracts([])
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Selectați Contracte
      </label>
      <div className="relative w-full">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-left bg-white hover:bg-slate-50 transition flex items-center justify-between"
        >
          <span className="text-sm">
            {selectedContractIds.length === 0
              ? "-- Alegeți contracte --"
              : selectedContractIds.length === 1
              ? "1 contract selectat"
              : `${selectedContractIds.length} contracte selectate`}
          </span>
          <ChevronDown
            size={16}
            className={`transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 border border-slate-300 rounded-lg bg-white shadow-lg z-50 min-w-80" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
              {contracts.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-2">
                  Nu sunt contracte disponibile
                </p>
              ) : (
                <>
                  <div className="flex gap-2 pb-2 border-b border-slate-200">
                    <button
                      onClick={handleSelectAll}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {selectedContractIds.length === contracts.length
                        ? "Deselectați Tot"
                        : "Selectați Tot"}
                    </button>
                    {selectedContractIds.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Ștergeți
                      </button>
                    )}
                  </div>
                  {contracts.map((contract) => (
                    <label
                      key={contract.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContractIds.includes(contract.id)}
                        onChange={() => handleToggleContract(contract.id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700 flex-1 truncate">
                        {contract.contract_name}
                      </span>
                    </label>
                  ))}
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
