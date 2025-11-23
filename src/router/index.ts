import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const HistoryView = () => import('@/views/HistoryView.vue')
const TypesView = () => import('@/views/TypesView.vue')
const ProductsView = () => import('@/views/ProductsView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/types',
      name: 'types',
      component: TypesView
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router

