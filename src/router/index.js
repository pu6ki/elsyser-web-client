import Vue from 'vue'
import Router from 'vue-router'
import RouterTemplate from '../components/RouterTemplate'

import Home from '../components/Home'

import Login from '../components/authentication-components/Login'
import Register from '../components/authentication-components/Register'
import ActivateAccount from '../components/authentication-components/ActivateAccount'
import ResetPassword from '../components/authentication-components/ResetPassword.vue'
import NewPassword from '../components/authentication-components/NewPassword.vue'

import AllExams from '../components/exams-components/AllExams'
import AddExam from '../components/exams-components/AddExam'
import Exam from '../components/exams-components/Exam'
import EditExam from '../components/exams-components/EditExam'

import Profile from '../components/profile-components/Profile'
import EditProfile from '../components/profile-components/EditProfile'
import ChangePassword from '../components/profile-components/ChangePassword.vue'

import AllMaterials from '../components/materials-components/AllMaterials'
import Material from '../components/materials-components/Material'
import AddMaterial from '../components/materials-components/AddMaterial'
import EditMaterial from '../components/materials-components/EditMaterial'

import AllHomeworks from '../components/homeworks-components/AllHomeworks'
import Homework from '../components/homeworks-components/Homework'
import AddHomework from '../components/homeworks-components/AddHomework'
import EditHomework from '../components/homeworks-components/EditHomework'
import AllSubmissions from '../components/homeworks-components/AllSubmissions'
import Submission from '../components/homeworks-components/Submission'
import AddSubmission from '../components/homeworks-components/AddSubmission'
import EditSubmission from '../components/homeworks-components/EditSubmission'

import AllNews from '../components/news-components/AllNews'
import News from '../components/news-components/News'
import AddNews from '../components/news-components/AddNews'
import EditNews from '../components/news-components/EditNews'

import AllGrades from '../components/grades-components/AllGrades'
import SelectClass from '../components/grades-components/SelectClass'
import ClassGrades from '../components/grades-components/ClassGrades'
import AddGrades from '../components/grades-components/AddGrades'

import AllMeetups from '../components/talks-components/AllMeetups'
import Talk from '../components/talks-components/Talk'
import AddTalk from '../components/talks-components/AddTalk'
import EditTalk from '../components/talks-components/EditTalk'

import NotFound from '../components/NotFound'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
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
        },
        {
          path: 'password/reset',
          name: 'ResetPassword',
          component: ResetPassword
        },
        {
          path: 'password/reset/confirm/:uid/:token',
          name: 'NewPassword',
          component: NewPassword
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
        },
        {
          path: ':id/password-change',
          name: 'ChangePassword',
          component: ChangePassword
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
          path: ':homeworkId',
          name: 'Homework',
          component: Homework
        },
        {
          path: ':id/edit',
          name: 'EditHomework',
          component: EditHomework
        },
        {
          path: ':id/send',
          name: 'AddSubmission',
          component: AddSubmission
        },
        {
          path: ':homeworkId/submissions/',
          name: 'AllSubmissions',
          component: AllSubmissions
        },
        {
          path: ':homeworkId/submissions/:submissionId/',
          name: 'Submission',
          component: Submission
        },
        {
          path: ':homeworkId/submissions/:submissionId/edit',
          name: 'EditSubmission',
          component: EditSubmission
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/news',
      component: RouterTemplate,
      children: [
        {
          path: 'teachers',
          name: 'TeachersAllNews',
          component: AllNews
        },
        {
          path: 'teachers/:classNumber',
          name: 'TeachersAllNewsForClass',
          component: AllNews
        },
        {
          path: 'students',
          name: 'StudentsAllNews',
          component: AllNews
        },
        {
          path: 'students/:id',
          name: 'StudentNews',
          component: News
        },
        {
          path: 'teachers/:classNumber/:classLetter/:id',
          name: 'TeacherNews',
          component: News
        },
        {
          path: 'add',
          name: 'AddNews',
          component: AddNews
        },
        {
          path: 'students/:id/edit',
          name: 'EditStudentNews',
          component: EditNews
        },
        {
          path: 'teachers/:classNumber/:classLetter/:id/edit',
          name: 'EditTeacherNews',
          component: EditNews
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/grades',
      component: RouterTemplate,
      children: [
        {
          path: 'all',
          name: 'AllGrades',
          component: AllGrades
        },
        {
          path: 'select-class',
          name: 'SelectClass',
          component: SelectClass
        },
        {
          path: ':classNumber/:classLetter',
          name: 'ClassGrades',
          component: ClassGrades
        },
        {
          path: ':classNumber/:classLetter/add',
          name: 'AddGrades',
          component: AddGrades
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/meetups',
      component: RouterTemplate,
      children: [
        {
          path: 'all',
          name: 'AllMeetups',
          component: AllMeetups
        },
        {
          path: 'addTalk',
          name: 'AddTalk',
          component: AddTalk
        },
        {
          path: ':meetupId/talks/:talkId',
          name: 'Talk',
          component: Talk
        },
        {
          path: ':meetupId/talks/:talkId/edit',
          name: 'EditTalk',
          component: EditTalk
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
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
