import { supabase } from "./client"
import { InspectionRecord, InspectionGridData, Objective } from "@/lib/types"

/**
 * Fetches inspection data for a contract filtered by date range
 * Returns objectives, inspection types, and all inspection records
 */
export async function fetchInspectionGridData(
  contractId: string,
  startDate: string,
  endDate: string
): Promise<InspectionGridData> {
  try {
    // Query only INSPECTION type activities for the contract within the date range
    const { data, error } = await supabase
      .from("activities")
      .select(
        "activity_id, objective_id, objective_name, inspection_type, activity_date, contractors, verified, raw_data_json"
      )
      .eq("contract_id", contractId)
      .eq("type", "INSPECTION")
      .not("objective_id", "is", null)
      .not("objective_name", "is", null)
      .not("inspection_type", "is", null)
      .gte("activity_date", startDate)
      .lte("activity_date", endDate)
      .order("activity_date", { ascending: false })

    if (error) throw error

    const records = (data || []) as InspectionRecord[]

    // Extract unique objectives
    const objectivesMap = new Map<number, string>()
    records.forEach((record) => {
      if (record.objective_id && record.objective_name) {
        objectivesMap.set(record.objective_id, record.objective_name)
      }
    })

    const objectives: Objective[] = Array.from(objectivesMap).map(([id, name]) => ({
      id,
      name,
    }))

    // Extract unique inspection types
    const inspectionTypesSet = new Set<string>()
    records.forEach((record) => {
      if (record.inspection_type) {
        inspectionTypesSet.add(record.inspection_type)
      }
    })

    const inspectionTypes = Array.from(inspectionTypesSet).sort()

    return {
      objectives: objectives.sort((a, b) => a.id - b.id),
      inspectionTypes,
      records,
    }
  } catch (error) {
    console.error("Error fetching inspection grid data:", error)
    throw error
  }
}

/**
 * Fetches inspection records for a specific objective and inspection type
 * Used when user clicks on a cell to see details
 */
export async function fetchInspectionDetails(
  contractId: string,
  objectiveId: number,
  inspectionType: string,
  startDate: string,
  endDate: string
) {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select(
        "activity_id, objective_id, objective_name, inspection_type, activity_date, contractors, verified, raw_data_json, added_by_name"
      )
      .eq("contract_id", contractId)
      .eq("type", "INSPECTION")
      .eq("objective_id", objectiveId)
      .eq("inspection_type", inspectionType)
      .gte("activity_date", startDate)
      .lte("activity_date", endDate)
      .order("activity_date", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching inspection details:", error)
    throw error
  }
}

/**
 * Checks if an inspection was done for a specific objective and type
 * Returns true if at least one record exists
 */
export function hasInspection(
  records: InspectionRecord[],
  objectiveId: number,
  inspectionType: string
): boolean {
  return records.some(
    (record) =>
      record.objective_id === objectiveId &&
      record.inspection_type === inspectionType
  )
}

/**
 * Gets count of inspections for a specific objective and type
 */
export function getInspectionCount(
  records: InspectionRecord[],
  objectiveId: number,
  inspectionType: string
): number {
  return records.filter(
    (record) =>
      record.objective_id === objectiveId &&
      record.inspection_type === inspectionType
  ).length
}

/**
 * Gets the most recent inspection date for a specific objective and type
 */
export function getMostRecentDate(
  records: InspectionRecord[],
  objectiveId: number,
  inspectionType: string
): string | null {
  const filteredRecords = records.filter(
    (record) =>
      record.objective_id === objectiveId &&
      record.inspection_type === inspectionType
  )

  if (filteredRecords.length === 0) return null

  // Records are already sorted by activity_date DESC
  return filteredRecords[0].activity_date
}
