<script setup>
import { budget } from '../data/projectplan.js'
import { computed } from 'vue'

const budgetPercentage = computed(() => Math.round((budget.uitgegeven / budget.totaal) * 100))
const budgetResterend = computed(() => budget.totaal - budget.uitgegeven)

function formatCurrency(amount) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
}

function getCategoriePercentage(categorie) {
  return Math.round((categorie.uitgegeven / categorie.budget) * 100)
}

function getProgressClass(percentage) {
  if (percentage >= 90) return 'progress-danger'
  if (percentage >= 70) return 'progress-warning'
  return 'progress-normal'
}
</script>

<template>
  <div class="budget">
    <h1>Budget Overzicht</h1>

    <div class="budget-summary">
      <div class="summary-card main">
        <div class="summary-header">
          <h2>Totaal Budget</h2>
          <span class="summary-value">{{ formatCurrency(budget.totaal) }}</span>
        </div>
        <div class="progress-bar large">
          <div class="progress-fill" :class="getProgressClass(budgetPercentage)" :style="{ width: budgetPercentage + '%' }"></div>
        </div>
        <div class="summary-stats">
          <div class="stat">
            <span class="stat-label">Uitgegeven</span>
            <span class="stat-value">{{ formatCurrency(budget.uitgegeven) }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Resterend</span>
            <span class="stat-value">{{ formatCurrency(budgetResterend) }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Percentage</span>
            <span class="stat-value">{{ budgetPercentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="categories">
      <h2>Budget per Categorie</h2>
      <div class="category-grid">
        <div v-for="categorie in budget.categorieen" :key="categorie.naam" class="category-card">
          <div class="category-header">
            <h3>{{ categorie.naam }}</h3>
            <span class="category-percentage" :class="getProgressClass(getCategoriePercentage(categorie))">
              {{ getCategoriePercentage(categorie) }}%
            </span>
          </div>

          <div class="category-amounts">
            <span>{{ formatCurrency(categorie.uitgegeven) }}</span>
            <span class="separator">/</span>
            <span class="total">{{ formatCurrency(categorie.budget) }}</span>
          </div>

          <div class="progress-bar">
            <div
              class="progress-fill"
              :class="getProgressClass(getCategoriePercentage(categorie))"
              :style="{ width: getCategoriePercentage(categorie) + '%' }"
            ></div>
          </div>

          <ul class="item-list">
            <li v-for="item in categorie.items" :key="item.naam" class="budget-item">
              <span class="item-naam">{{ item.naam }}</span>
              <span class="item-bedrag">{{ formatCurrency(item.bedrag) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="budget-table">
      <h2>Gedetailleerd Overzicht</h2>
      <table>
        <thead>
          <tr>
            <th>Categorie</th>
            <th>Item</th>
            <th class="right">Bedrag</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="categorie in budget.categorieen" :key="categorie.naam">
            <tr v-for="(item, index) in categorie.items" :key="item.naam">
              <td v-if="index === 0" :rowspan="categorie.items.length" class="category-cell">
                {{ categorie.naam }}
              </td>
              <td>{{ item.naam }}</td>
              <td class="right">{{ formatCurrency(item.bedrag) }}</td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2"><strong>Totaal Uitgegeven</strong></td>
            <td class="right"><strong>{{ formatCurrency(budget.uitgegeven) }}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.budget {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.budget h1 {
  margin: 0;
  color: var(--color-text);
}

.budget h2 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: var(--color-text);
}

.budget-summary {
  display: grid;
  gap: 1rem;
}

.summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.summary-card.main {
  background: linear-gradient(135deg, var(--color-primary), #1d4ed8);
  color: white;
  border: none;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar.large {
  height: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-normal {
  background: #10b981;
}

.progress-warning {
  background: #f59e0b;
}

.progress-danger {
  background: #ef4444;
}

.summary-card.main .progress-bar {
  background: rgba(0, 0, 0, 0.2);
}

.summary-card.main .progress-fill {
  background: white;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.category-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.category-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text);
}

.category-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.category-percentage.progress-normal {
  background: #d1fae5;
  color: #059669;
}

.category-percentage.progress-warning {
  background: #fef3c7;
  color: #d97706;
}

.category-percentage.progress-danger {
  background: #fee2e2;
  color: #dc2626;
}

.category-amounts {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.category-amounts .separator {
  margin: 0 0.25rem;
}

.category-amounts .total {
  color: var(--color-text);
}

.category-card .progress-bar {
  background: var(--color-border);
  margin-bottom: 1rem;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
}

.budget-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.item-naam {
  color: var(--color-text-secondary);
}

.item-bedrag {
  font-weight: 500;
  color: var(--color-text);
}

.budget-table {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

td {
  font-size: 0.875rem;
  color: var(--color-text);
}

.category-cell {
  font-weight: 500;
  vertical-align: top;
  border-right: 1px solid var(--color-border);
}

.right {
  text-align: right;
}

tfoot td {
  border-bottom: none;
  border-top: 2px solid var(--color-border);
  padding-top: 1rem;
}
</style>
