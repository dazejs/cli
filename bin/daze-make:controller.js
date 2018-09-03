#!/usr/bin/env node

const program = require('commander')

const makeControllerLib = require('../lib/make/controller')

program
  .option('-r, --resource', 'create resource controller')
  .parse(process.argv)


makeControllerLib(program)
