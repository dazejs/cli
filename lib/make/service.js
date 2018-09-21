const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const nunjucks = require('nunjucks')
const { firstUpperCase } = require('../utils')

const cwd = process.cwd()
const targetPath = path.join(cwd, `./src/app/service`)

module.exports = function (program) {
  const args = program.args

  const pathObj = path.parse(args[1])
  if (pathObj.ext !== '.js') {
    pathObj.ext = '.js'
  }
  pathObj.base = `${pathObj.name}${pathObj.ext}`

  const env = nunjucks.configure(path.join(__dirname, '../../template/service'))

  const assigns = {
    name: firstUpperCase(pathObj.name)
  }

  const targetCustomPath = path.join(targetPath, pathObj.dir)

  const result = env.render('base.njk', assigns)

  try {
    
    // check service path
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath)
    }
    const targetCustomPath = path.join(targetPath, pathObj.dir)
    if (!fs.existsSync(targetCustomPath)) {
      fs.mkdirSync(targetCustomPath)
    }
    const target = path.join(targetPath, path.format(pathObj))
    if (fs.existsSync(target)) {
      console.log(chalk.red(`${pathObj.name} has exists!`))
      return
    }
    fs.writeFileSync(target, result, 'utf8')
    console.log(chalk.green(`create ${pathObj.name} service success!`))
  } catch (err) {
    console.log(err)
    console.log(chalk.red('create service error'))
  }
}