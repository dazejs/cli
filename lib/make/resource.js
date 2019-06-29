const path = require('path')
const { firstUpperCase, make } = require('../utils')

const cwd = process.cwd()
const targetPath = path.join(cwd, `./src/app`)

module.exports = function (program) {
  const args = program.args
  make(args[1], targetPath, path.join(__dirname, '../../template/resource'), 'base.njk')
}