import { useState } from "react"
import { Objective, InspectionRecord } from "@/lib/types"
import { Period } from "@/lib/period-utils"
import InspectionDetailModal from "./InspectionDetailModal"
import { hasInspection } from "@/lib/supabase/inspections-queries"

interface MultiPeriodData {
  period: Period
  objectives: Objective[]
  inspectionTypes: string[]
  records: InspectionRecord[]
}

interface InspectionsGridProps {
  objectives: Objective[]
  inspectionTypes: string[]
  records: InspectionRecord[]
  loading: boolean
  multiPeriodData?: MultiPeriodData[]
}

export default function InspectionsGrid({
  objectives,
  inspectionTypes,
  records,
  loading,
  multiPeriodData,
}: InspectionsGridProps) {
  const [selectedCell, setSelectedCell] = useState<{
    objective_name: string
    inspection_type: string
  } | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Se încarcă datele inspectiilor...</p>
        </div>
      </div>
    )
  }

  if (objectives.length === 0 || inspectionTypes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 border border-slate-200 text-center">
        <p className="text-slate-600 text-lg">
          Nu sunt date disponibile pentru luna si contractul selectat.
        </p>
      </div>
    )
  }

  // Get inspection records for the selected cell
  const getRecordsForCell = (
    objectiveId: number,
    inspectionType: string
  ): InspectionRecord[] => {
    return records.filter(
      (record) =>
        record.objective_id === objectiveId &&
        record.inspection_type === inspectionType
    )
  }

  // Find objective name by ID
  const getObjectiveName = (objectiveId: number): string => {
    const obj = objectives.find((o) => o.id === objectiveId)
    return obj?.name || "Unknown"
  }

  // Calculate available width and cell dimensions
  // Objective column: 400px (wider for objective names)
  // Remaining space divided equally among inspection types
  const objectiveColumnWidth = 400
  const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1400
  const availableForInspections = containerWidth - objectiveColumnWidth - 40 // 40px for padding
  const cellWidth = Math.max(80, availableForInspections / inspectionTypes.length)

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
        {/* Table - No horizontal scroll, fits on screen */}
        <div className="w-full">
          <table className="w-full table-fixed">
            {/* Header */}
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300">
                <th className="px-4 py-2 text-left text-sm font-bold text-slate-900 sticky left-0 bg-slate-100 z-10 border-r-2 border-slate-300" style={{ width: `${objectiveColumnWidth}px` }}>
                  <div>Obiective</div>
                </th>
                {inspectionTypes.map((type, idx) => (
                  <th
                    key={type}
                    className={`px-2 py-2 text-center text-xs font-bold text-slate-900 ${
                      idx < inspectionTypes.length - 1
                        ? "border-r border-slate-300"
                        : ""
                    }`}
                    style={{ width: `${cellWidth}px` }}
                  >
                    <div className="line-clamp-3 text-xs leading-tight break-words">
                      {type}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {objectives.map((objective, objectiveIndex) => (
                <tr
                  key={objective.id}
                  className={`border-b border-slate-200 hover:bg-blue-50 transition ${
                    objectiveIndex % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  {/* Objective Name Cell - Always visible on left */}
                  <td className="px-4 py-1 text-sm font-semibold text-slate-900 sticky left-0 bg-inherit border-r-2 border-slate-300 z-5" style={{ width: `${objectiveColumnWidth}px` }}>
                    <div className="truncate" title={objective.name}>
                      {objective.name}
                    </div>
                  </td>

                  {/* Inspection Type Cells */}
                  {inspectionTypes.map((inspectionType, idx) => {
                    const cellRecords = getRecordsForCell(
                      objective.id,
                      inspectionType
                    )
                    const hasInspectionDone = hasInspection(
                      records,
                      objective.id,
                      inspectionType
                    )

                    return (
                      <td
                        key={`${objective.id}-${inspectionType}`}
                        className={`py-1 text-center border-r border-slate-300 last:border-r-0 ${
                          hasInspectionDone ? "bg-green-50" : ""
                        }`}
                        style={{ width: `${cellWidth}px` }}
                      >
                        {multiPeriodData ? (
                          // Multi-period view: show 3 mini indicators
                          <div className="flex justify-center gap-1">
                            {multiPeriodData.map((periodData) => {
                              const periodRecords = periodData.records.filter(
                                (record) =>
                                  record.objective_id === objective.id &&
                                  record.inspection_type === inspectionType
                              )
                              const hasPeriodInspection = periodRecords.length > 0

                              return (
                                <div
                                  key={periodData.period.label}
                                  className="flex flex-col items-center"
                                >
                                  {hasPeriodInspection ? (
                                    <button
                                      onClick={() =>
                                        setSelectedCell({
                                          objective_name: objective.name,
                                          inspection_type: inspectionType,
                                        })
                                      }
                                      className="w-5 h-5 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded transition cursor-pointer flex items-center justify-center"
                                      title={`${periodRecords.length} in ${periodData.period.label}`}
                                    >
                                      ✓
                                    </button>
                                  ) : (
                                    <div className="w-5 h-5 text-xs text-slate-300">
                                      —
                                    </div>
                                  )}
                                  <span className="text-xs text-slate-600 font-bold">
                                    {periodRecords.length || "0"}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          // Single period view: original display
                          <>
                            {hasInspectionDone ? (
                              <button
                                onClick={() =>
                                  setSelectedCell({
                                    objective_name: objective.name,
                                    inspection_type: inspectionType,
                                  })
                                }
                                className="inline-flex items-center justify-center gap-1 rounded-lg bg-green-200 hover:bg-green-300 transition cursor-pointer group relative shadow-sm hover:shadow-md px-2 py-1"
                                title={`${cellRecords.length} inspectii efectuate`}
                              >
                                <span className="text-green-700 font-bold text-lg">
                                  ✓
                                </span>
                                <span className="text-xs font-bold text-green-800">
                                  {cellRecords.length}
                                </span>
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-20 pointer-events-none">
                                  {cellRecords.length} inspectii
                                </div>
                              </button>
                            ) : (
                              <div className="text-slate-300 text-xl font-light">
                                —
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600">Total Obiective</p>
              <p className="text-2xl font-bold text-slate-900">
                {objectives.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Tipuri Inspecții</p>
              <p className="text-2xl font-bold text-slate-900">
                {inspectionTypes.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Inspecții Efectuate</p>
              <p className="text-2xl font-bold text-slate-900">
                {records.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCell && (
        <InspectionDetailModal
          isOpen={!!selectedCell}
          objective_name={selectedCell.objective_name}
          inspection_type={selectedCell.inspection_type}
          records={getRecordsForCell(
            objectives.find((o) => o.name === selectedCell.objective_name)?.id ||
              0,
            selectedCell.inspection_type
          )}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </>
  )
}
