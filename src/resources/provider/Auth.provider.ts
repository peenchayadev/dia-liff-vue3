import type { IAuthRequest } from '@/models/Request/AuthReq.model'
import HttpRequest from '../HttpRequest'
import type { IGetLoginLiffResponse } from '@/models/Response/AuthRes.model'

export interface IAuthProvider {
	authLiff(query: IAuthRequest): Promise<IGetLoginLiffResponse>
}

class AuthProvider extends HttpRequest implements IAuthProvider {
	private urlPrefix: string = '/auth'

	public async authLiff(query: IAuthRequest): Promise<IGetLoginLiffResponse> {
		const response = await this.post(`${this.urlPrefix}/line-verify`, query)
		return response
	}
}

export default AuthProvider
