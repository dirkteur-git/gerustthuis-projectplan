<script setup>
import { fasen, acties } from '../data/projectplan.js'
import { computed } from 'vue'

const fasenMetActies = computed(() => {
  return fasen.map(fase => ({
    ...fase,
    acties: acties.filter(a => a.faseId === fase.id)
  }))
})

function getStatusClass(status) {
  return {
    'actief': 'status-actief',
    'voltooid': 'status-voltooid',
    'gepland': 'status-gepland'
  }[status] || ''
}

function getStatusLabel(status) {
  return {
    'actief': 'Actief',
    'voltooid': 'Voltooid',
    'gepland': 'Gepland'
  }[status] || status
}
</script>

<template>
  <div class="fasen">
    <h1>Projectfasen</h1>
    <p class="intro">Het GerustThuis project is opgedeeld in 5 fasen, van technisch fundament tot schaalbaarheid.</p>

    <div class="fase-list">
      <div v-for="fase in fasenMetActies" :key="fase.id" class="fase-card">
        <div class="fase-header">
          <div class="fase-title">
            <h2>{{ fase.naam }}</h2>
            <span class="status-badge" :class="getStatusClass(fase.status)">
              {{ getStatusLabel(fase.status) }}
            </span>
          </div>
          <p class="fase-beschrijving">{{ fase.beschrijving }}</p>
        </div>

        <div class="fase-meta">
          <div class="meta-item">
            <span class="meta-label">Periode</span>
            <span class="meta-value">{{ fase.startDatum }} - {{ fase.eindDatum }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Voortgang</span>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: fase.voortgang + '%' }"></div>
              </div>
              <span class="progress-value">{{ fase.voortgang }}%</span>
            </div>
          </div>
        </div>

        <div class="fase-acties">
          <h3>Acties ({{ fase.acties.length }})</h3>
          <ul class="actie-list">
            <li v-for="actie in fase.acties" :key="actie.id" class="actie-item">
              <span class="actie-status" :class="getStatusClass(actie.status)"></span>
              <span class="actie-titel">{{ actie.titel }}</span>
              <span class="actie-verantwoordelijke">{{ actie.verantwoordelijke }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fasen {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.fasen h1 {
  margin: 0;
  color: var(--color-text);
}

.intro {
  color: var(--color-text-secondary);
  margin: 0;
}

.fase-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.fase-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.fase-header {
  margin-bottom: 1rem;
}

.fase-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.fase-title h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
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

.fase-beschrijving {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.fase-meta {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.meta-value {
  font-weight: 500;
  color: var(--color-text);
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
}

.progress-value {
  font-weight: 600;
  color: var(--color-primary);
  min-width: 3rem;
}

.fase-acties {
  margin-top: 1rem;
}

.fase-acties h3 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.actie-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.actie-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.actie-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.actie-status.status-voltooid {
  background: #10b981;
}

.actie-status.status-actief {
  background: #3b82f6;
}

.actie-status.status-gepland {
  background: #9ca3af;
}

.actie-titel {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text);
}

.actie-verantwoordelijke {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
</style>
