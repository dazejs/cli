const path = require('path')
const { firstUpperCase, make } = require('../utils')

const cwd = process.cwd()
const targetPath = path.join(cwd, `./src/app/transformer`)

module.exports = function (program) {
  const args = program.args
  make(args[1], targetPath, path.join(__dirname, '../../template/transformer'), 'base.njk')
}