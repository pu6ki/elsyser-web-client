import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '../components/authentication-components/Login'
import Register from '../components/authentication-components/Register'
import ActivateAccount from '../components/authentication-components/ActivateAccount'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/activate/:id/:activationId',
      name: 'ActivateAccount',
      component: ActivateAccount
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('elsyserToken')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
