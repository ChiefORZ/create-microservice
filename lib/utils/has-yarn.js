const {which} = require('shelljs')

let cmd

module.exports = function getInstallCmd () {
  if (cmd) {
    return cmd
  }

  cmd = Boolean(which('yarn'))

  return cmd
}
