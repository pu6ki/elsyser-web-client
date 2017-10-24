var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SECRET: '"PuRpl3r@1N"',
  API_URL: '"https://elsyser-dev.herokuapp.com/api"'
})
