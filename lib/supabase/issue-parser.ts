import { Issue } from "@/lib/types"

export function parseIdentifiedIssues(
  identifiedIssuesText: string | null | false,
  inspectionCategory: string,
  activityId: string,
  contractId: string,
  createdBy: string | null,
  activityDate?: string | null
): Omit<Issue, "id" | "updated_at">[] {
  if (!identifiedIssuesText) {
    return []
  }

  // Convert to string and clean up
  const text = String(identifiedIssuesText).trim()
  if (!text || text === "false") {
    return []
  }

  // Treat the entire identified issues text as a single issue card
  // Don't split by delimiters - keep the full text together
  return [
    {
      activity_id: activityId,
      contract_id: contractId,
      title: text,
      inspection_category: inspectionCategory.toLowerCase(),
      status: "identified" as const,
      contractor_assigned: null,
      notes: null,
      created_by: createdBy,
      created_at: activityDate || new Date().toISOString(),
      metadata: null,
    },
  ]
}

// Helper to extract inspection category from JSON data
export function extractInspectionCategory(
  jsonData: Record<string, any>
): string {
  try {
    // Navigate through the nested structure to find inspection type
    if (jsonData?.list && Array.isArray(jsonData.list)) {
      const inspectionList = jsonData.list[0]
      if (inspectionList?.name) {
        return inspectionList.name
      }
      if (inspectionList?.list && Array.isArray(inspectionList.list)) {
        const subCategory = inspectionList.list[0]
        if (subCategory?.name) {
          return subCategory.name
        }
      }
    }
    return "general"
  } catch {
    return "general"
  }
}
