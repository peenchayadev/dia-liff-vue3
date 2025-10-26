export enum GlucoseDailyPeriodsEnum {
  MORNING_BEFORE = 'MORNING_BEFORE',
  MORNING_AFTER = 'MORNING_AFTER',
  LUNCH_BEFORE = 'LUNCH_BEFORE',
  LUNCH_AFTER = 'LUNCH_AFTER',
  DINNER_BEFORE = 'DINNER_BEFORE',
  DINNER_AFTER = 'DINNER_AFTER',
  BEDTIME = 'BEDTIME'
}

export type GlucoseDailyPeriodsType = keyof typeof GlucoseDailyPeriodsEnum

export const GlucoseDailyPeriodsMap: Record<GlucoseDailyPeriodsType, string> = {
  MORNING_BEFORE: 'ก่อนอาหารเช้า',
  MORNING_AFTER: 'หลังอาหารเช้า',
  LUNCH_BEFORE: 'ก่อนอาหารกลางวัน',
  LUNCH_AFTER: 'หลังอาหารกลางวัน',
  DINNER_BEFORE: 'ก่อนอาหารเย็น',
  DINNER_AFTER: 'หลังอาหารเย็น',
  BEDTIME: 'ก่อนนอน'
}

export function formatGlucoseDailyPeriods(period: GlucoseDailyPeriodsType): string {
  return GlucoseDailyPeriodsMap[period] || period
}