import { useState } from "react"
import { Issue } from "@/lib/types"
import IssueCard from "./IssueCard"

interface KanbanBoardProps {
  issues: Issue[]
  loading: boolean
  onStatusChange: (issueId: string, newStatus: string) => void
}

const STATUSES = ["identified", "in_progress", "done"] as const

export default function KanbanBoard({
  issues,
  loading,
  onStatusChange,
}: KanbanBoardProps) {
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null)
  const [draggedFromStatus, setDraggedFromStatus] = useState<string | null>(null)

  const handleDragStart = (issueId: string, fromStatus: string) => {
    setDraggedIssueId(issueId)
    setDraggedFromStatus(fromStatus)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-blue-50")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-blue-50")
  }

  const handleDrop = (e: React.DragEvent, toStatus: string) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-blue-50")

    if (draggedIssueId && draggedFromStatus !== toStatus) {
      onStatusChange(draggedIssueId, toStatus)
    }

    setDraggedIssueId(null)
    setDraggedFromStatus(null)
  }

  const getIssuesByStatus = (status: string) => {
    return issues.filter((issue) => issue.status === status)
  }

  const columnConfig = [
    {
      status: "identified",
      title: "Probleme",
      description: "Probleme identificate",
      color: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      badgeColor: "bg-red-100 text-red-800",
    },
    {
      status: "in_progress",
      title: "În Progres",
      description: "Se lucrează la acestea",
      color: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    {
      status: "done",
      title: "Rezolvate",
      description: "Probleme rezolvate",
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      badgeColor: "bg-green-100 text-green-800",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Se încarcă problemele...</p>
        </div>
      </div>
    )
  }

  const totalIssues = issues.length

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
        <p className="text-sm text-slate-600">
          Total Probleme: <span className="font-semibold text-slate-900">{totalIssues}</span>
        </p>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columnConfig.map((column) => {
          const columnIssues = getIssuesByStatus(column.status)

          return (
            <div key={column.status} className="flex flex-col">
              {/* Column Header */}
              <div className={`bg-gradient-to-r ${column.color} rounded-t-lg p-4 border-b-2 ${column.borderColor}`}>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-slate-900">{column.title}</h2>
                  <span
                    className={`text-sm font-bold ${column.badgeColor} px-2.5 py-0.5 rounded-full`}
                  >
                    {columnIssues.length}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{column.description}</p>
              </div>

              {/* Column Content */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
                className={`flex-1 p-4 bg-slate-50 rounded-b-lg border-2 border-slate-200 transition ${
                  draggedIssueId && draggedFromStatus !== column.status
                    ? "border-dashed border-blue-400"
                    : ""
                }`}
              >
                <div className="space-y-3">
                  {columnIssues.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-500">
                        {totalIssues === 0
                          ? "No issues found"
                          : "Drag issues here"}
                      </p>
                    </div>
                  ) : (
                    columnIssues.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        onDragStart={(e) => handleDragStart(issue.id, column.status)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Data Message */}
      {totalIssues === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-lg text-slate-600">
            No issues found for this contract
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Upload data or select a different contract to see issues
          </p>
        </div>
      )}
    </div>
  )
}
