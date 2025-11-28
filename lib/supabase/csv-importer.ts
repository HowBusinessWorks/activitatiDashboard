import Papa from "papaparse"
import { supabase } from "./client"
import { parseIdentifiedIssues, extractInspectionCategory } from "./issue-parser"
import { CSVRow, Contract, Activity, Issue } from "@/lib/types"

export async function importActivitiesFromCSV(
  csvContent: string
): Promise<{
  success: boolean
  message: string
  stats: {
    contractsUpserted: number
    activitiesUpserted: number
    issuesCreated: number
  }
}> {
  try {
    // Parse CSV
    const parsed = Papa.parse<CSVRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    })

    if (!parsed.data || parsed.data.length === 0) {
      return {
        success: false,
        message: "No data found in CSV",
        stats: { contractsUpserted: 0, activitiesUpserted: 0, issuesCreated: 0 },
      }
    }

    // Track stats
    const stats = {
      contractsUpserted: 0,
      activitiesUpserted: 0,
      issuesCreated: 0,
    }

    // Process each row
    for (const row of parsed.data) {
      // Skip if no contract ID or name
      if (!row.contractId || !row.contractName) continue

      try {
        // 1. Upsert Contract
        const { data: contractData, error: contractError } = await supabase
          .from("contracts")
          .upsert(
            {
              contract_id: parseInt(row.contractId, 10),
              contract_name: row.contractName,
            },
            {
              onConflict: "contract_id",
            }
          )
          .select()
          .single()

        if (contractError) throw contractError
        if (contractData) {
          stats.contractsUpserted++
        }

        const contractUUID = contractData?.id

        // 2. Parse JSON data if it exists
        let parsedData: Record<string, any> = {}
        try {
          if (row.data && row.data !== "null") {
            parsedData = JSON.parse(row.data)
          }
        } catch {
          // Keep empty if JSON parse fails
        }

        // Extract inspection category
        const inspectionCategory = extractInspectionCategory(parsedData)

        // 3. Upsert Activity
        const { data: activityData, error: activityError } = await supabase
          .from("activities")
          .upsert(
            {
              activity_id: parseInt(row.activityId, 10),
              contract_id: contractUUID,
              type: (row.type as "INSPECTION" | "CONSTRUCTION" | "INTERVENTION") || "INSPECTION",
              verified: row.verified === "TRUE" || row.verified === "true",
              contractors: row.contractors || null,
              inspection_type: inspectionCategory || null,
              activity_date: row.date || null,
              report_date: row.reportDate || null,
              stage_id: row.stageId ? parseInt(row.stageId, 10) : null,
              stage_name: row.stageName || null,
              task_id: row.taskId ? parseInt(row.taskId, 10) : null,
              task_name: row.taskName || null,
              objective_id: row.objectiveId ? parseInt(row.objectiveId, 10) : null,
              objective_name: row.objectiveName || null,
              added_by_id: row.addedById ? parseInt(row.addedById, 10) : null,
              added_by_name: row.addedByName || null,
              raw_data_json: parsedData || null,
            },
            {
              onConflict: "activity_id",
            }
          )
          .select()
          .single()

        if (activityError) throw activityError
        if (activityData) {
          stats.activitiesUpserted++
        }

        const activityUUID = activityData?.id

        // 4. Extract and create issues from JSON data
        if (row.type === "INSPECTION") {
          // Only create issues if fixedIssues is false (not fixed on the spot)
          const fixedIssues = parsedData?.fixedIssues || false
          const identifiedIssuesText = parsedData?.identifiedIssues || null

          if (!fixedIssues && identifiedIssuesText && identifiedIssuesText !== false) {
            // Parse the date properly - extract just the date part without timezone for accurate storage
            let activityDateForIssue = row.date || null
            if (activityDateForIssue) {
              // Extract just the date-time part before the timezone info
              // Input: "2025-10-01 00:00:00+03" -> "2025-10-01 00:00:00"
              const dateMatch = activityDateForIssue.match(/^(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/)
              if (dateMatch) {
                activityDateForIssue = dateMatch[1]
              }
            }

            const issues = parseIdentifiedIssues(
              identifiedIssuesText,
              inspectionCategory,
              activityUUID,
              contractUUID,
              row.addedByName || null,
              activityDateForIssue
            )

            if (issues.length > 0) {
              // Delete existing issues for this activity to avoid duplicates
              await supabase
                .from("issues")
                .delete()
                .eq("activity_id", activityUUID)

              // Insert new issues
              const { error: issuesError } = await supabase
                .from("issues")
                .insert(issues)

              if (issuesError) throw issuesError
              stats.issuesCreated += issues.length
            }
          }
        }
      } catch (rowError) {
        console.error(`Error processing row ${row.activityId}:`, rowError)
        // Continue processing other rows
      }
    }

    return {
      success: true,
      message: `Import completed successfully`,
      stats,
    }
  } catch (error) {
    console.error("CSV import error:", error)
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      stats: { contractsUpserted: 0, activitiesUpserted: 0, issuesCreated: 0 },
    }
  }
}
