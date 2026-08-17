import { RED_REASONS, YELLOW_REASONS } from './alertCriteria'
import { STORES } from './stores'

export type AlertSeverity = 'red' | 'yellow'

export interface SiteAlert {
  storeId: string
  severity: AlertSeverity
  reason: string
  currentCondition: string
  flaggedSince: string
}

/**
 * Portfolio status mock — moderate trouble set with diverse red/yellow causes.
 * Each site is Diesel + Jockey or Electric + Jockey (never both mains).
 * Red/yellow impairment examples match that site's main pump type.
 */
export const MOCK_SITE_ALERTS: SiteAlert[] = [
  // --- RED ---
  {
    storeId: '17321',
    severity: 'red',
    reason: RED_REASONS.impairmentOver10Hours,
    currentCondition: 'Engine Failed to Start — active 14 hours',
    flaggedSince: '2026-07-07T22:15:00',
  },
  {
    storeId: '18049',
    severity: 'red',
    reason: RED_REASONS.impairmentOver10Hours,
    currentCondition: 'Phase Failure — active 11 hours',
    flaggedSince: '2026-07-08T01:00:00',
  },
  {
    storeId: '19230',
    severity: 'red',
    reason: RED_REASONS.impairmentOver10Hours,
    currentCondition: 'Main Switch in Off — active 16 hours',
    flaggedSince: '2026-07-07T18:20:00',
  },
  {
    storeId: '17330',
    severity: 'red',
    reason: RED_REASONS.sub50PumpRoomTemp,
    currentCondition: 'Pump room temp 46°F',
    flaggedSince: '2026-07-08T04:30:00',
  },
  {
    storeId: '17027',
    severity: 'red',
    reason: RED_REASONS.excessiveRunEvents,
    currentCondition: '9 main fire pump starts this month (normal: 3–5)',
    flaggedSince: '2026-07-08T08:00:00',
  },
  // --- YELLOW (diesel / electric / jockey mix) ---
  {
    storeId: '17033',
    severity: 'yellow',
    reason: YELLOW_REASONS.dieselTroubleAlert,
    currentCondition: 'AC Power Off — active 5 hours',
    flaggedSince: '2026-07-08T02:10:00',
  },
  {
    storeId: '17997',
    severity: 'yellow',
    reason: YELLOW_REASONS.dieselTroubleAlert,
    currentCondition: 'Engine Oil Pressure Low — active 6 hours',
    flaggedSince: '2026-07-08T07:55:00',
  },
  {
    storeId: '17532',
    severity: 'yellow',
    reason: YELLOW_REASONS.dieselTroubleAlert,
    currentCondition: 'Low Pump Room Temp — active 3 hours',
    flaggedSince: '2026-07-08T10:40:00',
  },
  {
    storeId: '18874',
    severity: 'yellow',
    reason: YELLOW_REASONS.electricTroubleAlert,
    currentCondition: 'Under Voltage — active 4 hours',
    flaggedSince: '2026-07-08T09:30:00',
  },
  {
    storeId: '18857',
    severity: 'yellow',
    reason: YELLOW_REASONS.electricTroubleAlert,
    currentCondition: 'Motor Overload — active 2 hours',
    flaggedSince: '2026-07-08T11:15:00',
  },
  {
    storeId: '16989',
    severity: 'yellow',
    reason: YELLOW_REASONS.electricTroubleAlert,
    currentCondition: 'Pressure Transmitter Failure — active 7 hours',
    flaggedSince: '2026-07-08T05:00:00',
  },
  {
    storeId: '18871',
    severity: 'yellow',
    reason: YELLOW_REASONS.jockeyTroubleAlert,
    currentCondition: 'Excessive Jockey Daily Starts — active',
    flaggedSince: '2026-07-07T18:45:00',
  },
  {
    storeId: '18168',
    severity: 'yellow',
    reason: YELLOW_REASONS.jockeyTroubleAlert,
    currentCondition: 'Jockey Switch is Off — active 8 hours',
    flaggedSince: '2026-07-08T03:30:00',
  },
]

export function getAlertsBySeverity(severity: AlertSeverity): SiteAlert[] {
  return MOCK_SITE_ALERTS.filter((alert) => alert.severity === severity)
}

export function getAlertCountBySeverity(severity: AlertSeverity): number {
  return getAlertsBySeverity(severity).length
}

export function getNoActionRequiredCount(): number {
  const flaggedStoreIds = new Set(MOCK_SITE_ALERTS.map((alert) => alert.storeId))
  return STORES.length - flaggedStoreIds.size
}
