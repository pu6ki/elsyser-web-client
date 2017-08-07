import Vue from 'vue'
import Router from 'vue-router'
import RouterTemplate from '../components/RouterTemplate'
import Home from '../components/Home'
import Login from '../components/authentication-components/Login'
import Register from '../components/authentication-components/Register'
import ActivateAccount from '../components/authentication-components/ActivateAccount'
import AllExams from '../components/exams-components/AllExams'
import AddExam from '../components/exams-components/AddExam'
import Exam from '../components/exams-components/Exam'
import EditExam from '../components/exams-components/EditExam'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/auth',
      component: RouterTemplate,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        },
        {
          path: 'activate/:activationId',
          name: 'ActivateAccount',
          component: ActivateAccount
        }
      ]
    },
    {
      path: '/exams',
      component: RouterTemplate,
      children: [
        {
          path: 'all',
          component: AllExams,
          meta: { requiresAuth: true }
        },
        {
          path: 'add',
          name: 'AddExam',
          component: AddExam,
          meta: { requiresAuth: true }
        },
        {
          path: ':id',
          name: 'Exam',
          component: Exam,
          meta: { requiresAuth: true }
        },
        {
          path: ':id/edit',
          name: 'EditExam',
          component: EditExam,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('elsyserToken')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token === 'null') {
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
