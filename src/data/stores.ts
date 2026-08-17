export type MainPumpType = 'diesel' | 'electric'

export interface Store {
  id: string
  location: string
  siteName: string
  /** Each site is diesel + jockey or electric + jockey — never both mains. */
  mainPumpType: MainPumpType
}

export const STORES: Store[] = [
  { id: '17321', location: 'St. Louis, MO', siteName: 'Cascade Diesel Pump', mainPumpType: 'diesel' },
  { id: '17033', location: 'Cincinnati, OH', siteName: 'Winton Hill Business Center Diesel', mainPumpType: 'diesel' },
  { id: '18049', location: 'Cincinnati, OH', siteName: 'Winton Hill Business Center Electric', mainPumpType: 'electric' },
  { id: '17330', location: 'Chicago, IL', siteName: 'Greater Chicago FC Diesel', mainPumpType: 'diesel' },
  { id: '17997', location: 'Albany, GA', siteName: 'Paper Products North Diesel', mainPumpType: 'diesel' },
  { id: '17989', location: 'Albany, GA', siteName: 'Paper Products South Diesel', mainPumpType: 'diesel' },
  { id: '19065', location: 'Alce Blanco, Mexico', siteName: 'Alce Blanco Diesel', mainPumpType: 'diesel' },
  { id: '18871', location: 'Iowa City, IA', siteName: 'Iowa City Diesel', mainPumpType: 'diesel' },
  { id: '18874', location: 'Iowa City, IA', siteName: 'Iowa City Electric', mainPumpType: 'electric' },
  { id: '18857', location: 'Giza, Egypt', siteName: 'Giza Electric', mainPumpType: 'electric' },
  { id: '19068', location: 'Giza, Egypt', siteName: 'Giza Diesel', mainPumpType: 'diesel' },
  { id: '19230', location: 'Moreno Valley, CA', siteName: 'Moreno Valley Diesel', mainPumpType: 'diesel' },
  { id: '19222', location: 'Moreno Valley, CA', siteName: 'Moreno Valley Diesel', mainPumpType: 'diesel' },
  { id: '17532', location: 'Corinne, UT', siteName: 'Box Elder Diesel 106', mainPumpType: 'diesel' },
  { id: '17020', location: 'Corinne, UT', siteName: 'Box Elder Diesel 107', mainPumpType: 'diesel' },
  { id: '18168', location: 'Akashi, Japan', siteName: 'Pump Room 2 Diesel', mainPumpType: 'diesel' },
  { id: '18171', location: 'Akashi, Japan', siteName: 'Pump Room 1 Diesel', mainPumpType: 'diesel' },
  { id: '17223', location: 'Lodz, Poland', siteName: 'Gillette Diesel', mainPumpType: 'diesel' },
  { id: '17346', location: 'Lodz, Poland', siteName: 'Gillette Diesel', mainPumpType: 'diesel' },
  { id: '17022', location: 'Boston, MA', siteName: 'Gillette World Shaving HQ Diesel', mainPumpType: 'diesel' },
  { id: '17002', location: 'Greensboro, NC', siteName: 'Greensboro Diesel', mainPumpType: 'diesel' },
  { id: '18844', location: 'Ahmedabad, India', siteName: 'Ahmedabad Diesel', mainPumpType: 'diesel' },
  { id: '18044', location: 'Gyongyos, Hungary', siteName: 'Gyongyos Diesel', mainPumpType: 'diesel' },
  { id: '18137', location: 'Hyderabad, India', siteName: 'Hyderabad Diesel', mainPumpType: 'diesel' },
  { id: '18884', location: 'London, UK', siteName: 'London Diesel', mainPumpType: 'diesel' },
  { id: '18147', location: 'Luogang, China', siteName: 'Luogang Diesel', mainPumpType: 'diesel' },
  { id: '18165', location: 'Luogang, China', siteName: 'Luogang Diesel', mainPumpType: 'diesel' },
  { id: '17027', location: 'Mason, OH', siteName: 'Mason Electric', mainPumpType: 'electric' },
  { id: '16989', location: 'Mehoopany, PA', siteName: 'Mehoopany Electric', mainPumpType: 'electric' },
]

export function getPumpConfiguration(store: Store): string {
  return store.mainPumpType === 'diesel' ? 'Diesel + Jockey' : 'Electric + Jockey'
}

export function getControllerType(store: Store): string {
  return store.mainPumpType === 'diesel'
    ? 'Diesel Fire Pump Controller'
    : 'Electric Fire Pump Controller'
}

export function getStoreLabel(store: Store): string {
  return `${store.id} ${store.location}`
}

export function getStoreById(storeId: string): Store | undefined {
  return STORES.find((store) => store.id === storeId)
}

export function searchSites(query: string): Store[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  const numericQuery = normalized.replace(/\D/g, '')

  return STORES.filter((store) => {
    const haystack = `${store.id} ${store.location} ${store.siteName}`.toLowerCase()
    if (haystack.includes(normalized)) return true
    if (!numericQuery) return false
    return store.id.replace(/\D/g, '').includes(numericQuery)
  })
}
