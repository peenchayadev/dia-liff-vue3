import type { 
  IGetAppointmentsResponse, 
  IGetAppointmentResponse,
  IGetAppointmentSummaryResponse 
} from '@/models/Response/AppointmentResponse.model'
import HttpRequest from '../HttpRequest'

export interface IAppointmentProvider {
  getAppointments(): Promise<IGetAppointmentsResponse>
  getAppointment(id: number): Promise<IGetAppointmentResponse>
  getAppointmentSummary(): Promise<IGetAppointmentSummaryResponse>
  deleteAppointment(id: number): Promise<any>
}

class AppointmentProvider extends HttpRequest implements IAppointmentProvider {
  private urlPrefix: string = '/appointments'

  public async getAppointments(): Promise<IGetAppointmentsResponse> {
    console.log('📅 Fetching appointments...')
    const response = await this.get(`${this.urlPrefix}`)
    return response
  }

  public async getAppointment(id: number): Promise<IGetAppointmentResponse> {
    console.log(`📅 Fetching appointment ${id}...`)
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getAppointmentSummary(): Promise<IGetAppointmentSummaryResponse> {
    console.log('📊 Fetching appointment summary...')
    const response = await this.get(`${this.urlPrefix}/summary`)
    return response
  }

  public async deleteAppointment(id: number): Promise<any> {
    console.log(`🗑️ Deleting appointment ${id}...`)
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default AppointmentProvider