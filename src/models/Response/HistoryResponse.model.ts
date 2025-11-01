import type { IBaseSuccessResponse } from "./Response.model"

export interface IGlucoseChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension: number
  }[]
  summary: {
    average: number
    min: number
    max: number
    count: number
  }
}

export interface IGlucoseHistoryItem {
  id: string
  value: number
  period: string
  note: string | null
  recordedAt: string
  status: 'LOW' | 'NORMAL' | 'HIGH'
}

export interface IGlucoseHistoryList {
  items: IGlucoseHistoryItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface IHealthSummary {
  totalRecords: number
  averageGlucose: number
  lastRecordDate: string | null
  weeklyAverage: number
  monthlyAverage: number
  trends: {
    thisWeek: number
    lastWeek: number
    thisMonth: number
    lastMonth: number
  }
}

export interface IGetGlucoseChartResponse extends IBaseSuccessResponse<IGlucoseChartData> {}
export interface IGetGlucoseHistoryResponse extends IBaseSuccessResponse<IGlucoseHistoryList> {}
export interface IGetHealthSummaryResponse extends IBaseSuccessResponse<IHealthSummary> {}