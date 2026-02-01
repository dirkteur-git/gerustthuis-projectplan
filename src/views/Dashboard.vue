<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { store, getPhaseProgress, getCriteriaProgress, getTotalSpent } from '../stores/projectStore.js'

const activePhase = computed(() => store.phases.find(p => p.status === 'actief'))
const goNoGoPhases = computed(() => store.phases.filter(p => p.status === 'go-no-go'))

const totalSpent = computed(() => getTotalSpent())
const budgetPercentage = computed(() => Math.round((totalSpent.value / store.project.totalBudget) * 100))

const todoTickets = computed(() => store.tickets.filter(t => t.status === 'todo'))
const inProgressTickets = computed(() => store.tickets.filter(t => t.status === 'in-progress'))
const mustDoTickets = computed(() => store.tickets.filter(t => t.priority === 'must' && t.status !== 'done'))

function formatCurrency(amount) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

function getStatusClass(status) {
  return {
    'actief': 'status-actief',
    'niet gestart': 'status-niet-gestart',
    'go-no-go': 'status-go-no-go',
    'afgerond': 'status-afgerond'
  }[status] || ''
}
</script>

<template>
  <div class="dashboard">
    <!-- Active Phase Banner -->
    <section v-if="activePhase" class="active-phase-banner">
      <div class="phase-info">
        <span class="phase-label">Huidige fase</span>
        <h1>{{ activePhase.id }}. {{ activePhase.name }}</h1>
        <p>{{ activePhase.description }}</p>
      </div>
      <div class="phase-progress">
        <div class="progress-ring">
          <svg viewBox="0 0 36 36">
            <path class="progress-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="progress-fill" :stroke-dasharray="`${getCriteriaProgress(activePhase)}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
          <span class="progress-text">{{ getCriteriaProgress(activePhase) }}%</span>
        </div>
        <span class="progress-label">Go/No-Go criteria</span>
      </div>
      <RouterLink :to="`/fasen/${activePhase.id}`" class="view-phase-btn">
        Bekijk fase
      </RouterLink>
    </section>

    <!-- Go/No-Go Alert -->
    <section v-if="goNoGoPhases.length > 0" class="go-no-go-alert">
      <div class="alert-icon">!</div>
      <div class="alert-content">
        <strong>Go/No-Go beslissing nodig</strong>
        <p>{{ goNoGoPhases.map(p => p.name).join(', ') }}</p>
      </div>
      <RouterLink v-if="goNoGoPhases.length === 1" :to="`/fasen/${goNoGoPhases[0].id}`" class="alert-action">
        Neem beslissing
      </RouterLink>
    </section>

    <!-- Stats Row -->
    <section class="stats-row">
      <div class="stat-card">
        <span class="stat-value">{{ store.tickets.filter(t => t.status === 'done').length }}/{{ store.tickets.length }}</span>
        <span class="stat-label">Tickets voltooid</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ mustDoTickets.length }}</span>
        <span class="stat-label">Must-have open</span>
      </div>
      <div class="stat-card budget">
        <span class="stat-value">{{ formatCurrency(totalSpent) }}</span>
        <span class="stat-label">van {{ formatCurrency(store.project.totalBudget) }} budget</span>
        <div class="budget-bar">
          <div class="budget-fill" :style="{ width: budgetPercentage + '%' }"></div>
        </div>
      </div>
    </section>

    <!-- Two Columns -->
    <div class="columns">
      <!-- What needs to happen -->
      <section class="todo-section">
        <h2>Wat moet er nog gebeuren</h2>

        <div v-if="mustDoTickets.length > 0" class="ticket-group">
          <h3>Must-have tickets</h3>
          <ul class="ticket-list">
            <li v-for="ticket in mustDoTickets.slice(0, 5)" :key="ticket.id" class="ticket-item">
              <span class="ticket-status" :class="ticket.status"></span>
              <span class="ticket-title">{{ ticket.title }}</span>
              <span class="ticket-phase">Fase {{ ticket.phaseId }}</span>
            </li>
          </ul>
          <RouterLink v-if="mustDoTickets.length > 5" to="/tickets?priority=must" class="show-all">
            Bekijk alle {{ mustDoTickets.length }} must-have tickets
          </RouterLink>
        </div>

        <div v-if="inProgressTickets.length > 0" class="ticket-group">
          <h3>In progress ({{ inProgressTickets.length }})</h3>
          <ul class="ticket-list">
            <li v-for="ticket in inProgressTickets.slice(0, 3)" :key="ticket.id" class="ticket-item">
              <span class="ticket-status in-progress"></span>
              <span class="ticket-title">{{ ticket.title }}</span>
              <span class="ticket-phase">Fase {{ ticket.phaseId }}</span>
            </li>
          </ul>
        </div>

        <p v-if="mustDoTickets.length === 0 && inProgressTickets.length === 0" class="empty-state">
          Alle must-have tickets zijn afgerond. Tijd voor go/no-go?
        </p>
      </section>

      <!-- Phase Overview -->
      <section class="phases-overview">
        <h2>Fase overzicht</h2>
        <div class="phase-list">
          <RouterLink
            v-for="phase in store.phases"
            :key="phase.id"
            :to="`/fasen/${phase.id}`"
            class="phase-row"
            :class="{ active: phase.status === 'actief' }"
          >
            <span class="phase-number">{{ phase.id }}</span>
            <span class="phase-name">{{ phase.name }}</span>
            <span class="phase-status" :class="getStatusClass(phase.status)">
              {{ phase.status }}
            </span>
            <div class="phase-mini-progress">
              <div class="mini-bar">
                <div class="mini-fill" :style="{ width: getCriteriaProgress(phase) + '%' }"></div>
              </div>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Active Phase Banner */
.active-phase-banner {
  background: linear-gradient(135deg, var(--color-primary), #1d4ed8);
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.phase-info {
  flex: 1;
}

.phase-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  opacity: 0.8;
  letter-spacing: 0.05em;
}

.phase-info h1 {
  margin: 0.25rem 0;
  font-size: 1.5rem;
}

.phase-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.phase-progress {
  text-align: center;
}

.progress-ring {
  width: 80px;
  height: 80px;
  position: relative;
}

.progress-ring svg {
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 3;
}

.progress-fill {
  fill: none;
  stroke: white;
  stroke-width: 3;
  stroke-linecap: round;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.25rem;
  font-weight: 700;
}

.progress-label {
  font-size: 0.7rem;
  opacity: 0.8;
}

.view-phase-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.view-phase-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Go/No-Go Alert */
.go-no-go-alert {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.alert-icon {
  width: 32px;
  height: 32px;
  background: #f59e0b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  color: #92400e;
}

.alert-content p {
  margin: 0.25rem 0 0;
  color: #b45309;
  font-size: 0.875rem;
}

.alert-action {
  background: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  display: block;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.stat-card.budget .stat-value {
  font-size: 1.5rem;
}

.budget-bar {
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  margin-top: 0.75rem;
  overflow: hidden;
}

.budget-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
}

/* Columns */
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .columns {
    grid-template-columns: 1fr;
  }
}

/* Todo Section */
.todo-section, .phases-overview {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.todo-section h2, .phases-overview h2 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: var(--color-text);
}

.ticket-group {
  margin-bottom: 1.25rem;
}

.ticket-group h3 {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.ticket-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ticket-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.ticket-item:last-child {
  border-bottom: none;
}

.ticket-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
}

.ticket-status.todo { background: #9ca3af; }
.ticket-status.in-progress { background: #3b82f6; }
.ticket-status.done { background: #10b981; }

.ticket-title {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text);
}

.ticket-phase {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.show-all {
  display: block;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-primary);
  margin-top: 0.75rem;
}

.empty-state {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
}

/* Phase List */
.phase-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.phase-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s;
}

.phase-row:hover {
  background: rgba(0, 0, 0, 0.02);
}

.phase-row.active {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.phase-number {
  width: 24px;
  height: 24px;
  background: var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.phase-row.active .phase-number {
  background: var(--color-primary);
  color: white;
}

.phase-name {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text);
}

.phase-status {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: capitalize;
}

.status-actief { background: #dbeafe; color: #1d4ed8; }
.status-niet-gestart { background: #f3f4f6; color: #6b7280; }
.status-go-no-go { background: #fef3c7; color: #d97706; }
.status-afgerond { background: #d1fae5; color: #059669; }

.phase-mini-progress {
  width: 60px;
}

.mini-bar {
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .active-phase-banner {
    flex-direction: column;
    text-align: center;
  }

  .view-phase-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
