const chalk = require('chalk')
const path = require('path')
const download = require('download-git-repo')
const ora = require('ora')
const exists = require('fs').existsSync
const shell = require('shelljs')

const origin = 'dazejs/daze'
const branch = '#master'

// 执行命令的目录
const cwd = process.cwd()

module.exports = function (program) {
  const args = program.args
  // 自动安装依赖
  const autoInstall = !program.force

  const targetPath = path.join(cwd, args[0] || 'dazejs')

  // 目录已存在
  if (exists(targetPath)) {
    console.log(chalk.red('exit: directory is already exists'))
    return
  }
  const spinner = ora('downloading project from https://github.com/dazejs/daze...')
  spinner.start()
  download(`${origin}${branch}`, targetPath, { clone: false }, function (err) {
    spinner.stop()
    if (err) {
      console.log(chalk.red(`Failed to download repo https://github.com/${origin}${branch}`, err))
    } else {
      console.log(chalk.green(`Success to download repo https://github.com/${origin}${branch} to ${targetPath}`))
      // 不安装依赖
      if (!autoInstall) {
        console.log('')
        console.log('you can run command by youself:')
        console.log('   npm install or cnpm install')
        console.log('')
        return
      }


      // 开始安装依赖
      const spinnerInstall = ora('Auto installing dependencies with command: npm install...')
      spinnerInstall.start()
      shell.exec(`cd ${targetPath} && npm install`, function () {
        console.log('')
        console.log(chalk.green('npm install end'))
        spinnerInstall.stop()
        console.log('')
        console.log('')
        console.log('        ____  ___ _____   ______    _______')
        console.log('       / __ \\/   /__  /  / ____/   / / ___/')
        console.log('      / / / / /| | / /  / __/ __  / /\\__ \ ')
        console.log('     / /_/ / ___ |/ /__/ /___/ /_/ /___/ / ')
        console.log('    /_____/_/  |_/____/_____/\\____//____/  ')
        console.log('')
        console.log('')
        console.log('Visit https://github.com/dazejs/daze to learn more.')
      })
        
    }
  })
}