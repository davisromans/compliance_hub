// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue') 
  },
  {
    path: '/p/:projectCode/privacy',
    name: 'PrivacyPolicy',
    component: () => import('../views/public/PrivacyPolicy.vue')
  },
  {
    path: '/p/:projectCode/delete-account',
    name: 'DeleteAccount',
    component: () => import('../views/public/DeleteAccount.vue')
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/Login.vue')
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router