const path = require('path')
const { firstUpperCase , make} = require('../utils')

const cwd = process.cwd()
const targetPath = path.join(cwd, `./src/app`)

module.exports = function (program) {
  const args = program.args
  let ext = ''
  if (program.ext) {
    ext = '.module'
  }
  make(args[1], targetPath, path.join(__dirname, '../../template/module'), 'base.njk', ext)
}