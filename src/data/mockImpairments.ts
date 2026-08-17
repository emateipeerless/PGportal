/**
 * Active impairments aligned to current red/yellow catalog names
 * and to MOCK_SITE_ALERTS trouble sites.
 */
export interface ActiveImpairment {
  storeId: string
  impairment: string
  activeSince: string
}

export const MOCK_ACTIVE_IMPAIRMENTS: ActiveImpairment[] = [
  // Red impairments
  {
    storeId: '17321',
    impairment: 'Engine Failed to Start',
    activeSince: '2026-07-07T22:15:00',
  },
  {
    storeId: '18049',
    impairment: 'Phase Failure',
    activeSince: '2026-07-08T01:00:00',
  },
  {
    storeId: '19230',
    impairment: 'Main Switch in Off',
    activeSince: '2026-07-07T18:20:00',
  },
  // Yellow diesel
  {
    storeId: '17033',
    impairment: 'AC Power Off',
    activeSince: '2026-07-08T02:10:00',
  },
  {
    storeId: '17997',
    impairment: 'Engine Oil Pressure Low',
    activeSince: '2026-07-08T07:55:00',
  },
  {
    storeId: '17532',
    impairment: 'Low Pump Room Temp',
    activeSince: '2026-07-08T10:40:00',
  },
  // Yellow electric
  {
    storeId: '18874',
    impairment: 'Under Voltage',
    activeSince: '2026-07-08T09:30:00',
  },
  {
    storeId: '18857',
    impairment: 'Motor Overload',
    activeSince: '2026-07-08T11:15:00',
  },
  {
    storeId: '16989',
    impairment: 'Pressure Transmitter Failure',
    activeSince: '2026-07-08T05:00:00',
  },
  // Yellow jockey
  {
    storeId: '18871',
    impairment: 'Excessive Jockey Daily Starts',
    activeSince: '2026-07-07T18:45:00',
  },
  {
    storeId: '18168',
    impairment: 'Jockey Switch is Off',
    activeSince: '2026-07-08T03:30:00',
  },
]

export function getActiveImpairmentCount(): number {
  return MOCK_ACTIVE_IMPAIRMENTS.length
}
