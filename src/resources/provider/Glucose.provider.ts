import type { 
	IGetGlucoseSummaryResponse, 
	IGetGlucoseTodayListResponse 
} from '@/models/Response/GlucoseResponse.model'
import HttpRequest from '../HttpRequest'

export interface IGlucoseProvider {
	getTodaySummary(): Promise<IGetGlucoseSummaryResponse>
	getTodayList(): Promise<IGetGlucoseTodayListResponse>
}

class GlucoseProvider extends HttpRequest implements IGlucoseProvider {
	private urlPrefix: string = '/glucose'

	public async getTodaySummary(): Promise<IGetGlucoseSummaryResponse> {
		return this.get(`${this.urlPrefix}/summary/today`)
	}

		public async getTodayList (): Promise<IGetGlucoseTodayListResponse> {
		return this.get(`${this.urlPrefix}/today`)
	}
}

export default GlucoseProvider
