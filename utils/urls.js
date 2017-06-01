const host = `https://elsyser.herokuapp.com`

export let urls = {
  auth: {
    login: `${host}/api/login/`,
    register: `${host}/api/register/`
  },
  exams: `${host}/api/exams/`,
  subjects: `${host}/api/subjects/`,
  grades: `${host}/api/grades/`,
  classes: `${host}/api/classes/`,
  students: `${host}/api/students/`,
  profile: `${host}/api/profile/`,
  news: {
    teachers: `${host}/api/news/teachers/`,
    students: `${host}/api/news/students/`
  },
  homeworks: `${host}/api/homeworks/`,
  materials: `${host}/api/materials/`
}