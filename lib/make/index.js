
const controllerLib = require('./controller')
const serviceLib = require('./service')

const cwd = process.cwd()

module.exports = function (program) {
  const args = program.args

  const type = args[0]

  switch (type) {
    case 'controller':
      controllerLib(program)
      break
    case 'service':
      serviceLib(program)
      break
    default:
      break
  }
}