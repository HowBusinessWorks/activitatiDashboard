"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Contract, Issue } from "@/lib/types"
import KanbanBoard from "@/components/KanbanBoard"
import ContractSelector from "@/components/ContractSelector"
import InspectionFilterPanel from "@/components/InspectionFilterPanel"
import DateRangeFilter from "@/components/DateRangeFilter"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("dashboardAuth")
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])
  const [selectedContractIds, setSelectedContractIds] = useState<string[]>([])
  const [selectedInspectionTypes, setSelectedInspectionTypes] = useState<
    string[]
  >([])
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [inspectionCategories, setInspectionCategories] = useState<string[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    const verifyPassword = async () => {
      try {
        const response = await fetch("/api/verify-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: authPassword }),
        })

        const data = await response.json()

        if (data.valid) {
          setAuthPassword("")
          sessionStorage.setItem("dashboardAuth", "true")
          setIsAuthenticated(true)
        } else {
          setAuthError("Invalid password")
          setAuthPassword("")
        }
      } catch (err) {
        setAuthError("Failed to verify password")
        setAuthPassword("")
      }
    }

    verifyPassword()
  }

  // Fetch contracts on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchContracts()
    }
  }, [isAuthenticated])

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

  // Fetch inspection categories (always, not just when contracts selected)
  useEffect(() => {
    fetchInspectionCategories()
  }, [selectedContractIds])

  const fetchInspectionCategories = async () => {
    try {
      let query = supabase.from("issues").select("inspection_category")

      // If contracts are selected, filter by those contracts
      if (selectedContractIds.length > 0) {
        query = query.in("contract_id", selectedContractIds)
      }

      const { data, error } = await query

      if (error) throw error

      const categories = Array.from(
        new Set((data || []).map((item) => item.inspection_category).filter(Boolean))
      ).sort() as string[]

      setInspectionCategories(categories)
    } catch (err) {
      console.error("Failed to load inspection categories:", err)
    }
  }

  // Fetch issues for selected contracts and filters
  useEffect(() => {
    if (selectedContractIds.length > 0 || selectedInspectionTypes.length > 0) {
      fetchIssues()
    } else {
      setIssues([])
    }
  }, [selectedContractIds, selectedInspectionTypes, startDate, endDate])

  const fetchIssues = async () => {
    if (selectedContractIds.length === 0 && selectedInspectionTypes.length === 0) return

    setLoading(true)
    try {
      let query = supabase
        .from("issues")
        .select(
          `
          *,
          activities:activity_id(
            task_name,
            stage_name,
            contractors
          )
        `
        )

      // If contracts are selected, filter by those
      if (selectedContractIds.length > 0) {
        query = query.in("contract_id", selectedContractIds)
      }

      // If inspection types are selected, filter by those
      if (selectedInspectionTypes.length > 0) {
        query = query.in("inspection_category", selectedInspectionTypes)
      }

      // Apply date range filter
      if (startDate) {
        query = query.gte("created_at", `${startDate}T00:00:00`)
      }
      if (endDate) {
        query = query.lte("created_at", `${endDate}T23:59:59`)
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      })

      if (error) throw error
      setIssues(data || [])
      setError("")
    } catch (err) {
      setError("Failed to load issues")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("issues")
        .update({
          status: newStatus as "identified" | "in_progress" | "done",
          updated_at: new Date().toISOString(),
        })
        .eq("id", issueId)

      if (error) throw error

      // Update local state
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId
            ? { ...issue, status: newStatus as "identified" | "in_progress" | "done" }
            : issue
        )
      )
    } catch (err) {
      setError("Failed to update issue status")
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Tablou de Bord</h1>
            <p className="text-slate-600 mb-6">Introduceți parola pentru a accesa</p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Parolă"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Conectare
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Probleme
              </h1>
              <p className="text-slate-600 mt-1">
                Gestionați problemele identificate în construcție
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Tabla Probleme
              </Link>
              <Link
                href="/inspections"
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded transition border border-slate-300"
              >
                Tabloul Inspectiilor
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <ContractSelector
                contracts={contracts}
                selectedContractIds={selectedContractIds}
                onSelectContracts={setSelectedContractIds}
              />
            </div>
            <div>
              <InspectionFilterPanel
                categories={inspectionCategories}
                selectedCategories={selectedInspectionTypes}
                onSelectCategories={setSelectedInspectionTypes}
              />
            </div>
            <div>
              <DateRangeFilter
                onDateRangeChange={(start, end) => {
                  setStartDate(start)
                  setEndDate(end)
                }}
              />
            </div>
            <button
              onClick={() => {
                fetchContracts()
                if (selectedContractIds.length > 0 || selectedInspectionTypes.length > 0) {
                  fetchIssues()
                }
              }}
              className="px-2 py-1 bg-slate-600 text-white text-xs rounded hover:bg-slate-700 transition h-fit self-end"
            >
              Reîncărcare
            </button>
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

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedContractIds.length > 0 || selectedInspectionTypes.length > 0 ? (
          <KanbanBoard
            issues={issues}
            loading={loading}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600 mb-4">
              Selectați unul sau mai multe contracte sau tipuri de inspecție pentru a vedea problemele
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
