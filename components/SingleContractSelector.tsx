import { useState } from "react"
import { Contract } from "@/lib/types"
import { ChevronDown } from "lucide-react"

interface SingleContractSelectorProps {
  contracts: Contract[]
  selectedContractId: string | null
  onSelectContract: (contractId: string | null) => void
}

export default function SingleContractSelector({
  contracts,
  selectedContractId,
  onSelectContract,
}: SingleContractSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectContract = (contractId: string) => {
    onSelectContract(contractId)
    setIsOpen(false)
  }

  const handleClear = () => {
    onSelectContract(null)
    setIsOpen(false)
  }

  const selectedContract = contracts.find((c) => c.id === selectedContractId)

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Selectați Contract
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
            {selectedContract
              ? selectedContract.contract_name
              : "-- Alegeți contract --"}
          </span>
          <ChevronDown
            size={16}
            className={`transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 border border-slate-300 rounded-lg bg-white shadow-2xl z-50 min-w-80 w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                {contracts.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-2">
                    Nu sunt contracte disponibile
                  </p>
                ) : (
                  <>
                    {selectedContractId && (
                      <button
                        onClick={handleClear}
                        className="w-full text-xs text-slate-500 hover:text-slate-700 pb-2 border-b border-slate-200 py-2"
                      >
                        Ștergeți Selectarea
                      </button>
                    )}
                    {contracts.map((contract) => (
                      <button
                        key={contract.id}
                        onClick={() => handleSelectContract(contract.id)}
                        className={`w-full text-left px-3 py-2 rounded transition ${
                          selectedContractId === contract.id
                            ? "bg-blue-100 text-blue-900 font-medium"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="block truncate">
                          {contract.contract_name}
                        </span>
                      </button>
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
