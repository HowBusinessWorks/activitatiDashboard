import { NextRequest, NextResponse } from "next/server"
import { importActivitiesFromCSV } from "@/lib/supabase/csv-importer"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { success: false, message: "File must be a CSV" },
        { status: 400 }
      )
    }

    // Read file content
    const csvContent = await file.text()

    // Import the CSV
    const result = await importActivitiesFromCSV(csvContent)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    )
  }
}
