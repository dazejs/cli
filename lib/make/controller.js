const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const Metalsmith = require('metalsmith')

const cwd = process.cwd()

const targetPath = path.join(cwd, `./src/app/Controllers`)
const baseControlerTemplatePath = path.resolve(__dirname, '../../template/controller/index.js')
const restControllerTemplatePath = path.resolve(__dirname, '../../template/controller/resource.js')

module.exports = function (program) {
  const args = program.args

  const pathObj = path.parse(args[0])
  if (pathObj.ext !== '.js') {
    pathObj.ext = '.js'
  }
  if (pathObj.name.slice(-10) !== 'Controller') {
    pathObj.name = `${pathObj.name}Controller`
  }

  pathObj.base = `${pathObj.name}${pathObj.ext}`

  const templatePath = program.resource ? restControllerTemplatePath : baseControlerTemplatePath

  try {

    const targetCustomPath = path.join(targetPath, pathObj.dir)

    if (!fs.existsSync(targetCustomPath)) {
      fs.mkdirSync(targetCustomPath)
    }
    const target = path.join(targetPath, path.format(pathObj))
    if (fs.existsSync(target)) {
      console.log(chalk.red(`${pathObj.name} has exists!`))
      return
    }
    const templateFile = fs.readFileSync(templatePath, 'utf-8')
    const res = templateFile.replace(/__name__/g, pathObj.name)
    fs.writeFileSync(target, res, 'utf8')
    console.log(chalk.green(`create ${pathObj.name} success!`))
  } catch (err) {
    console.log(err)
    console.log(chalk.red('create controller error'))
  }
}