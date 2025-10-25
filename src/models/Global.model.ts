import type { IRouteRedirect } from '@/router'

type TPaginationLimit = 20 | 50 | 100

export interface IPaginationRequest {
  page: number
  limit: TPaginationLimit | 9999
}

export interface IPagination extends IPaginationRequest {
  totalPage: number
  count: number
}

export interface IMenu {
	name: string
	to: IRouteRedirect
	icon: string
}

export interface IBaseOptions<T = string | number> {
  title: string
  value: T | null
}

export interface IBaseFormatStatusStyle {
  icon?: string
  color?: string
  textColor?: string
}
export interface IBaseFormatStatus extends IBaseFormatStatusStyle {
  text: string
}

export interface IBaseLabelValue {
  label?: string
  value?: string
  newLine?: boolean
  group?: IBaseLabelValue[]
}

export interface IEmitWithCallback<T = any> {
  data: T
  callback: () => void
  files?: File[]
}

export interface IDate {
  day?: string
  month?: string
  year: string
}

export interface IAction {
  actionName: string
  actionValue?: any
}
