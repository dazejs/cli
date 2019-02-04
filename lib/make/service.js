const path = require('path')
const { make } = require('../utils')

const cwd = process.cwd()
const targetPath = path.join(cwd, `./src/app/service`)

module.exports = function (program) {
  const args = program.args
  make(args[1], targetPath, path.join(__dirname, '../../template/service'), 'base.njk')
}