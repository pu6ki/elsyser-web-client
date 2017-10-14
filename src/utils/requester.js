import axios from 'axios'

let config = {}
let token = window.localStorage.getItem('elsyserToken')

if (token !== 'null' && token) {
  token = token.slice(0, 40)
  config.headers = { 'Authorization': `Token ${token}` }
}

let apiUrl = process.env.API_URL

let requester = {
  get: (url, params) => {
    config.params = params
    return axios.get(apiUrl + url + '/', config)
  },
  post: (url, data, params) => {
    config.params = params
    return axios.post(apiUrl + url + '/', data, config)
  },
  put: (url, data, params) => {
    config.params = params
    return axios.put(apiUrl + url + '/', data, config)
  },
  delete: (url, params) => {
    config.params = params
    return axios.delete(apiUrl + url + '/', config)
  }
}

export default requester
