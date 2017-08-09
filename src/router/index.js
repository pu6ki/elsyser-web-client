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

import Profile from '../components/profile-components/Profile'
import EditProfile from '../components/profile-components/EditProfile'

import AllMaterials from '../components/materials-components/AllMaterials'
import Material from '../components/materials-components/Material'
import AddMaterial from '../components/materials-components/AddMaterial'
import EditMaterial from '../components/materials-components/EditMaterial'

import AllHomeworks from '../components/homeworks-components/AllHomeworks'
import Homework from '../components/homeworks-components/Homework'
import AddHomework from '../components/homeworks-components/AddHomework'
import AddSubmission from '../components/homeworks-components/AddSubmission'
import EditSubmission from '../components/homeworks-components/EditSubmission'

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
          component: AllExams
        },
        {
          path: 'add',
          name: 'AddExam',
          component: AddExam
        },
        {
          path: ':id',
          name: 'Exam',
          component: Exam
        },
        {
          path: ':id/edit',
          name: 'EditExam',
          component: EditExam
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      component: RouterTemplate,
      children: [
        {
          path: ':id',
          name: 'Profile',
          component: Profile
        },
        {
          path: ':id/edit',
          name: 'EditProfile',
          component: EditProfile
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/materials',
      component: RouterTemplate,
      children: [
        {
          path: 'all',
          name: 'AllMaterials',
          component: AllMaterials
        },
        {
          path: ':subjectId/:id',
          name: 'Material',
          component: Material
        },
        {
          path: ':subjectId/:id/edit',
          name: 'EditMaterial',
          component: EditMaterial
        },
        {
          path: 'add',
          name: 'AddMaterial',
          component: AddMaterial
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/homeworks',
      component: RouterTemplate,
      children: [
        {
          path: 'all',
          name: 'AllHomeworks',
          component: AllHomeworks
        },
        {
          path: 'add',
          name: 'AddHomework',
          component: AddHomework
        },
        {
          path: ':id',
          name: 'Homework',
          component: Homework
        },
        {
          path: ':id/send',
          name: 'AddSubmission',
          component: AddSubmission
        },
        {
          path: ':homeworkId/submissions/:submissionId/edit',
          name: 'EditSubmission',
          component: EditSubmission
        }
      ],
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('elsyserToken')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token === 'null') {
      next({
        path: '/auth/login',
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
