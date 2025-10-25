import type { IPagination } from "../Global.model"


export interface IBaseSuccessResponse<T = any> {
  success?: boolean
  message?: string
  data: T
}

export interface IBasePaginationResponse<T = any> extends IBaseSuccessResponse<T[]>, IPagination {}

export interface IErrorResponse {
  code: number
  message: string
}
export type TErrorResponse = IErrorResponse | string | any
