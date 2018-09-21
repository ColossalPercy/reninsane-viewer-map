'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const GOOGLE_API_KEY = require('./google-api-key')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GOOGLE_API_KEY: GOOGLE_API_KEY.DEV
})
