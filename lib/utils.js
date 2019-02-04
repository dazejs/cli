const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const nunjucks = require('nunjucks')
const pluralize = require('pluralize')

exports.firstUpperCase = function (str) {
  return str.replace(/\b(\w)/g, function($1) {
    return $1.toUpperCase()
  })
}

exports.make = function (arg, targetPath, templatePath, templateFile, ext = '') {
  const pathObj = path.parse(arg)
  if (pathObj.ext !== '.js') {
    pathObj.ext = '.js'
  }
  pathObj.base = `${pathObj.name}${ext ? ext : ''}${pathObj.ext}`

  const env = nunjucks.configure(templatePath)

  const assigns = {
    name: exports.firstUpperCase(pathObj.name),
    names: pluralize(pathObj.name)
  }

  const targetCustomPath = path.join(targetPath, pathObj.dir)
  const result = env.render(templateFile, assigns)
  try {
    if (!fs.existsSync(targetCustomPath)) {
      fs.mkdirSync(targetCustomPath)
    }

    const target = path.join(targetPath, path.format(pathObj))
    if (fs.existsSync(target)) {
      console.log(chalk.red(`${pathObj.name} has exists!`))
      return
    }
    fs.writeFileSync(target, result, 'utf8')
    console.log(chalk.green(`create ${pathObj.name} success!`))
  } catch (err) {
    console.log(err)
    console.log(chalk.red(`create ${pathObj.name} error`))
  }
}
