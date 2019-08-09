const path = require('path');
const { make } = require('../utils');

const cwd = process.cwd();
const targetPath = path.join(cwd, './src/app');

module.exports = (program) => {
  const { args } = program;
  make(args[1], targetPath, path.join(__dirname, '../../template/component'), 'base.njk');
};
