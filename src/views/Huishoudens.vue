<script setup>
import { ref, onMounted, computed } from 'vue'
import { getHouseholds, getHouseholdMembers, getHouseholdInvitations, getRoomActivityHourly } from '../services/supabase'

const households = ref([])
const members = ref({})       // householdId → members[]
const invitations = ref({})   // householdId → invitations[]
const heatmaps = ref({})      // householdId → { days[], maxCount }
const expandedId = ref(null)
const loading = ref(true)
const error = ref(null)
const heatmapHover = ref(null)

onMounted(async () => {
  try {
    households.value = await getHouseholds()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

async function toggleExpand(householdId) {
  if (expandedId.value === householdId) {
    expandedId.value = null
    return
  }

  expandedId.value = householdId
  const household = households.value.find(h => h.id === householdId)

  // Lazy load members, invitations & heatmap
  const promises = []

  if (!members.value[householdId]) {
    promises.push(
      Promise.all([
        getHouseholdMembers(householdId),
        getHouseholdInvitations(householdId),
      ]).then(([m, inv]) => {
        members.value[householdId] = m
        invitations.value[householdId] = inv
      })
    )
  }

  if (!heatmaps.value[householdId] && household?.config_id) {
    promises.push(
      getRoomActivityHourly(household.config_id).then(rawData => {
        heatmaps.value[householdId] = buildHeatmap(rawData)
      }).catch(e => {
        console.error('Error loading heatmap:', e)
        heatmaps.value[householdId] = { days: [], maxCount: 0 }
      })
    )
  }

  try {
    await Promise.all(promises)
  } catch (e) {
    console.error('Error loading household details:', e)
  }
}

// === Heatmap helpers ===

function toLocalDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function buildHeatmap(rawData) {
  // Initialize 7 days × 24 hours
  const dayMap = new Map()
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - 6 + i)
    const dateKey = toLocalDateKey(date)
    const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0, rooms: {} }))
    dayMap.set(dateKey, { date: dateKey, hours })
  }

  // Skip current hour (not yet aggregated)
  const now = new Date()
  const currentHourTs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()).getTime()

  let maxCount = 0

  for (const row of rawData) {
    const eventDate = new Date(row.hour)
    if (eventDate.getTime() >= currentHourTs) continue

    const dateKey = toLocalDateKey(eventDate)
    const hourOfDay = eventDate.getHours()
    const day = dayMap.get(dateKey)

    if (day) {
      day.hours[hourOfDay].count += row.total_events || 0
      if (row.room_name) {
        day.hours[hourOfDay].rooms[row.room_name] =
          (day.hours[hourOfDay].rooms[row.room_name] || 0) + (row.total_events || 0)
      }
      if (day.hours[hourOfDay].count > maxCount) {
        maxCount = day.hours[hourOfDay].count
      }
    }
  }

  const days = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date))
  return { days, maxCount: maxCount || 1 }
}

function getHeatColor(count, maxCount) {
  if (count === 0) return '#f3f4f6'
  const intensity = count / maxCount
  if (intensity < 0.25) return '#dbeafe'
  if (intensity < 0.5) return '#93c5fd'
  if (intensity < 0.75) return '#3b82f6'
  return '#1d4ed8'
}

function formatDayLabel(dateStr) {
  const d = new Date(dateStr)
  return ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'][d.getDay()]
}

function handleHeatHover(event, day, hour) {
  const roomEntries = Object.entries(hour.rooms || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY

  let x = clientX + 12
  let y = clientY - 10
  if (x + 210 > window.innerWidth) x = clientX - 222
  if (y + 130 > window.innerHeight) y = window.innerHeight - 140
  if (y < 10) y = 10

  const d = new Date(day.date)
  const days = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

  heatmapHover.value = {
    dateLabel: `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}, ${String(hour.hour).padStart(2, '0')}:00`,
    totalCount: hour.count,
    rooms: roomEntries.map(([name, count]) => ({ name, count })),
    x,
    y
  }
}

function handleHeatLeave() {
  heatmapHover.value = null
}

// === General helpers ===

const totalMembers = computed(() =>
  Object.values(members.value).reduce((sum, m) => sum + m.length, 0)
)

function roleBadgeClass(role) {
  return {
    admin: 'badge-admin',
    viewer: 'badge-viewer',
    installer: 'badge-installer',
  }[role] || 'badge-viewer'
}

function roleLabel(role) {
  return { admin: 'Admin', viewer: 'Mantelzorger', installer: 'Installateur' }[role] || role
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Huishoudens</h1>
      <p class="page-subtitle">Overzicht van alle huishoudens, leden en koppelingen.</p>
    </div>

    <!-- Stats -->
    <div class="stats-row" v-if="!loading && !error">
      <div class="stat-card">
        <span class="stat-value">{{ households.length }}</span>
        <span class="stat-label">Huishoudens</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ totalMembers }}</span>
        <span class="stat-label">Leden geladen</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">Laden...</div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">{{ error }}</div>

    <!-- Empty -->
    <div v-else-if="households.length === 0" class="empty-state">
      Geen huishoudens gevonden.
    </div>

    <!-- Household list -->
    <div v-else class="household-list">
      <div
        v-for="h in households"
        :key="h.id"
        class="household-card"
        :class="{ expanded: expandedId === h.id }"
      >
        <!-- Card header (clickable) -->
        <button class="card-header" @click="toggleExpand(h.id)">
          <div class="card-header-left">
            <svg class="house-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <div>
              <span class="card-name">{{ h.name }}</span>
              <span class="card-meta">
                {{ h.hue_config?.user_email || 'Geen config' }}
                &middot; Aangemaakt {{ formatDate(h.created_at) }}
              </span>
            </div>
          </div>
          <svg
            class="chevron"
            :class="{ rotated: expandedId === h.id }"
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <!-- Expanded detail -->
        <div v-if="expandedId === h.id" class="card-detail">

          <!-- Heatmap (alleen als er een config is) -->
          <div class="detail-section" v-if="h.config_id">
            <h3>Activiteit — afgelopen 7 dagen</h3>
            <div v-if="!heatmaps[h.id]" class="text-muted">Laden...</div>
            <div v-else-if="heatmaps[h.id].days.length === 0" class="text-muted">Geen data.</div>
            <div v-else>
              <div class="heatmap">
                <div v-for="day in heatmaps[h.id].days" :key="day.date" class="heatmap-row">
                  <span class="heatmap-label">{{ formatDayLabel(day.date) }}</span>
                  <div class="heatmap-cells">
                    <div
                      v-for="hour in day.hours"
                      :key="hour.hour"
                      class="heatmap-cell"
                      :style="{ backgroundColor: getHeatColor(hour.count, heatmaps[h.id].maxCount) }"
                      @mouseenter="handleHeatHover($event, day, hour)"
                      @mouseleave="handleHeatLeave"
                      @touchstart.passive="handleHeatHover($event, day, hour)"
                      @touchend="handleHeatLeave"
                    ></div>
                  </div>
                </div>
              </div>
              <!-- Uur-labels -->
              <div class="heatmap-hours">
                <span class="heatmap-label"></span>
                <div class="heatmap-hour-labels">
                  <span v-for="h in [0, 6, 12, 18, 23]" :key="h">{{ String(h).padStart(2, '0') }}</span>
                </div>
              </div>
              <!-- Legenda -->
              <div class="heatmap-legend">
                <span>Rustig</span>
                <div class="heatmap-legend-colors">
                  <div style="background: #f3f4f6"></div>
                  <div style="background: #dbeafe"></div>
                  <div style="background: #93c5fd"></div>
                  <div style="background: #3b82f6"></div>
                  <div style="background: #1d4ed8"></div>
                </div>
                <span>Actief</span>
              </div>
            </div>
          </div>

          <!-- Config info -->
          <div class="detail-section" v-if="h.hue_config">
            <h3>Hue configuratie</h3>
            <div class="detail-row">
              <span class="detail-label">Config ID</span>
              <code class="detail-value">{{ h.config_id }}</code>
            </div>
            <div class="detail-row">
              <span class="detail-label">E-mail</span>
              <span class="detail-value">{{ h.hue_config.user_email }}</span>
            </div>
          </div>
          <div class="detail-section" v-else>
            <h3>Hue configuratie</h3>
            <p class="text-muted">Geen Hue configuratie gekoppeld.</p>
          </div>

          <!-- Members -->
          <div class="detail-section">
            <h3>Leden ({{ members[h.id]?.length || 0 }})</h3>
            <div v-if="!members[h.id]" class="text-muted">Laden...</div>
            <div v-else-if="members[h.id].length === 0" class="text-muted">Geen leden.</div>
            <table v-else class="members-table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Rol</th>
                  <th>Lid sinds</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in members[h.id]" :key="m.id">
                  <td>{{ m.display_name || m.user_id.slice(0, 8) + '...' }}</td>
                  <td><span class="badge" :class="roleBadgeClass(m.role)">{{ roleLabel(m.role) }}</span></td>
                  <td>{{ formatDate(m.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Invitations -->
          <div class="detail-section" v-if="invitations[h.id]?.length > 0">
            <h3>Openstaande uitnodigingen</h3>
            <table class="members-table">
              <thead>
                <tr>
                  <th>E-mail</th>
                  <th>Rol</th>
                  <th>Verloopt</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="inv in invitations[h.id]" :key="inv.id">
                  <td>{{ inv.invited_email }}</td>
                  <td><span class="badge" :class="roleBadgeClass(inv.role)">{{ roleLabel(inv.role) }}</span></td>
                  <td>{{ formatDate(inv.expires_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Heatmap Tooltip -->
    <Teleport to="body">
      <div
        v-if="heatmapHover"
        class="heatmap-tooltip"
        :style="{ left: heatmapHover.x + 'px', top: heatmapHover.y + 'px' }"
      >
        <div class="tooltip-header">{{ heatmapHover.dateLabel }}</div>
        <div v-if="heatmapHover.rooms.length === 0" class="tooltip-empty">Geen activiteit</div>
        <div v-else class="tooltip-rooms">
          <div v-for="room in heatmapHover.rooms" :key="room.name" class="tooltip-room">
            <span class="tooltip-room-name">{{ room.name }}</span>
            <span class="tooltip-room-count">{{ room.count }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.page-subtitle {
  margin: 0.25rem 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

/* Stats */
.stats-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

/* States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.error-state {
  text-align: center;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: var(--color-danger);
}

/* Household cards */
.household-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.household-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.household-card.expanded {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  color: var(--color-text);
  transition: background 0.15s;
}

.card-header:hover {
  background: #f9fafb;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.house-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.card-name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
}

.card-meta {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

.chevron {
  color: var(--color-text-secondary);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.chevron.rotated {
  transform: rotate(180deg);
}

/* Detail panel */
.card-detail {
  border-top: 1px solid var(--color-border);
  padding: 1.25rem;
}

.detail-section {
  margin-bottom: 1.25rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h3 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin: 0 0 0.75rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 0;
  font-size: 0.875rem;
}

.detail-label {
  color: var(--color-text-secondary);
  min-width: 80px;
}

.detail-value {
  color: var(--color-text);
}

code.detail-value {
  font-size: 0.8rem;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.text-muted {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

/* Heatmap */
.heatmap {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.heatmap-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.heatmap-label {
  width: 1.75rem;
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  text-align: right;
  flex-shrink: 0;
}

.heatmap-cells {
  display: flex;
  gap: 2px;
  flex: 1;
}

.heatmap-cell {
  flex: 1;
  height: 1.125rem;
  border-radius: 2px;
  cursor: pointer;
  transition: box-shadow 0.1s;
}

.heatmap-cell:hover {
  box-shadow: 0 0 0 2px var(--color-primary-light), 0 0 0 3px white;
}

.heatmap-hours {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2px;
}

.heatmap-hour-labels {
  display: flex;
  flex: 1;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--color-text-secondary);
  padding: 0 1px;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
  margin-top: 0.75rem;
  font-size: 0.7rem;
  color: var(--color-text-secondary);
}

.heatmap-legend-colors {
  display: flex;
  gap: 2px;
}

.heatmap-legend-colors div {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 2px;
}

/* Heatmap tooltip */
.heatmap-tooltip {
  position: fixed;
  z-index: 1000;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 0.75rem;
  pointer-events: none;
  min-width: 10rem;
}

.tooltip-header {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.tooltip-empty {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.tooltip-rooms {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tooltip-room {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
}

.tooltip-room-name {
  color: var(--color-text-secondary);
}

.tooltip-room-count {
  font-weight: 600;
  color: var(--color-text);
}

/* Members table */
.members-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.members-table th {
  text-align: left;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8rem;
}

.members-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: var(--color-text);
}

.members-table tr:last-child td {
  border-bottom: none;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-admin {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-viewer {
  background: #d1fae5;
  color: #065f46;
}

.badge-installer {
  background: #fef3c7;
  color: #92400e;
}

@media (max-width: 640px) {
  .stats-row {
    flex-direction: column;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }

  .heatmap-cell {
    height: 1.5rem;
  }
}
</style>
