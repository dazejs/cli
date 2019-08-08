const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const request = require('request');
const fs = require('fs');
const os = require('os');
const tar = require('tar');
const childProcess = require('child_process');

// 执行命令的目录
const cwd = process.cwd();

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

    /**
     * @var {string} version release version
     */
    this.version = this.formatVersion(program.args[1]);

    /**
     * @var {string} remoteReleaseAddress github release api address
     */
    this.remoteReleaseAddress = this.getRemoteReleaseAddress(program.args[1]);

    /**
     * @var {string} releaseCachePath release cache path
     */
    this.releaseCachePath = path.join(os.homedir(), '.dazejs', 'releases');
  }

  /**
   * return format version string
   * @param {string} versionArg commander version arg
   */
  formatVersion(versionArg) {
    if (!versionArg) return '';
    return versionArg.slice(0, 1) === 'v' ? versionArg : `v${versionArg}`;
  }

  /**
   * return remote release api address
   * @param {*} versionArg
   */
  getRemoteReleaseAddress(versionArg) {
    if (!versionArg) return 'https://api.github.com/repos/dazejs/daze/releases/latest';
    return `https://api.github.com/repos/dazejs/daze/releases/tags/${versionArg}`;
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
    console.log('');
    console.log(`Creating new daze.js project in ${chalk.green(this.targetPath)}`);
    console.log('');

    if (this.version) { // 指定版本
      const versionTempFilePath = path.resolve(this.releaseCachePath, `${this.version}.tar.gz`);
      // 已在存在缓存
      if (fs.existsSync(versionTempFilePath)) {
        console.log('');
        console.log(chalk.green(`Found the release:${chalk.green(this.version)} in cache...`));
        console.log('');
        this.createProject(versionTempFilePath);
      } else { // 不存在缓存, 从远程下载
        // this.downloadRelease(this.version);
        const data = await this.getReleaseInfo();
        this.downloadRelease(data.tarball_url, this.version || data.tag_name);
      }
    } else { // 未指定版本，获取最新 release
      const data = await this.getReleaseInfo();
      this.downloadRelease(data.tarball_url, this.version || data.tag_name);
    }
  }

  getReleaseInfo() {
    console.log(chalk.green('Get the latest release info from Github...'));
    return new Promise((resolve, reject) => {
      request({
        url: this.remoteReleaseAddress,
        headers: {
          'User-Agent': 'dazejs',
        },
      }, (error, response, body) => {
        let data;
        try {
          if (error) throw error;
          data = JSON.parse(body);
          if (response.statusCode === 200 && data.tag_name) {
            console.log(chalk.green(`Success! Found latest release[${data.tag_name}]`));
            resolve(data);
          } else {
            throw new Error(chalk.red(`Release [${this.version}] not found!`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  createProject(sourceFilePath) {
    if (!fs.existsSync(this.targetPath)) {
      fs.mkdirSync(this.targetPath, {
        recursive: true,
      });
    }

    const unpackSpinner = ora({
      text: 'Unpacking release...',
    });

    fs.createReadStream(sourceFilePath).pipe(tar.x({
      strip: 1,
      C: this.targetPath,
    })).on('close', () => {
      unpackSpinner.stop();
      this.npmInstall();
    }).on('error', (err) => {
      unpackSpinner.stop();
      console.error(err);
      process.exit(1);
    });
  }

  downloadRelease(url, tagName) {
    const downloadSpinner = ora({
      text: `Downloading release:${tagName} from Github...`,
    });
    const sourceFilePath = path.resolve(this.releaseCachePath, `${tagName}.tar.gz`);
    downloadSpinner.start();
    request({
      url,
      headers: {
        'User-Agent': 'dazejs',
      },
      followAllRedirects: true,
    }).on('end', () => {
      downloadSpinner.stopAndPersist({
        text: 'Download success! ',
        symbol: '✅',
      });
      this.createProject(sourceFilePath);
    }).on('error', (err) => {
      downloadSpinner.stop();
      console.error(err);
    })
      .pipe(fs.createWriteStream(sourceFilePath));
  }


  npmInstall() {
    // 不安装依赖
    if (!this.autoInstall) {
      console.log('');
      console.log('you can run command by youself:');
      console.log('   npm install');
      console.log('');
      this.logPowerby();
      return;
    }
    // 开始安装依赖
    console.log('Auto installing dependencies with command: npm install...');
    childProcess.execSync('npm install', {
      cwd: this.targetPath,
      stdio: 'inherit',
    });
    console.log('');
    console.log(chalk.green('npm install end'));
    this.logPowerby();
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
