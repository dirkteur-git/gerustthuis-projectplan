import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/fasen',
    name: 'Fasen',
    component: () => import('../views/Fasen.vue')
  },
  {
    path: '/acties',
    name: 'Acties',
    component: () => import('../views/Acties.vue')
  },
  {
    path: '/planning',
    name: 'Planning',
    component: () => import('../views/Planning.vue')
  },
  {
    path: '/budget',
    name: 'Budget',
    component: () => import('../views/Budget.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
