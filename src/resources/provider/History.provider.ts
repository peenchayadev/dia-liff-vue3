import type { 
  IGetGlucoseChartResponse,
  IGetGlucoseHistoryResponse,
  IGetHealthSummaryResponse
} from '@/models/Response/HistoryResponse.model'
import HttpRequest from '../HttpRequest'

export interface IHistoryProvider {
  getGlucoseChart(period: 'today' | 'yesterday' | 'week' | 'month'): Promise<IGetGlucoseChartResponse>
  getGlucoseHistory(
    page?: number, 
    limit?: number, 
    period?: 'today' | 'yesterday' | 'week' | 'month'
  ): Promise<IGetGlucoseHistoryResponse>
  getHealthSummary(): Promise<IGetHealthSummaryResponse>
}

class HistoryProvider extends HttpRequest implements IHistoryProvider {
  private urlPrefix: string = '/history'

  public async getGlucoseChart(
    period: 'today' | 'yesterday' | 'week' | 'month'
  ): Promise<IGetGlucoseChartResponse> {
    const response = await this.get(`${this.urlPrefix}/glucose/chart`, { period })
    return response
  }

  public async getGlucoseHistory(
    page: number = 1,
    limit: number = 20,
    period?: 'today' | 'yesterday' | 'week' | 'month'
  ): Promise<IGetGlucoseHistoryResponse> {
    const params: any = { page, limit }
    if (period) params.period = period
    
    const response = await this.get(`${this.urlPrefix}/glucose/list`, params)
    return response
  }

  public async getHealthSummary(): Promise<IGetHealthSummaryResponse> {
    const response = await this.get(`${this.urlPrefix}/summary`)
    return response
  }
}

export default HistoryProvider