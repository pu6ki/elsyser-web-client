import requester from './requester'

export default {
  isTeacher: (token) => {
    if (token) {
      if (token.length === 41 && token[40] === '1') {
        return true
      }
    }

    return false
  },
  insertLineBreaks: (content) => {
    return content.replace(/[\n]/g, '<br />')
  },
  setTeacherSubjectToLocalStorage: () => {
    const profileUrl = `/profile/${window.localStorage.getItem('elsyserId')}/`
    requester.get(profileUrl)
      .then((result) => {
        window.localStorage.setItem(`elsyserTeacherSubjectId`, result.data.subject.id)
      })
  },
  attachEvaluationWords: (mark) => {
    if (mark <= 6.00 && mark >= 5.50) {
      return `Excellent ${mark}`
    } else if (mark < 5.50 && mark >= 4.50) {
      return `Very Good ${mark}`
    } else if (mark < 4.50 && mark >= 3.50) {
      return `Good ${mark}`
    } else if (mark < 3.50 && mark >= 3.00) {
      return `Average ${mark}`
    } else {
      return `Poor ${mark}`
    }
  },
  setNewsUrl: () => {
    return isTeacher(window.localStorage.getItem('elsyser-token')) ? // eslint-disable-line
      'https://elsyser.herokuapp.com/api/news/teachers/' : // eslint-disable-line
      'https://elsyser.herokuapp.com/api/news/students/'
  }
}