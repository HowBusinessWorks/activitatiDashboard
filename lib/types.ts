export type Activity = {
  id: string
  activity_id: number
  contract_id: string
  type: "INSPECTION" | "CONSTRUCTION" | "INTERVENTION"
  verified: boolean
  contractors: string | null
  inspection_type: string | null
  activity_date: string
  report_date: string
  stage_id: number | null
  stage_name: string | null
  task_id: number | null
  task_name: string | null
  objective_id: number | null
  objective_name: string | null
  added_by_id: number | null
  added_by_name: string | null
  raw_data_json: Record<string, any> | null
  created_at: string
  updated_at: string
}

export type Contract = {
  id: string
  contract_id: number
  contract_name: string
  created_at: string
  updated_at: string
}

export type Issue = {
  id: string
  activity_id: string
  contract_id: string
  title: string
  inspection_category: string
  status: "identified" | "in_progress" | "done"
  contractor_assigned: string | null
  notes: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  metadata: Record<string, any> | null
}

export type CSVRow = {
  activityId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  type: string
  verified: string
  contractors: string
  data: string
  date: string
  reportDate: string
  activityGroupId: string | null
  stageId: string
  stageName: string
  taskId: string
  taskName: string
  objectiveId: string
  objectiveName: string
  contractId: string
  contractName: string
  addedById: string
  addedByName: string
}

export type Objective = {
  id: number
  name: string
}

export type InspectionRecord = {
  activity_id: number
  objective_id: number
  objective_name: string
  inspection_type: string
  activity_date: string
  contractors: string | null
  verified: boolean
  raw_data_json: Record<string, any> | null
  added_by_name?: string | null
}

export type InspectionGridData = {
  objectives: Objective[]
  inspectionTypes: string[]
  records: InspectionRecord[]
}
