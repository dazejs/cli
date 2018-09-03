#!/usr/bin/env node

const program = require('commander')
const packageObject = require('../package.json')

program
  .version(packageObject.version, '-v, --version')

program
  .command('create', 'create new daze project')
  .command('make:controller <controllerName>', 'create new daze controller')

program.parse(process.argv)


