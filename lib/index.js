const path = require('path')
const fs = require('fs-extra')
const output = require('./utils/output')
const copyDir = require('./utils/copy-dir')
const install = require('./utils/install')
const messages = require('./messages')

module.exports = function (opts) {
  const projectName = opts.projectName

  if (!projectName) {
    output.info(messages.missingProjectName())
    process.exit(1)
  }

  if (fs.existsSync(projectName)) {
    output.info(messages.alreadyExists(projectName))
    process.exit(1)
  }

  const projectPath = opts.projectPath = process.cwd() + '/' + projectName

    const templatePath = path.resolve(__dirname, './templates/default')

    copyDir({
      templatePath: templatePath,
      projectPath: projectPath,
      projectName: projectName
    }).then(installWithMessageFactory(opts))
    .catch(function (err) {
      throw err
    })
}

function installWithMessageFactory (opts) {
  const projectName = opts.projectName
  const projectPath = opts.projectPath

  return function installWithMessage () {
    const packageJson = fs.readJsonSync(path.resolve(__dirname, './templates/default', 'package.json'))
    const merged = Object.assign({}, packageJson.dependencies, packageJson.devDependencies)
    const packages = Object.keys(merged).map(item => `${item}@${merged[item]}`)
    return install({
      projectName: projectName,
      projectPath: projectPath,
      packages: packages
    }).then(function () {
      output.info(messages.start(projectName))
    }).catch(function (err) {
      throw err
    })
  }
}
