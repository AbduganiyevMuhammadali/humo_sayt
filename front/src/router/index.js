import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/services/:slug',
    name: 'service',
    component: () => import('../views/ServiceView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../components/admin/AdminPanel.vue'),
  },
  // noma'lum yo'llar — bosh sahifaga
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 90 }
    return { top: 0 }
  },
})
