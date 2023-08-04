import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router'

import Home from '@/views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HOME',
    component: Home
  }
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes: routes
})
export default router
