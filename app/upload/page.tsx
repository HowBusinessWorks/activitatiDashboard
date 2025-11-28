"use client"

import { useState } from "react"
import Link from "next/link"

type UploadStatus = "idle" | "uploading" | "success" | "error"

export default function UploadPage() {
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [message, setMessage] = useState("")
  const [stats, setStats] = useState({
    contractsUpserted: 0,
    activitiesUpserted: 0,
    issuesCreated: 0,
  })
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      setMessage("Please select a file")
      setStatus("error")
      return
    }

    setStatus("uploading")
    setMessage("Processing CSV...")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload/csv", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
        setStats(data.stats)
        setFile(null)
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setStatus("error")
        setMessage(data.message || "Upload failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      )
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Upload Activities CSV
          </h1>
          <p className="text-slate-600">
            Import construction activity data from CSV file
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Input */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-input"
                disabled={status === "uploading"}
              />
              <label
                htmlFor="csv-input"
                className="cursor-pointer block"
              >
                <div className="text-5xl mb-2">📁</div>
                <p className="text-lg font-semibold text-slate-700 mb-1">
                  {file ? file.name : "Click to select CSV file"}
                </p>
                <p className="text-sm text-slate-500">
                  or drag and drop
                </p>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || status === "uploading"}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {status === "uploading" ? "Processing..." : "Upload and Import"}
            </button>
          </form>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-3">{message}</p>
              <div className="space-y-1 text-sm text-green-700">
                <p>✓ Contracts upserted: {stats.contractsUpserted}</p>
                <p>✓ Activities upserted: {stats.activitiesUpserted}</p>
                <p>✓ Issues created: {stats.issuesCreated}</p>
              </div>
              <Link
                href="/dashboard"
                className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                Go to Dashboard →
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">❌ Error</p>
              <p className="text-red-700 mt-1">{message}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Instructions
          </h2>
          <ol className="space-y-2 text-slate-700 list-decimal list-inside">
            <li>Download the activities export as CSV file</li>
            <li>Click the upload area and select the CSV file</li>
            <li>Click "Upload and Import"</li>
            <li>Wait for processing to complete</li>
            <li>Proceed to the dashboard to view and manage issues</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
