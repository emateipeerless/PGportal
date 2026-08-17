import { useMemo, useState } from 'react'
import { getStoreStatus, type StoreStatus } from '../data/storeProfile'
import { STORES, searchSites } from '../data/stores'

type SidebarSort = 'az' | 'status'

interface SidebarProps {
  selectedStoreId: string | null
  onSelectStore: (storeId: string) => void
}

const STATUS_ORDER: Record<StoreStatus, number> = {
  red: 0,
  yellow: 1,
  green: 2,
}

export function Sidebar({ selectedStoreId, onSelectStore }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SidebarSort>('az')

  const displayedStores = useMemo(() => {
    const matches = query.trim() ? searchSites(query) : [...STORES]

    return [...matches].sort((a, b) => {
      if (sortMode === 'status') {
        const statusDiff = STATUS_ORDER[getStoreStatus(a.id)] - STATUS_ORDER[getStoreStatus(b.id)]
        if (statusDiff !== 0) return statusDiff
      }
      const locationDiff = a.location.localeCompare(b.location)
      if (locationDiff !== 0) return locationDiff
      return a.id.localeCompare(b.id)
    })
  }, [query, sortMode])

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon" aria-hidden="true">
            PG
          </span>
          {!isCollapsed && (
            <div>
              <p className="sidebar__brand-title">Proctor and Gamble</p>
              <p className="sidebar__brand-subtitle">Fleet Portal</p>
            </div>
          )}
        </div>
        <button
          type="button"
          className="sidebar__toggle"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="sidebar__controls">
            <div className="sidebar__search">
              <svg
                className="sidebar__search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                className="sidebar__search-input"
                placeholder="Search device ID or city..."
                aria-label="Search by device ID or city"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="sidebar__filter" role="group" aria-label="Sort sites">
              <button
                type="button"
                className={`sidebar__filter-btn ${sortMode === 'az' ? 'sidebar__filter-btn--active' : ''}`}
                onClick={() => setSortMode('az')}
              >
                A–Z
              </button>
              <button
                type="button"
                className={`sidebar__filter-btn ${sortMode === 'status' ? 'sidebar__filter-btn--active' : ''}`}
                onClick={() => setSortMode('status')}
              >
                Red
              </button>
            </div>
          </div>

          <p className="sidebar__section-label">
            Sites ({displayedStores.length}
            {query.trim() ? ` of ${STORES.length}` : ''})
          </p>
          <nav className="sidebar__nav" aria-label="Site list">
            {displayedStores.length === 0 ? (
              <p className="sidebar__empty">No sites match that search</p>
            ) : (
              <ul className="sidebar__device-list">
                {displayedStores.map((store) => (
                  <li key={store.id}>
                    <button
                      type="button"
                      className={`sidebar__device ${
                        selectedStoreId === store.id ? 'sidebar__device--active' : ''
                      }`}
                      onClick={() => onSelectStore(store.id)}
                    >
                      <span
                        className={`sidebar__device-dot sidebar__device-dot--${getStoreStatus(store.id)}`}
                        aria-hidden="true"
                      />
                      <span className="sidebar__store">
                        <span className="sidebar__store-id">{store.id}</span>
                        <span className="sidebar__store-location">{store.location}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </>
      )}
    </aside>
  )
}
