const path = require('path')
const { make } = require('../utils')

const cwd = process.cwd()
const targetPath = path.join(cwd, `./src/app`)

module.exports = function (program) {
  const args = program.args
  if (program.resource) {
    make(args[1], targetPath, path.join(__dirname, '../../template/controller'), 'resource.njk')
  } else {
    make(args[1], targetPath, path.join(__dirname, '../../template/controller'), 'base.njk')
  }
}
