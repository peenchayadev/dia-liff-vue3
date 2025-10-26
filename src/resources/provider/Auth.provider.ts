import type { IAuthRequest } from '@/models/Request/AuthReq.model'
import HttpRequest from '../HttpRequest'
import type { IGetLoginLiffResponse } from '@/models/Response/AuthRes.model'

export interface IAuthProvider {
	authLiff(query: IAuthRequest): Promise<IGetLoginLiffResponse>
	refreshToken(lineIdToken: string): Promise<IGetLoginLiffResponse>
	checkToken(lineIdToken: string): Promise<any>
}

class AuthProvider extends HttpRequest implements IAuthProvider {
	private urlPrefix: string = '/auth'

	public async authLiff(query: IAuthRequest): Promise<IGetLoginLiffResponse> {
		console.log(`🔍 Sending auth request for LINE user: ${query.lineUserId}`)
		const response = await this.post(`${this.urlPrefix}/line-verify`, query)
		return response
	}

	public async refreshToken(lineIdToken: string): Promise<IGetLoginLiffResponse> {
		const response = await this.post(`${this.urlPrefix}/refresh-token`, { lineIdToken })
		return response
	}

	public async checkToken(lineIdToken: string): Promise<any> {
		const response = await this.post(`${this.urlPrefix}/check-token`, { lineIdToken })
		return response
	}
}

export default AuthProvider
