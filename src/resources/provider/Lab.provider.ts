import type { 
  IGetLabResultsResponse,
  IGetLabResultResponse,
  IGetLabChartResponse
} from '@/models/Response/LabResponse.model'
import HttpRequest from '../HttpRequest'

export interface ILabProvider {
  getLabResults(page?: number, limit?: number, type?: string): Promise<IGetLabResultsResponse>
  getLabResult(id: string): Promise<IGetLabResultResponse>
  getLabChart(type: string, period?: number): Promise<IGetLabChartResponse>
  deleteLabResult(id: string): Promise<any>
}

class LabProvider extends HttpRequest implements ILabProvider {
  private urlPrefix: string = '/lab'

  public async getLabResults(
    page: number = 1,
    limit: number = 10,
    type?: string
  ): Promise<IGetLabResultsResponse> {
    const params: any = { page, limit }
    if (type) params.type = type
    
    const response = await this.get(`${this.urlPrefix}/results`, params)
    return response
  }

  public async getLabResult(id: string): Promise<IGetLabResultResponse> {
    const response = await this.get(`${this.urlPrefix}/results/${id}`)
    return response
  }

  public async getLabChart(
    type: string, 
    period: number = 6
  ): Promise<IGetLabChartResponse> {
    const response = await this.get(`${this.urlPrefix}/chart/${type}`, { period })
    return response
  }

  public async deleteLabResult(id: string): Promise<any> {
    const response = await this.delete(`${this.urlPrefix}/results/${id}`)
    return response
  }
}

export default LabProvider