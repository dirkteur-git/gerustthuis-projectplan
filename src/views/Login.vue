<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '../services/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  loading.value = true
  error.value = null

  try {
    await signIn(email.value, password.value)
    router.push('/')
  } catch (e) {
    if (e.message === 'Invalid login credentials') {
      error.value = 'Ongeldige inloggegevens'
    } else {
      error.value = e.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>GerustThuis</h1>
        <p class="subtitle">Admin Portaal</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="je@email.nl"
          >
        </div>

        <div class="field">
          <label for="password">Wachtwoord</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Bezig...' : 'Inloggen' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 1.75rem;
  color: var(--color-primary);
  margin: 0 0 0.25rem;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.field input {
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-surface);
  transition: border-color 0.2s;
}

.field input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.field input::placeholder {
  color: #9ca3af;
}

.error-message {
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: var(--color-danger);
  font-size: 0.875rem;
}

.login-btn {
  padding: 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
