if (process.version.slice(1).split('.')[0] < 8) {
  require('async-to-gen/register')
}

require('@std/esm')

module.exports = require('./es6-loader')
