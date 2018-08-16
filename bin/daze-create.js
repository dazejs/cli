#!/usr/bin/env node

const program = require('commander')
const createLib = require('../lib/create')

program
  .option('-f, --force', 'force installation without npm install')
  .parse(process.argv)

createLib(program)