<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { exportData } from './stores/projectStore.js'
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <RouterLink to="/" class="logo">GerustThuis</RouterLink>
        <nav class="nav">
          <RouterLink to="/" class="nav-link">Dashboard</RouterLink>
          <RouterLink to="/fasen" class="nav-link">Fasen</RouterLink>
          <RouterLink to="/tickets" class="nav-link">Tickets</RouterLink>
          <RouterLink to="/planning" class="nav-link">Tijdlijn</RouterLink>
        </nav>
        <button class="export-btn" @click="exportData" title="Exporteer als JSON">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
    </header>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: white;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
}

.export-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  width: 100%;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: space-between;
  }

  .nav-link {
    font-size: 0.8rem;
  }
}
</style>
