<script setup>
import { RouterLink } from 'vue-router'
import { store, getCriteriaProgress, getTicketsByPhase, getEpicsByPhase } from '../stores/projectStore.js'

function getStatusClass(status) {
  return {
    'actief': 'status-actief',
    'niet gestart': 'status-niet-gestart',
    'go-no-go': 'status-go-no-go',
    'afgerond': 'status-afgerond'
  }[status] || ''
}

function formatTargetDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('nl-NL', { year: 'numeric', month: 'short' })
}
</script>

<template>
  <div class="objectives">
    <div class="header-row">
      <div>
        <h1>Objectives</h1>
        <p class="intro">{{ store.phases.length }} objectives met go/no-go beslismomenten</p>
      </div>
    </div>

    <div class="objective-grid">
      <RouterLink
        v-for="phase in store.phases"
        :key="phase.id"
        :to="`/fasen/${phase.id}`"
        class="objective-card"
        :class="{ active: phase.status === 'actief', 'go-no-go': phase.status === 'go-no-go' }"
      >
        <div class="objective-header">
          <span class="objective-number">{{ phase.id }}</span>
          <span class="status-badge" :class="getStatusClass(phase.status)">
            {{ phase.status }}
          </span>
        </div>

        <h2>{{ phase.name }}</h2>
        <p class="objective-goal" v-if="phase.goal">{{ phase.goal }}</p>
        <p class="objective-description" v-else>{{ phase.description }}</p>

        <div class="objective-meta">
          <span v-if="phase.targetDate" class="meta-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
            </svg>
            {{ formatTargetDate(phase.targetDate) }}
          </span>
          <span class="meta-tag epics-count">
            {{ getEpicsByPhase(phase.id).length }} epics
          </span>
        </div>

        <div class="objective-stats">
          <div class="stat">
            <span class="stat-value">{{ getCriteriaProgress(phase) }}%</span>
            <span class="stat-label">Criteria</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ getTicketsByPhase(phase.id).filter(t => t.status === 'done').length }}/{{ getTicketsByPhase(phase.id).length }}</span>
            <span class="stat-label">Tickets</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ getEpicsByPhase(phase.id).length }}</span>
            <span class="stat-label">Epics</span>
          </div>
        </div>

        <div class="criteria-preview">
          <div class="criteria-bar">
            <div
              class="criteria-fill"
              :style="{ width: getCriteriaProgress(phase) + '%' }"
            ></div>
          </div>
          <span class="criteria-count">
            {{ phase.goNoGoCriteria.filter(c => c.completed).length }}/{{ phase.goNoGoCriteria.length }} criteria voltooid
          </span>
        </div>

        <div v-if="phase.measurement" class="measurement-preview">
          <strong>Meting:</strong> {{ phase.measurement }}
        </div>

        <div v-if="phase.status === 'go-no-go'" class="go-no-go-badge">
          Go/No-Go beslissing nodig
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.objectives {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.objectives h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text);
}

.intro {
  margin: 0.25rem 0 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.objective-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.objective-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
  text-decoration: none;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.objective-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.objective-card.active {
  border-color: var(--color-primary);
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.03), transparent);
}

.objective-card.go-no-go {
  border-color: #f59e0b;
  background: linear-gradient(to bottom, rgba(245, 158, 11, 0.05), transparent);
}

.objective-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.objective-number {
  width: 32px;
  height: 32px;
  background: var(--color-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.objective-card.active .objective-number {
  background: var(--color-primary);
  color: white;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-actief { background: #dbeafe; color: #1d4ed8; }
.status-niet-gestart { background: #f3f4f6; color: #6b7280; }
.status-go-no-go { background: #fef3c7; color: #d97706; }
.status-afgerond { background: #d1fae5; color: #059669; }

.objective-card h2 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--color-text);
}

.objective-goal,
.objective-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.objective-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  background: var(--color-background);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.meta-tag.epics-count {
  color: #7c3aed;
  background: #ede9fe;
}

.objective-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.criteria-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.criteria-bar {
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.criteria-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.3s;
}

.criteria-count {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.measurement-preview {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  line-height: 1.4;
}

.measurement-preview strong {
  color: var(--color-text);
}

.go-no-go-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
