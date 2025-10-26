import type { IBaseSuccessResponse } from "./Response.model"

export enum AppointmentStatusEnum {
  UPCOMING = 'UPCOMING',
  TODAY = 'TODAY',
  PAST = 'PAST'
}

export interface IAppointmentMedia {
  id: number
  url: string
}

export interface IAppointment {
  id: number
  appointmentDate: string | null
  startTime: string | null
  endTime: string | null
  doctorName: string | null
  hospitalName: string | null
  fullName: string | null
  age: string | null
  reason: string | null
  details: string | null
  createdAt: string
  status: AppointmentStatusEnum
  media: IAppointmentMedia[]
}

export interface IAppointmentSummary {
  total: number
  upcoming: number
  today: number
  past: number
}

export interface IGetAppointmentsResponse extends IBaseSuccessResponse<IAppointment[]> {}
export interface IGetAppointmentResponse extends IBaseSuccessResponse<IAppointment> {}
export interface IGetAppointmentSummaryResponse extends IBaseSuccessResponse<IAppointmentSummary> {}