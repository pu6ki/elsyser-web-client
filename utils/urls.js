const host = `https://elsyser.herokuapp.com/api/`

export let urls = {
  auth: {
    login: `${host}login/`,
    register: `${host}register/`
  },
  exams: `${host}exams/`,
  subjects: `${host}subjects/`,
  grades: `${host}grades/`,
  classes: `${host}classes/`,
  students: `${host}students/`,
  profile: `${host}profile/`,
  news: {
    teachers: `${host}news/teachers/`,
    students: `${host}news/students/`
  },
  homeworks: `${host}homeworks/`,
  materials: `${host}materials/`
}