<script setup>
import { fasen, acties, budget } from '../data/projectplan.js'
import { computed } from 'vue'

const actieveFasen = computed(() => fasen.filter(f => f.status === 'actief'))
const totaalVoortgang = computed(() => {
  const totaal = fasen.reduce((sum, f) => sum + f.voortgang, 0)
  return Math.round(totaal / fasen.length)
})
const voltooideActies = computed(() => acties.filter(a => a.status === 'voltooid').length)
const actieveActies = computed(() => acties.filter(a => a.status === 'actief').length)
const budgetPercentage = computed(() => Math.round((budget.uitgegeven / budget.totaal) * 100))
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>GerustThuis Projectplan</h1>
      <p class="subtitle">Overzicht van het project voor thuiszorg monitoring</p>
    </section>

    <section class="stats">
      <div class="stat-card">
        <span class="stat-value">{{ totaalVoortgang }}%</span>
        <span class="stat-label">Totale voortgang</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ fasen.length }}</span>
        <span class="stat-label">Fasen</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ voltooideActies }}/{{ acties.length }}</span>
        <span class="stat-label">Acties voltooid</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ budgetPercentage }}%</span>
        <span class="stat-label">Budget gebruikt</span>
      </div>
    </section>

    <section class="active-phases">
      <h2>Actieve Fasen</h2>
      <div class="phase-cards">
        <div v-for="fase in actieveFasen" :key="fase.id" class="phase-card">
          <h3>{{ fase.naam }}</h3>
          <p>{{ fase.beschrijving }}</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: fase.voortgang + '%' }"></div>
          </div>
          <span class="progress-text">{{ fase.voortgang }}% voltooid</span>
        </div>
      </div>
    </section>

    <section class="current-actions">
      <h2>Huidige Acties ({{ actieveActies }})</h2>
      <ul class="action-list">
        <li v-for="actie in acties.filter(a => a.status === 'actief')" :key="actie.id" class="action-item">
          <span class="action-priority" :class="actie.prioriteit">{{ actie.prioriteit }}</span>
          <div class="action-content">
            <strong>{{ actie.titel }}</strong>
            <span class="action-owner">{{ actie.verantwoordelijke }}</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  text-align: center;
  padding: 2rem 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 1.125rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-primary);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.active-phases h2,
.current-actions h2 {
  margin-bottom: 1rem;
  color: var(--color-text);
}

.phase-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.phase-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
}

.phase-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
}

.phase-card p {
  color: var(--color-text-secondary);
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

.progress-bar {
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.action-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

.action-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.action-priority.hoog {
  background: #fee2e2;
  color: #dc2626;
}

.action-priority.medium {
  background: #fef3c7;
  color: #d97706;
}

.action-priority.laag {
  background: #d1fae5;
  color: #059669;
}

.action-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.action-owner {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
</style>
