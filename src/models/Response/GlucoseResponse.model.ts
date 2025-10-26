import type { GlucoseDailyPeriodsEnum } from "../Glucose/GlucoseDailyPeriods.enum"
import type { GlucoseStatusEnum } from "../Glucose/GlucoseStatus.enum"
import type { IBaseSuccessResponse } from "./Response.model"

export interface IGlucoseSummary {
	average: number | null
	maximum: number | null
	minimum: number | null
  date: string
  measurementCount: number | null
  latestLevel: IGlucoseLatestLevel
}

export interface IGlucoseToday {
  id: string
  note: string | null
  period: GlucoseDailyPeriodsEnum
  recordedAt: string
  status: GlucoseStatusEnum
  value: number
}

export interface IGlucoseLatestLevel {
  recordedAt: string
  status: GlucoseStatusEnum
  value: number
}

export interface IGetGlucoseSummaryResponse extends IBaseSuccessResponse<IGlucoseSummary>{}
export interface IGetGlucoseTodayListResponse extends IBaseSuccessResponse<IGlucoseToday[]>{}
