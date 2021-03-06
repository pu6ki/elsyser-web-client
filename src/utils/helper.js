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
  attachEvaluationWords: (mark) => {
    if (mark <= 6.00 && mark >= 5.50) {
      return `Excellent ${mark}`
    } else if (mark < 5.50 && mark >= 4.50) {
      return `Very Good ${mark}`
    } else if (mark < 4.50 && mark >= 3.50) {
      return `Good ${mark}`
    } else if (mark < 3.50 && mark >= 3.00) {
      return `Average ${mark}`
    } else if (mark >= 2.00) {
      return `Poor ${mark}`
    } else {
      return 'No grades added yet'
    }
  },
  setNewsUrl: () => {
    return isTeacher(window.localStorage.getItem('elsyser-token')) ? // eslint-disable-line
      'https://elsyser.herokuapp.com/api/news/teachers/' : // eslint-disable-line
      'https://elsyser.herokuapp.com/api/news/students/'
  },
  makeYouTubeVideoEmbeddable: (videoUrl) => {
    let youtubeUrl = 'www.youtube.com/'
    let index = videoUrl.indexOf(youtubeUrl) + youtubeUrl.length
    let result = videoUrl.slice(0, index) + 'embed/' + videoUrl.slice(index)

    return result.replace('watch?v=', '')
  },
  extractContent: (html) => {
    let el = document.createElement('div')
    el.innerHTML = html
    return el.textContent || el.innerText
  }
}
