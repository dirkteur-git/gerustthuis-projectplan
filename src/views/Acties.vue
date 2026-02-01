<script setup>
import { acties, fasen } from '../data/projectplan.js'
import { ref, computed } from 'vue'

const filterStatus = ref('alle')
const filterFase = ref('alle')

const filteredActies = computed(() => {
  return acties.filter(actie => {
    const statusMatch = filterStatus.value === 'alle' || actie.status === filterStatus.value
    const faseMatch = filterFase.value === 'alle' || actie.faseId === parseInt(filterFase.value)
    return statusMatch && faseMatch
  })
})

const statusCounts = computed(() => ({
  alle: acties.length,
  voltooid: acties.filter(a => a.status === 'voltooid').length,
  actief: acties.filter(a => a.status === 'actief').length,
  gepland: acties.filter(a => a.status === 'gepland').length
}))

function getFaseNaam(faseId) {
  const fase = fasen.find(f => f.id === faseId)
  return fase ? fase.naam.replace('Fase ', '').split(':')[0] : ''
}

function getStatusClass(status) {
  return {
    'actief': 'status-actief',
    'voltooid': 'status-voltooid',
    'gepland': 'status-gepland'
  }[status] || ''
}

function getPriorityClass(prioriteit) {
  return {
    'hoog': 'priority-hoog',
    'medium': 'priority-medium',
    'laag': 'priority-laag'
  }[prioriteit] || ''
}
</script>

<template>
  <div class="acties">
    <h1>Alle Acties</h1>

    <div class="filters">
      <div class="filter-group">
        <label>Status</label>
        <div class="filter-buttons">
          <button
            v-for="status in ['alle', 'voltooid', 'actief', 'gepland']"
            :key="status"
            :class="{ active: filterStatus === status }"
            @click="filterStatus = status"
          >
            {{ status.charAt(0).toUpperCase() + status.slice(1) }}
            <span class="count">{{ statusCounts[status] }}</span>
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label>Fase</label>
        <select v-model="filterFase">
          <option value="alle">Alle fasen</option>
          <option v-for="fase in fasen" :key="fase.id" :value="fase.id">
            {{ fase.naam }}
          </option>
        </select>
      </div>
    </div>

    <div class="actie-grid">
      <div v-for="actie in filteredActies" :key="actie.id" class="actie-card">
        <div class="actie-header">
          <span class="fase-tag">{{ getFaseNaam(actie.faseId) }}</span>
          <span class="status-badge" :class="getStatusClass(actie.status)">
            {{ actie.status }}
          </span>
        </div>

        <h3>{{ actie.titel }}</h3>
        <p>{{ actie.beschrijving }}</p>

        <div class="actie-footer">
          <span class="priority" :class="getPriorityClass(actie.prioriteit)">
            {{ actie.prioriteit }}
          </span>
          <span class="owner">{{ actie.verantwoordelijke }}</span>
        </div>
      </div>
    </div>

    <p v-if="filteredActies.length === 0" class="no-results">
      Geen acties gevonden met de huidige filters.
    </p>
  </div>
</template>

<style scoped>
.acties {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.acties h1 {
  margin: 0;
  color: var(--color-text);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.filter-buttons button:hover {
  border-color: var(--color-primary);
}

.filter-buttons button.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.filter-buttons .count {
  padding: 0.125rem 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
  font-size: 0.75rem;
}

.filter-buttons button.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: 200px;
}

.actie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.actie-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.actie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fase-tag {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-actief {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-voltooid {
  background: #d1fae5;
  color: #059669;
}

.status-gepland {
  background: #f3f4f6;
  color: #6b7280;
}

.actie-card h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text);
}

.actie-card p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  flex: 1;
}

.actie-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.priority {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.priority-hoog {
  background: #fee2e2;
  color: #dc2626;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-laag {
  background: #d1fae5;
  color: #059669;
}

.owner {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.no-results {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem;
}
</style>
