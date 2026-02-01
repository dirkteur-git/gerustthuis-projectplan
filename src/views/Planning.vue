<script setup>
import { planning, fasen } from '../data/projectplan.js'

function getFaseKleur(faseId) {
  const kleuren = {
    1: '#3b82f6', // blauw
    2: '#10b981', // groen
    3: '#f59e0b', // oranje
    4: '#8b5cf6', // paars
    5: '#ec4899'  // roze
  }
  return kleuren[faseId] || '#6b7280'
}

function getFaseNaam(faseId) {
  const fase = fasen.find(f => f.id === faseId)
  return fase ? `Fase ${faseId}` : ''
}

const huidigeIndex = 1 // Februari 2026
</script>

<template>
  <div class="planning">
    <h1>Planning 2026</h1>
    <p class="intro">Tijdlijn van het GerustThuis project met milestones per maand.</p>

    <div class="timeline">
      <div class="timeline-header">
        <div class="month-labels">
          <span v-for="(item, index) in planning" :key="index" class="month-label" :class="{ current: index === huidigeIndex }">
            {{ item.maand.split(' ')[0] }}
          </span>
        </div>
      </div>

      <div class="fase-tracks">
        <div v-for="fase in fasen" :key="fase.id" class="fase-track">
          <div class="fase-label">
            <span class="fase-nummer">{{ fase.id }}</span>
            <span class="fase-naam">{{ fase.naam.split(':')[1]?.trim() || fase.naam }}</span>
          </div>
          <div class="track-bars">
            <div
              v-for="(item, index) in planning"
              :key="index"
              class="track-cell"
              :class="{ current: index === huidigeIndex, active: item.fasen.includes(fase.id) }"
            >
              <div
                v-if="item.fasen.includes(fase.id)"
                class="track-bar"
                :style="{ backgroundColor: getFaseKleur(fase.id) }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="milestones">
        <div class="milestone-header">Milestones</div>
        <div class="milestone-grid">
          <div
            v-for="(item, index) in planning"
            :key="index"
            class="milestone-cell"
            :class="{ current: index === huidigeIndex }"
          >
            <ul class="milestone-list">
              <li v-for="milestone in item.milestones" :key="milestone">
                {{ milestone }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="legenda">
      <h3>Legenda</h3>
      <div class="legenda-items">
        <div v-for="fase in fasen" :key="fase.id" class="legenda-item">
          <span class="legenda-kleur" :style="{ backgroundColor: getFaseKleur(fase.id) }"></span>
          <span>Fase {{ fase.id }}: {{ fase.naam.split(':')[1]?.trim() || fase.naam }}</span>
        </div>
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

.planning h1 {
  margin: 0;
  color: var(--color-text);
}

.intro {
  color: var(--color-text-secondary);
  margin: 0;
}

.timeline {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.timeline-header {
  padding: 1rem 1rem 0;
}

.month-labels {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  margin-left: 160px;
}

.month-label {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  padding: 0.5rem;
}

.month-label.current {
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
}

.fase-tracks {
  padding: 0 1rem;
}

.fase-track {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.fase-track:last-child {
  border-bottom: none;
}

.fase-label {
  width: 160px;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.fase-nummer {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.fase-naam {
  font-size: 0.875rem;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-bars {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 2px;
}

.track-cell {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 4px;
}

.track-cell.current {
  background: rgba(59, 130, 246, 0.05);
}

.track-bar {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  opacity: 0.8;
}

.milestones {
  border-top: 1px solid var(--color-border);
  padding: 1rem;
}

.milestone-header {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  margin-left: 160px;
}

.milestone-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.5rem;
  margin-left: 160px;
}

.milestone-cell {
  padding: 0.5rem;
  border-radius: 6px;
}

.milestone-cell.current {
  background: rgba(59, 130, 246, 0.05);
}

.milestone-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.milestone-list li {
  padding: 0.25rem 0;
  border-bottom: 1px dashed var(--color-border);
}

.milestone-list li:last-child {
  border-bottom: none;
}

.legenda {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

.legenda h3 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--color-text);
}

.legenda-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.legenda-kleur {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
</style>
