export enum GlucoseStatusEnum {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  LOW = 'LOW'
}

export type GlucoseStatusType = keyof typeof GlucoseStatusEnum

export const GlucoseStatusMap: Record<GlucoseStatusType, string> = {
  NORMAL: 'ปกติ',
  HIGH: 'สูง',
  LOW: 'ต่ำ'
}

export function formatGlucoseStatus(status: GlucoseStatusType): string {
  return GlucoseStatusMap[status] || status
}