"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    contractsUpserted: 0,
    activitiesUpserted: 0,
    issuesCreated: 0,
  })

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("adminAuth")
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Call API to verify password
    const verifyPassword = async () => {
      try {
        const response = await fetch("/api/admin/verify-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        })

        const data = await response.json()

        if (data.valid) {
          setPassword("")
          sessionStorage.setItem("adminAuth", "true")
          setIsAuthenticated(true)
        } else {
          setError("Invalid password")
          setPassword("")
        }
      } catch (err) {
        setError("Failed to verify password")
        setPassword("")
      }
    }

    verifyPassword()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadMessage("")
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setUploadMessage("Please select a file")
      setUploadStatus("error")
      return
    }

    setUploadStatus("uploading")
    setUploadMessage("Processing CSV...")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload/csv", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadStatus("success")
        setUploadMessage(data.message)
        setStats(data.stats)
        setFile(null)
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setUploadStatus("error")
        setUploadMessage(data.message || "Upload failed")
      }
    } catch (error) {
      setUploadStatus("error")
      setUploadMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      )
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Panou Administrator</h1>
            <p className="text-slate-600 mb-6">Introduceți parola pentru a accesa</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolă"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Conectare
              </button>

              <Link
                href="/dashboard"
                className="block text-center text-blue-600 hover:text-blue-700 text-sm mt-4"
              >
                Înapoi la Tablă Kanban
              </Link>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Panou Administrator
              </h1>
              <p className="text-slate-600">Încărcați CSV Activități</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition"
            >
              Tablă Kanban
            </Link>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Input */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-input"
                disabled={uploadStatus === "uploading"}
              />
              <label htmlFor="csv-input" className="cursor-pointer block">
                <div className="text-5xl mb-2">📁</div>
                <p className="text-lg font-semibold text-slate-700 mb-1">
                  {file ? file.name : "Faceți clic pentru a selecta fișierul CSV"}
                </p>
                <p className="text-sm text-slate-500">sau glisați și plasați</p>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || uploadStatus === "uploading"}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {uploadStatus === "uploading" ? "Se procesează..." : "Încărcați și Importați"}
            </button>
          </form>

          {/* Status Messages */}
          {uploadStatus === "success" && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-3">{uploadMessage}</p>
              <div className="space-y-1 text-sm text-green-700">
                <p>✓ Contracte upsertate: {stats.contractsUpserted}</p>
                <p>✓ Activități upsertate: {stats.activitiesUpserted}</p>
                <p>✓ Probleme create: {stats.issuesCreated}</p>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">❌ Eroare</p>
              <p className="text-red-700 mt-1">{uploadMessage}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Instrucțiuni
          </h2>
          <ol className="space-y-2 text-slate-700 list-decimal list-inside">
            <li>Descărcați exportul activităților ca fișier CSV</li>
            <li>Faceți clic pe aria de încărcare și selectați fișierul CSV</li>
            <li>Faceți clic pe "Încărcați și Importați"</li>
            <li>Așteptați până când procesarea se termină</li>
            <li>Verificați tablă Kanban pentru a verifica datele importate</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
