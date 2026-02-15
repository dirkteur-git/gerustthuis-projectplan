import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/roadmap',
    name: 'Roadmap',
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
  },
  {
    path: '/wachtlijst',
    name: 'Wachtlijst',
    component: () => import('../views/Wachtlijst.vue')
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('../views/Marketing.vue')
  },
  {
    path: '/huishoudens',
    name: 'Huishoudens',
    component: () => import('../views/Huishoudens.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
