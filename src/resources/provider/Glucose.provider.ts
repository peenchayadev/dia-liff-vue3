import type { 
	IGetGlucoseSummaryResponse, 
	IGetGlucoseTodayListResponse 
} from '@/models/Response/GlucoseResponse.model'
import HttpRequest from '../HttpRequest'

export interface IGlucoseProvider {
	getTodaySummary(): Promise<IGetGlucoseSummaryResponse>
	getTodayList(): Promise<IGetGlucoseTodayListResponse>
	deleteTodayRecord (
		id: string
	): Promise<IGetGlucoseTodayListResponse>
	updateTodayRecord (
		id: string,
		data: IUpdateGlucoseRequest
	): Promise<IGetGlucoseTodayListResponse>
}

export interface IUpdateGlucoseRequest {
	value?: number
	period?: string
	note?: string
}

class GlucoseProvider extends HttpRequest implements IGlucoseProvider {
	private urlPrefix: string = '/glucose'

	public async getTodaySummary(): Promise<IGetGlucoseSummaryResponse> {
		const response = await this.get(`${this.urlPrefix}/summary/today`)
		return response
	}

	public async getTodayList (): Promise<IGetGlucoseTodayListResponse> {
		const response = await this.get(`${this.urlPrefix}/today`)
		return response
	}

	public async deleteTodayRecord (
		id: string
	): Promise<IGetGlucoseTodayListResponse> {
		const response = await this.delete(`${this.urlPrefix}/${id}`)
		return response
	}

	public async updateTodayRecord (
		id: string,
		data: IUpdateGlucoseRequest
	): Promise<IGetGlucoseTodayListResponse> {
		const response = await this.put(`${this.urlPrefix}/${id}`, data)
		return response
	}
}

export default GlucoseProvider
