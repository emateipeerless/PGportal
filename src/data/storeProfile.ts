import { MOCK_SITE_ALERTS, type AlertSeverity, type SiteAlert } from './mockAlerts'
import { MOCK_ACTIVE_IMPAIRMENTS } from './mockImpairments'
import { MOCK_PREDICTIVE_STATISTICS } from './mockPredictiveStats'
import {
  MOCK_FIRE_PUMP_ACTIVITY,
  MOCK_JOCKEY_PUMP_ACTIVITY,
} from './mockPumpActivity'
import { getControllerType, getPumpConfiguration, getStoreById } from './stores'

export type StoreStatus = 'red' | 'yellow' | 'green'

export type FlagCategory =
  | 'status-alert'
  | 'impairment'
  | 'predictive'
  | 'jockey-pump'
  | 'fire-pump'

export interface StoreFlagEvent {
  date: string
  category: FlagCategory
  title: string
  detail: string
  severity?: AlertSeverity
  active: boolean
}

export interface StoreStatusHistoryEntry {
  severity: AlertSeverity
  reason: string
  startedAt: string
  endedAt?: string
}

export interface StoreOverallInfo {
  siteName: string
  deviceId: string
  location: string
  pumpConfiguration: string
  controllerType: string
  connectivityStatus: string
  pumpRoomTemp: string
  lastInspection: string
  siteGrade: string
  devicesOnline: string
}

export interface StoreProfile {
  storeId: string
  location: string
  siteName: string
  currentStatus: StoreStatus
  currentAlert?: SiteAlert
  overallInfo: StoreOverallInfo
  activeFlags: StoreFlagEvent[]
  flagHistory: StoreFlagEvent[]
  statusHistory: StoreStatusHistoryEntry[]
}

const MOCK_STATUS_HISTORY: Record<string, StoreStatusHistoryEntry[]> = {
  '17321': [
    {
      severity: 'yellow',
      reason: 'Diesel yellow trouble alert',
      startedAt: '2026-06-12T09:00:00',
      endedAt: '2026-06-14T16:30:00',
    },
    {
      severity: 'red',
      reason: 'Impairment active for more than 10 hours',
      startedAt: '2026-07-07T22:15:00',
    },
  ],
  '18049': [
    {
      severity: 'red',
      reason: 'Impairment active for more than 10 hours',
      startedAt: '2026-07-08T01:00:00',
    },
  ],
  '19230': [
    {
      severity: 'red',
      reason: 'Impairment active for more than 10 hours',
      startedAt: '2026-07-07T18:20:00',
    },
  ],
  '18871': [
    {
      severity: 'yellow',
      reason: 'Jockey yellow trouble alert',
      startedAt: '2026-07-07T18:45:00',
    },
  ],
  '17027': [
    {
      severity: 'red',
      reason: 'Excessive run events',
      startedAt: '2026-07-08T08:00:00',
    },
    {
      severity: 'red',
      reason: 'Excessive run events',
      startedAt: '2026-04-18T14:20:00',
      endedAt: '2026-04-20T09:00:00',
    },
  ],
  '17330': [
    {
      severity: 'red',
      reason: 'Pump room temperature below 50°F',
      startedAt: '2026-07-08T04:30:00',
    },
  ],
  '17997': [
    {
      severity: 'yellow',
      reason: 'Diesel yellow trouble alert',
      startedAt: '2026-07-08T07:55:00',
    },
  ],
  '17033': [
    {
      severity: 'yellow',
      reason: 'Diesel yellow trouble alert',
      startedAt: '2026-07-08T02:10:00',
    },
  ],
  '17532': [
    {
      severity: 'yellow',
      reason: 'Diesel yellow trouble alert',
      startedAt: '2026-07-08T10:40:00',
    },
  ],
  '18874': [
    {
      severity: 'yellow',
      reason: 'Electric yellow trouble alert',
      startedAt: '2026-07-08T09:30:00',
    },
  ],
  '18857': [
    {
      severity: 'yellow',
      reason: 'Electric yellow trouble alert',
      startedAt: '2026-07-08T11:15:00',
    },
  ],
  '16989': [
    {
      severity: 'yellow',
      reason: 'Electric yellow trouble alert',
      startedAt: '2026-07-08T05:00:00',
    },
  ],
  '18168': [
    {
      severity: 'yellow',
      reason: 'Jockey yellow trouble alert',
      startedAt: '2026-07-08T03:30:00',
    },
  ],
}

const DEFAULT_OVERALL_INFO: Omit<StoreOverallInfo, 'siteName' | 'deviceId' | 'location'> = {
  pumpConfiguration: 'Diesel + Jockey',
  controllerType: 'Diesel Fire Pump Controller',
  connectivityStatus: 'Online',
  pumpRoomTemp: '68°F',
  lastInspection: '2026-05-12',
  siteGrade: 'A',
  devicesOnline: '2 of 2',
}

const STORE_INFO_OVERRIDES: Record<string, Partial<StoreOverallInfo>> = {
  '17321': { pumpRoomTemp: '74°F', siteGrade: 'C', lastInspection: '2026-04-28' },
  '17027': { pumpRoomTemp: '71°F', siteGrade: 'D', lastInspection: '2026-03-15' },
  '17330': { pumpRoomTemp: '46°F', siteGrade: 'D', connectivityStatus: 'Online' },
  '18049': { pumpRoomTemp: '70°F', siteGrade: 'D' },
  '19230': { pumpRoomTemp: '72°F', siteGrade: 'D' },
  '18871': { pumpRoomTemp: '69°F', siteGrade: 'B-' },
  '17033': { pumpRoomTemp: '67°F', siteGrade: 'B' },
  '17997': { pumpRoomTemp: '70°F', siteGrade: 'B-' },
  '17532': { pumpRoomTemp: '52°F', siteGrade: 'B-' },
  '18874': { pumpRoomTemp: '68°F', siteGrade: 'B-' },
  '18857': { pumpRoomTemp: '69°F', siteGrade: 'B-' },
  '16989': { pumpRoomTemp: '71°F', siteGrade: 'B-' },
  '18168': { pumpRoomTemp: '67°F', siteGrade: 'B-' },
}

export function getStoreStatus(storeId: string): StoreStatus {
  const alert = MOCK_SITE_ALERTS.find((item) => item.storeId === storeId)
  if (!alert) return 'green'
  return alert.severity
}

export function getStoreProfile(storeId: string): StoreProfile | undefined {
  const store = getStoreById(storeId)
  if (!store) return undefined

  const currentAlert = MOCK_SITE_ALERTS.find((item) => item.storeId === storeId)
  const currentStatus = currentAlert ? currentAlert.severity : 'green'
  const flagEvents = buildFlagEvents(storeId, currentAlert)
  const activeFlags = flagEvents.filter((event) => event.active)
  const statusHistory = buildStatusHistory(storeId, currentAlert)

  return {
    storeId: store.id,
    location: store.location,
    siteName: store.siteName,
    currentStatus,
    currentAlert,
    overallInfo: {
      ...DEFAULT_OVERALL_INFO,
      siteName: store.siteName,
      deviceId: store.id,
      location: store.location,
      pumpConfiguration: getPumpConfiguration(store),
      controllerType: getControllerType(store),
      devicesOnline: '2 of 2',
      ...STORE_INFO_OVERRIDES[storeId],
      siteGrade: currentStatus === 'red' ? 'D' : currentStatus === 'yellow' ? 'B-' : (STORE_INFO_OVERRIDES[storeId]?.siteGrade ?? DEFAULT_OVERALL_INFO.siteGrade),
    },
    activeFlags,
    flagHistory: flagEvents.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
    statusHistory,
  }
}

function buildFlagEvents(storeId: string, currentAlert?: SiteAlert): StoreFlagEvent[] {
  const events: StoreFlagEvent[] = []

  if (currentAlert) {
    events.push({
      date: currentAlert.flaggedSince,
      category: 'status-alert',
      title: currentAlert.reason,
      detail: currentAlert.currentCondition,
      severity: currentAlert.severity,
      active: true,
    })
  }

  for (const item of MOCK_ACTIVE_IMPAIRMENTS.filter((entry) => entry.storeId === storeId)) {
    events.push({
      date: item.activeSince,
      category: 'impairment',
      title: item.impairment,
      detail: 'Active impairment on site controller',
      severity: currentAlert?.severity ?? 'yellow',
      active: true,
    })
  }

  for (const item of MOCK_PREDICTIVE_STATISTICS.filter((entry) => entry.storeId === storeId)) {
    events.push({
      date: '2026-07-08T00:00:00',
      category: 'predictive',
      title: item.statistic,
      detail: item.prediction,
      active: true,
    })
  }

  for (const item of MOCK_JOCKEY_PUMP_ACTIVITY.filter((entry) => entry.storeId === storeId)) {
    events.push({
      date: '2026-07-01T00:00:00',
      category: 'jockey-pump',
      title: 'Excessive jockey pump activity',
      detail: `${item.startsThisMonth} starts this month (+${item.percentChangeFromLastMonth}% vs last month)`,
      severity: 'yellow',
      active: true,
    })
  }

  for (const item of MOCK_FIRE_PUMP_ACTIVITY.filter((entry) => entry.storeId === storeId)) {
    events.push({
      date: '2026-07-01T00:00:00',
      category: 'fire-pump',
      title: 'Excessive fire pump activity',
      detail: `${item.startsThisMonth} starts this month (+${item.percentChangeFromLastMonth}% vs last month)`,
      severity: currentAlert?.severity === 'red' ? 'red' : 'yellow',
      active: true,
    })
  }

  const resolvedHistory = MOCK_RESOLVED_FLAG_HISTORY[storeId] ?? []
  events.push(...resolvedHistory)

  return events
}

function buildStatusHistory(
  storeId: string,
  currentAlert?: SiteAlert,
): StoreStatusHistoryEntry[] {
  const history = [...(MOCK_STATUS_HISTORY[storeId] ?? [])]

  if (currentAlert && !history.some((entry) => !entry.endedAt && entry.startedAt === currentAlert.flaggedSince)) {
    history.unshift({
      severity: currentAlert.severity,
      reason: currentAlert.reason,
      startedAt: currentAlert.flaggedSince,
    })
  }

  return history.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )
}

const MOCK_RESOLVED_FLAG_HISTORY: Record<string, StoreFlagEvent[]> = {
  '17321': [
    {
      date: '2026-06-14T16:30:00',
      category: 'status-alert',
      title: 'Diesel yellow trouble alert',
      detail: 'Common Trouble Alarm — Cleared after 2 days',
      severity: 'yellow',
      active: false,
    },
  ],
  '18871': [
    {
      date: '2026-05-24T08:15:00',
      category: 'status-alert',
      title: 'Jockey yellow trouble alert',
      detail: 'Jockey Switch in Manual — restored to Auto',
      severity: 'yellow',
      active: false,
    },
  ],
  '17027': [
    {
      date: '2026-04-20T09:00:00',
      category: 'status-alert',
      title: 'Excessive run events',
      detail: 'Main fire pump starts returned to normal band (3–5)',
      severity: 'red',
      active: false,
    },
  ],
  '17997': [
    {
      date: '2026-06-03T12:00:00',
      category: 'status-alert',
      title: 'Diesel yellow trouble alert',
      detail: 'Low Suction Pressure — Cleared',
      severity: 'yellow',
      active: false,
    },
  ],
  '18049': [
    {
      date: '2026-05-10T14:00:00',
      category: 'status-alert',
      title: 'Electric yellow trouble alert',
      detail: 'Over Voltage — Cleared',
      severity: 'yellow',
      active: false,
    },
  ],
}

export function getStatusLabel(status: StoreStatus): string {
  if (status === 'red') return 'Immediate Attention Required'
  if (status === 'yellow') return 'Monitor Closely'
  return 'No Action Required'
}

export function getCategoryLabel(category: FlagCategory): string {
  const labels: Record<FlagCategory, string> = {
    'status-alert': 'Status Alert',
    impairment: 'Impairment',
    predictive: 'Predictive Statistic',
    'jockey-pump': 'Jockey Pump',
    'fire-pump': 'Fire Pump',
  }
  return labels[category]
}
