<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="placeholder-page">
    <RouterLink to="/" class="back-link">← Home</RouterLink>
    <div class="placeholder-content">
      <div class="placeholder-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      </div>
      <h1>Marketing</h1>
      <p>Campagne statistieken, ad performance en conversie data.</p>
      <span class="coming-soon">Binnenkort beschikbaar</span>
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  max-width: 600px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.back-link:hover {
  text-decoration: underline;
}

.placeholder-content {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.placeholder-icon {
  color: #8b5cf6;
  margin-bottom: 1rem;
}

.placeholder-content h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text);
}

.placeholder-content p {
  margin: 0.5rem 0 1.5rem;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.coming-soon {
  display: inline-block;
  background: #f3f4f6;
  color: var(--color-text-secondary);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
