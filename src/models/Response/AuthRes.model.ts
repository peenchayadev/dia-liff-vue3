import type { IBaseSuccessResponse } from './Response.model'

export interface IAuthLiff {
	jwt: string
	user: IUserResponse
}

export interface IUserResponse {
	lineUserId: string
	displayName: string
	pictureUrl: string
}

export interface IGetLoginLiffResponse extends IBaseSuccessResponse<IAuthLiff> {}
