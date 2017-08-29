const { cd, exec } = require('shelljs')
const Promise = require('promise')
const messages = require('../messages')
const hasYarn = require('./has-yarn')
const output = require('./output')

module.exports = function install(opts) {
  const projectName = opts.projectName
  const projectPath = opts.projectPath
  const packages = opts.packages || []

  if (packages.length === 0) {
    console.log('Missing packages in `install`, try running again.')
    process.exit(1)
  }

  const yarn = hasYarn();
  const installCmd = getInstallCmd(yarn)

  console.log(messages.installing(packages))
  cd(projectPath)

  return new Promise(function (resolve, reject) {
    const stopInstallSpinner = output.wait('Installing modules')
    exec

    exec(installCmd, (code, stdout, stderr) => {
      if (code === 0) {
        stopInstallSpinner()
        output.success(`Installed dependencies for ${projectName}`)
        resolve()
      } else {
        stopInstallSpinner()
        console.log(messages.installError(packages))
        return reject(new Error(`${installCmd} installation failed`))
      }
    })
  })
}

function getInstallCmd(yarn) {
  if (yarn) {
    return 'yarn'
  } else {
    return 'npm install --verbose'
  }
}
