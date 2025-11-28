import { InspectionRecord } from "@/lib/types"
import { X } from "lucide-react"

interface InspectionDetailModalProps {
  isOpen: boolean
  objective_name: string
  inspection_type: string
  records: InspectionRecord[]
  onClose: () => void
}

export default function InspectionDetailModal({
  isOpen,
  objective_name,
  inspection_type,
  records,
  onClose,
}: InspectionDetailModalProps) {
  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Detalii Inspecție
              </h2>
              <p className="text-slate-600 mt-1">Inspection Details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Summary Info */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-600">Obiectiv</p>
                <p className="text-lg text-slate-900">{objective_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Tip Inspecție
                </p>
                <p className="text-lg text-slate-900">{inspection_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Inspectii Efectuate
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  {records.length}
                </p>
              </div>
            </div>

            {/* Records List */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Inregistrari Inspectsii
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {records.length === 0 ? (
                  <p className="text-slate-600 py-4">
                    Nu sunt inregistrari pentru aceasta perioada.
                  </p>
                ) : (
                  records.map((record, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-slate-900">
                            {formatDate(record.activity_date)}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatTime(record.activity_date)}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            record.verified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.verified ? "Verificată" : "Neverificată"}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Activity ID:</span>{" "}
                          {record.activity_id}
                        </p>
                      </div>

                      {record.contractors && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Contractor:</span>{" "}
                            {record.contractors}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Inchide
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
