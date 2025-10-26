export interface IFoodAnalysis {
  id: number
  userId: number
  foodName: string | null
  carbsGram: number | null
  sugarGram: number | null
  advice: string | null
  media: IFoodMedia[]
}

export interface IFoodMedia {
  id: number
  url: string
  foodAnalysisId: number | null
}

export interface IFoodSummary {
  total: number
  today: number
  thisWeek: number
}