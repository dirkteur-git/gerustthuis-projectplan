import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/fasen',
    name: 'Fasen',
    component: () => import('../views/Fasen.vue')
  },
  {
    path: '/fasen/:id',
    name: 'FaseDetail',
    component: () => import('../views/FaseDetail.vue')
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: () => import('../views/Tickets.vue')
  },
  {
    path: '/planning',
    name: 'Planning',
    component: () => import('../views/Planning.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
