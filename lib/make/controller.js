const path = require('path')
const chalk = require('chalk')

const cwd = process.cwd()

function getControllerName(name) {
  const noExtName = name.slice(-3) === '.js' ? name.substring(0, name.length - 3) : name
  const noControllerName = noExtName.slice(-10) === 'Controller' ? noExtName.substring(0, name.length - 10) : noExtName
  return `${noControllerName}Controller.js`
}

module.exports = function (program) {
  const args = program.args
  const controllerName = getControllerName(args[0])
  const targetControllerPath = path.join(cwd, `./server/app/Controllers/${controllerName}`)
  let templatePath = path.resolve(__dirname, '../../template/controller/resource.js')
  if (!program.resource) {
    templatePath = path.resolve(__dirname, '../../template/controller/index.js')
  }
  try {
    fs.copySync(templatePath, targetControllerPath)
  } catch (err) {
    console.log(chalk.red('create controller error'))
  }
}