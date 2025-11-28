import { Issue } from "@/lib/types"
import { GripVertical, X } from "lucide-react"

interface IssueCardProps {
  issue: Issue
  onDragStart: (e: React.DragEvent, issueId: string) => void
  onDelete?: (issueId: string) => void
}

export default function IssueCard({
  issue,
  onDragStart,
  onDelete,
}: IssueCardProps) {
  // Format date - handle timezone-aware strings
  const createdDate = (() => {
    try {
      // Parse the date string and ensure it's treated correctly
      const dateStr = issue.created_at
      const date = new Date(dateStr)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date"
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      })
    } catch {
      return "Invalid date"
    }
  })()

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, issue.id)}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 cursor-grab active:cursor-grabbing transition group"
    >
      {/* Drag Handle & Delete */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <GripVertical
          size={16}
          className="text-slate-400 group-hover:text-slate-600 flex-shrink-0 mt-0.5"
        />
        {onDelete && (
          <button
            onClick={() => onDelete(issue.id)}
            className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
            title="Delete issue"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-900 text-sm line-clamp-3 mb-3">
        {issue.title}
      </h3>

      {/* Category Badge */}
      <div className="mb-3">
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
          {issue.inspection_category}
        </span>
      </div>

      {/* Metadata */}
      <div className="space-y-1 text-xs text-slate-600 mb-3">
        {issue.created_by && (
          <p className="truncate">
            <span className="font-medium">By:</span> {issue.created_by}
          </p>
        )}
        {issue.contractor_assigned && (
          <p className="truncate">
            <span className="font-medium">Contractor:</span>{" "}
            {issue.contractor_assigned}
          </p>
        )}
        <p>
          <span className="font-medium">Created:</span> {createdDate}
        </p>
      </div>

      {/* Notes */}
      {issue.notes && (
        <div className="bg-yellow-50 p-2 rounded text-xs text-slate-700 mb-3 border border-yellow-200">
          <p className="font-medium mb-1">Notes:</p>
          <p className="line-clamp-2">{issue.notes}</p>
        </div>
      )}

      {/* Status Indicator */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {issue.status.replace("_", " ")}
        </span>
      </div>
    </div>
  )
}
