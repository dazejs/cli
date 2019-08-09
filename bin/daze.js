#!/usr/bin/env node

const program = require('commander');
const packageObject = require('../package.json');

program
  .version(packageObject.version, '-v, --version');

program
  .command('create', 'create new daze.js project');
// .command('make <type> <controllerName>', 'create new daze file');

program.parse(process.argv);
