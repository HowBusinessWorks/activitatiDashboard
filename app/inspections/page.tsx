"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Contract } from "@/lib/types"
import { fetchInspectionGridData } from "@/lib/supabase/inspections-queries"
import SingleContractSelector from "@/components/SingleContractSelector"
import PeriodSelector from "@/components/PeriodSelector"
import InspectionsGrid from "@/components/InspectionsGrid"
import Link from "next/link"
import { getPeriodForDate, getLastThreePeriods, Period } from "@/lib/period-utils"

export default function InspectionsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)
  const currentPeriod = getPeriodForDate(new Date())
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(currentPeriod)
  const [viewMode, setViewMode] = useState<"single" | "three">("single")
  const [objectives, setObjectives] = useState<any[]>([])
  const [inspectionTypes, setInspectionTypes] = useState<string[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [multiPeriodData, setMultiPeriodData] = useState<
    Array<{ period: Period; objectives: any[]; inspectionTypes: string[]; records: any[] }>
  >([])

  // Fetch contracts on mount
  useEffect(() => {
    fetchContracts()
  }, [])

  // Fetch inspection data when contract, period, or view mode changes
  useEffect(() => {
    if (selectedContractId) {
      if (viewMode === "single") {
        fetchSinglePeriodData()
      } else {
        fetchMultiPeriodData()
      }
    } else {
      setObjectives([])
      setInspectionTypes([])
      setRecords([])
      setMultiPeriodData([])
    }
  }, [selectedContractId, selectedPeriod, viewMode])

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("contract_name")

      if (error) throw error
      setContracts(data || [])
    } catch (err) {
      setError("Failed to load contracts")
      console.error(err)
    }
  }

  const fetchSinglePeriodData = async () => {
    if (!selectedContractId) return

    setLoading(true)
    setError("")

    try {
      const data = await fetchInspectionGridData(
        selectedContractId,
        selectedPeriod.startDate,
        selectedPeriod.endDate
      )

      setObjectives(data.objectives)
      setInspectionTypes(data.inspectionTypes)
      setRecords(data.records)
    } catch (err) {
      setError("Failed to load inspection data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMultiPeriodData = async () => {
    if (!selectedContractId) return

    setLoading(true)
    setError("")

    try {
      // Parse the end date string (YYYY-MM-DD) into a Date object
      const [year, month, day] = selectedPeriod.endDate.split('-').map(Number)
      const endDate = new Date(year, month - 1, day)
      const periods = getLastThreePeriods(endDate)
      const results = await Promise.all(
        periods.map((period) =>
          fetchInspectionGridData(
            selectedContractId,
            period.startDate,
            period.endDate
          )
        )
      )

      setMultiPeriodData(
        results.map((data, index) => ({
          period: periods[index],
          objectives: data.objectives,
          inspectionTypes: data.inspectionTypes,
          records: data.records,
        }))
      )
    } catch (err) {
      setError("Failed to load inspection data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getSelectedContractName = () => {
    if (!selectedContractId) return "No contract selected"
    const contract = contracts.find((c) => c.id === selectedContractId)
    return contract?.contract_name || "Unknown"
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Tabloul Inspectiilor
              </h1>
              <p className="text-slate-600 mt-1">
                Vizualizati inspectiile efectuate pe obiective
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded transition border border-slate-300"
              >
                Probleme
              </Link>
              <Link
                href="/inspections"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Inspectii
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            <div>
              <SingleContractSelector
                contracts={contracts}
                selectedContractId={selectedContractId}
                onSelectContract={setSelectedContractId}
              />
            </div>
            <div>
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mod Vizualizare
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("single")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    viewMode === "single"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  1 Luna
                </button>
                <button
                  onClick={() => setViewMode("three")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    viewMode === "three"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  3 Luni
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full px-4 py-8">
        {!selectedContractId ? (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-slate-200 text-center">
            <p className="text-slate-600 text-lg">
              Selectati un contract pentru a vedea inspectiile
            </p>
          </div>
        ) : viewMode === "single" ? (
          <InspectionsGrid
            objectives={objectives}
            inspectionTypes={inspectionTypes}
            records={records}
            loading={loading}
          />
        ) : (
          <>
            <div className="mb-4 space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Comparație 3 Perioade:
              </h2>
              <div className="flex gap-4">
                {multiPeriodData.map((data) => (
                  <div
                    key={`${data.period.startDate}-${data.period.endDate}`}
                    className="px-3 py-2 bg-blue-50 border border-blue-200 rounded"
                  >
                    <p className="text-sm font-medium text-blue-900">
                      {data.period.label}
                    </p>
                    <p className="text-xs text-blue-700">
                      {data.period.startDate} → {data.period.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {(() => {
              // Merge objectives and inspection types from all 3 periods
              const objectivesMap = new Map<number, string>()
              const inspectionTypesSet = new Set<string>()
              const allRecords: any[] = []

              multiPeriodData.forEach((periodData) => {
                periodData.objectives.forEach((obj) => {
                  objectivesMap.set(obj.id, obj.name)
                })
                periodData.inspectionTypes.forEach((type) => {
                  inspectionTypesSet.add(type)
                })
                allRecords.push(...periodData.records)
              })

              const mergedObjectives = Array.from(objectivesMap)
                .map(([id, name]) => ({ id, name }))
                .sort((a, b) => a.id - b.id)
              const mergedInspectionTypes = Array.from(inspectionTypesSet).sort()

              return (
                <InspectionsGrid
                  objectives={mergedObjectives}
                  inspectionTypes={mergedInspectionTypes}
                  records={allRecords}
                  loading={loading}
                  multiPeriodData={viewMode === "three" ? multiPeriodData : undefined}
                />
              )
            })()}
          </>
        )}
      </div>
    </main>
  )
}
