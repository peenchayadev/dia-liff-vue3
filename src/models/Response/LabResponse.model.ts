import type { IBaseSuccessResponse } from "./Response.model"

export interface ILabResult {
  id: string
  type: string
  value: number
  unit: string
  referenceRange: string | null
  testDate: string
  note: string | null
  media: {
    id: number
    url: string
  }[]
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL'
}

export interface ILabResultsList {
  items: ILabResult[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  types: string[]
}

export interface ILabChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension: number
  }[]
  referenceRange?: {
    min: number
    max: number
  }
}

export interface IGetLabResultsResponse extends IBaseSuccessResponse<ILabResultsList> {}
export interface IGetLabResultResponse extends IBaseSuccessResponse<ILabResult> {}
export interface IGetLabChartResponse extends IBaseSuccessResponse<ILabChartData> {}