import { createRouter, createWebHashHistory, createWebHistory, type RouterOptions } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: RouterOptions["routes"] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/booleanOperations',
    name: 'boolean operations',
    component: () => import('@/views/BooleanOperationsView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('../views/AboutView.vue')
    component: () => import("@/views/AboutView.vue")
  }
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: routes
})

export { routes, router as default }
