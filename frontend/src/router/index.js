// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import PatientDashboard from '../views/PatientDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/patient', name: 'PatientDashboard', component: PatientDashboard },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard moderno (sem next())
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Sempre permite login e register
  if (to.path === '/login' || to.path === '/register') {
    return true  // permite prosseguir
  }

  // Sem token → redireciona para login
  if (!token) {
    return '/login'
  }

  // Tem token, mas tenta acessar /admin sem ser secretary
  if (to.path === '/admin' && role !== 'secretary') {
    return '/patient'
  }

  // Tem token, mas tenta acessar /patient sendo secretary
  if (to.path === '/patient' && role === 'secretary') {
    return '/admin'
  }

  // Tudo ok → prossegue normalmente
  return true
})

export default router