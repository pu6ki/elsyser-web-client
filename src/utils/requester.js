import axios from 'axios'

let config = {}
let token = window.localStorage.getItem('elsyserToken')

if (token !== 'null') {
  token = token.slice(0, 40)
  config.headers = { 'Authorization': `Token ${token}` }
}

let apiUrl = 'https://elsyser.herokuapp.com/api'

let requester = {
  get: (url) => {
    return axios.get(apiUrl + url, config)
  },
  post: (url, data) => {
    return axios.post(apiUrl + url + '/', data, config)
  },
  put: (url, data) => {
    return axios.put(apiUrl + url + '/', data, config)
  },
  delete: (url) => {
    return axios.delete(apiUrl + url + '/', config)
  }
}

export default requester
