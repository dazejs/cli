const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const download = require('download-git-repo');
const inquirer = require('inquirer');

// 执行命令的目录
const cwd = process.cwd();

const typescriptStarterRepos = 'dazejs/typescript-starter#master';
const javascriptStarterRepos = 'dazejs/javascript-starter#master';

/* eslint-disable no-console,no-process-exit */
class Create {
  constructor(program) {
    /**
     * @var {object} program commander program
     */
    this.program = program;

    /**
     * @var {boolean} autoInstall should auto install npm deps
     */
    this.autoInstall = !program.force;

    /**
     * @var {string} targetPath project target path
     */
    this.targetPath = path.join(cwd, program.args[0] || 'dazejs');
  }


  /**
   * handle create command
   */
  async handle() {
    // 目录已存在
    if (fs.existsSync(this.targetPath)) {
      // eslint-disable-next-line no-console
      console.log(chalk.red('Exit: Directory is already exists!'));
      process.exit(1);
    }

    const promptList = [
      {
        type: 'list',
        name: 'lang',
        message: 'Which one to use for development?',
        choices: [
          'typescript',
          'javascript',
        ],
      },
      {
        type: 'list',
        name: 'pm',
        message: 'Which package manager you wany?',
        choices: [
          'npm',
          'yarn',
          'cnpm',
        ],
      },
    ];

    const answer = await inquirer.prompt(promptList);

    console.log('');
    console.log(`Creating new daze.js project in ${chalk.green(this.targetPath)}`);
    console.log('');

    if (answer.lang === 'typescript') {
      this.download(typescriptStarterRepos, answer);
    } else {
      this.download(javascriptStarterRepos, answer);
    }
  }


  download(respos, answer) {
    const spinner = ora(`downloading project from https://github.com/${respos}...`);
    spinner.start();
    download(respos, this.targetPath, { clone: false }, (err) => {
      spinner.stop();
      if (err) {
        console.log(chalk.red(`Failed to download repo ${respos}`, err));
      } else {
        this.pkgInstall(answer);
      }
    });
  }

  pkgInstall(answer) {
    // 不安装依赖
    if (!this.autoInstall) {
      console.log('');
      console.log('you can run command by youself:');
      console.log('   npm install');
      console.log('');
      this.logPowerby();
      return;
    }

    const dependencies = ['@dazejs/framework'];
    let command;
    let args = [];
    // 开始安装依赖
    console.log('Auto installing dependencies...');
    if (answer.pm === 'npm') {
      command = 'npm';
      args = [
        'install',
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
      ].concat(dependencies);
      const child = childProcess.spawn(command, args, { cwd: this.targetPath, stdio: 'inherit' });

      child.on('close', (code) => {
        if (code !== 0) {
          console.log('');
          console.log(chalk.red('packages install error'));
          return;
        }
        console.log('');
        console.log(chalk.green('packages install end'));
        this.logPowerby();
      });
    } else if (answer.pm === 'cnpm') {
      command = 'cnpm';
      try {
        childProcess.execSync('cnpm --version', { stdio: 'ignore' });
      } catch (err) {
        console.log(chalk.red('It looks like CNPM is not installed, try: npm install -g cnpm'));
        return;
      }
      args = [
        'install',
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
      ].concat(dependencies);
      const child = childProcess.spawn(command, args, { cwd: this.targetPath, stdio: 'inherit' });

      child.on('close', (code) => {
        if (code !== 0) {
          console.log('');
          console.log(chalk.red('packages install error'));
          return;
        }
        console.log('');
        console.log(chalk.green('packages install end'));
        this.logPowerby();
      });
    } else if (answer.pm === 'yarn') {
      command = 'yarnpkg';
      args = ['add', '--exact'].concat(dependencies);
      const child = childProcess.spawn(command, args, { cwd: this.targetPath, stdio: 'inherit' });
      child.on('close', (code) => {
        if (code !== 0) {
          console.log('');
          console.log(chalk.red('packages install error'));
          return;
        }
        console.log('');
        console.log(chalk.green('packages install end'));
        this.logPowerby();
      });
    }
  }

  logPowerby() {
    console.log('');
    console.log('');
    console.log('        ____  ___ _____   ______    _______');
    console.log('       / __ \\/   /__  /  / ____/   / / ___/');
    console.log('      / / / / /| | / /  / __/ __  / /\\__ \\ ');
    console.log('     / /_/ / ___ |/ /__/ /___/ /_/ /___/ / ');
    console.log('    /_____/_/  |_/____/_____/\\____//____/  ');
    console.log('');
    console.log('');
    console.log('Visit https://dazejs.org/ to learn more.');
  }
}

module.exports = Create;
