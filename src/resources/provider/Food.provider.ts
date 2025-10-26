import type { IFoodAnalysis, IFoodSummary } from '@/models/Response/FoodResponse.model'
import HttpRequest from '../HttpRequest';

export interface IFoodProvider {
  getFoodAnalyses(): Promise<{ success: boolean; data: IFoodAnalysis[] }>
  getFoodSummary(): Promise<{ success: boolean; data: IFoodSummary }>
}

export default class FoodProvider extends HttpRequest implements IFoodProvider {
  async getFoodAnalyses(): Promise<{ success: boolean; data: IFoodAnalysis[] }> {
    const response = await this.get('/food')
    return response
  }

  async getFoodSummary(): Promise<{ success: boolean; data: IFoodSummary }> {
    const response = await this.get('/food/summary')
    return response
  }
}