/* eslint-disable global-require */
/* eslint-disable import/no-commonjs */

// transform async...await for node < 8
if (process.version.slice(1).split('.')[0] < 8) {
  require('async-to-gen/register');
}

// load ENV Variables for development
require('dotenv').config();

// make import...export available natively
require('@std/esm');

module.exports = require('./es6-loader');
