<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { store, getCriteriaProgress, getTotalSpent } from '../stores/projectStore.js'

const phaseColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6'
]

function getPhaseColor(index) {
  return phaseColors[index % phaseColors.length]
}

function getStatusClass(status) {
  return {
    'actief': 'status-actief',
    'niet gestart': 'status-niet-gestart',
    'go-no-go': 'status-go-no-go',
    'afgerond': 'status-afgerond'
  }[status] || ''
}

function formatCurrency(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

const totalSpent = computed(() => getTotalSpent())
const totalBudget = computed(() => store.project.totalBudget)

const activePhaseIndex = computed(() => {
  const idx = store.phases.findIndex(p => p.status === 'actief' || p.status === 'go-no-go')
  return idx >= 0 ? idx : 0
})
</script>

<template>
  <div class="planning">
    <div class="header">
      <div>
        <h1>Tijdlijn</h1>
        <p class="subtitle">Overzicht van alle projectfasen en voortgang</p>
      </div>
      <div class="budget-summary">
        <span class="budget-label">Budget</span>
        <span class="budget-value">{{ formatCurrency(totalSpent) }} / {{ formatCurrency(totalBudget) }}</span>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline">
      <div class="timeline-track">
        <div
          v-for="(phase, index) in store.phases"
          :key="phase.id"
          class="timeline-node"
          :class="{ active: phase.status === 'actief', 'go-no-go': phase.status === 'go-no-go', done: phase.status === 'afgerond' }"
        >
          <div class="node-connector" v-if="index > 0"></div>
          <RouterLink :to="`/fasen/${phase.id}`" class="node-content">
            <div class="node-circle" :style="{ borderColor: getPhaseColor(index) }">
              <span v-if="phase.status === 'afgerond'" class="check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span v-else>{{ phase.id }}</span>
            </div>
            <div class="node-info">
              <h3>{{ phase.name }}</h3>
              <p>{{ phase.description }}</p>
              <div class="node-meta">
                <span class="status-badge small" :class="getStatusClass(phase.status)">
                  {{ phase.status }}
                </span>
                <span class="criteria-progress">
                  {{ getCriteriaProgress(phase) }}% criteria
                </span>
                <span v-if="phase.budget" class="phase-budget">
                  {{ formatCurrency(phase.budget) }}
                </span>
              </div>
            </div>
          </RouterLink>
          <div v-if="phase.status === 'go-no-go'" class="go-no-go-indicator">
            Go/No-Go
          </div>
        </div>
      </div>
    </div>

    <!-- Phase Cards Grid -->
    <div class="phase-grid">
      <RouterLink
        v-for="(phase, index) in store.phases"
        :key="phase.id"
        :to="`/fasen/${phase.id}`"
        class="phase-card"
        :class="{ active: phase.status === 'actief', done: phase.status === 'afgerond' }"
      >
        <div class="card-header">
          <div class="phase-indicator" :style="{ backgroundColor: getPhaseColor(index) }">
            {{ phase.id }}
          </div>
          <span class="status-badge small" :class="getStatusClass(phase.status)">
            {{ phase.status }}
          </span>
        </div>
        <h3>{{ phase.name }}</h3>
        <div class="progress-row">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: getCriteriaProgress(phase) + '%', backgroundColor: getPhaseColor(index) }"></div>
          </div>
          <span class="progress-text">{{ getCriteriaProgress(phase) }}%</span>
        </div>
        <div class="card-footer">
          <span>{{ phase.goNoGoCriteria.filter(c => c.completed).length }}/{{ phase.goNoGoCriteria.length }} criteria</span>
          <span v-if="phase.budget">{{ formatCurrency(phase.budget) }}</span>
        </div>
      </RouterLink>
    </div>

    <!-- Legend -->
    <div class="legend">
      <div class="legend-item">
        <span class="legend-dot status-niet-gestart"></span>
        <span>Niet gestart</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot status-actief"></span>
        <span>Actief</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot status-go-no-go"></span>
        <span>Go/No-Go</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot status-afgerond"></span>
        <span>Afgerond</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.planning {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.subtitle {
  margin: 0.25rem 0 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.budget-summary {
  text-align: right;
}

.budget-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.budget-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

/* Timeline */
.timeline {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
}

.timeline-track {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.timeline-node {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-left: 2.5rem;
  padding-bottom: 1.5rem;
}

.timeline-node:last-child {
  padding-bottom: 0;
}

.node-connector {
  position: absolute;
  left: 15px;
  top: -1.5rem;
  bottom: 50%;
  width: 2px;
  background: var(--color-border);
}

.timeline-node.done .node-connector {
  background: #10b981;
}

.timeline-node.active .node-connector,
.timeline-node.go-no-go .node-connector {
  background: var(--color-primary);
}

.timeline-node::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 15px;
  bottom: 0;
  width: 2px;
  background: var(--color-border);
}

.timeline-node:last-child::before {
  display: none;
}

.timeline-node.done::before {
  background: #10b981;
}

.timeline-node.active::before {
  background: linear-gradient(to bottom, var(--color-primary), var(--color-border));
}

.node-content {
  display: flex;
  gap: 1rem;
  text-decoration: none;
  flex: 1;
}

.node-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  position: absolute;
  left: 0;
}

.timeline-node.active .node-circle,
.timeline-node.go-no-go .node-circle {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.timeline-node.done .node-circle {
  border-color: #10b981;
  background: #10b981;
  color: white;
}

.check-icon svg {
  width: 16px;
  height: 16px;
}

.node-info {
  flex: 1;
}

.node-info h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text);
}

.node-info p {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.node-meta {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  align-items: center;
}

.status-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.small {
  font-size: 0.65rem;
}

.status-actief { background: #dbeafe; color: #1d4ed8; }
.status-niet-gestart { background: #f3f4f6; color: #6b7280; }
.status-go-no-go { background: #fef3c7; color: #d97706; }
.status-afgerond { background: #d1fae5; color: #059669; }

.criteria-progress {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.phase-budget {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.go-no-go-indicator {
  position: absolute;
  right: 0;
  top: 0;
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Phase Grid */
.phase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.phase-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.phase-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.phase-card.active {
  border-color: var(--color-primary);
}

.phase-card.done {
  opacity: 0.7;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.phase-indicator {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
}

.phase-card h3 {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text);
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  min-width: 2.5rem;
  text-align: right;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* Legend */
.legend {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.status-niet-gestart { background: #9ca3af; }
.legend-dot.status-actief { background: #3b82f6; }
.legend-dot.status-go-no-go { background: #f59e0b; }
.legend-dot.status-afgerond { background: #10b981; }

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .budget-summary {
    text-align: left;
  }
}
</style>
