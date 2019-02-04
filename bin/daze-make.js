#!/usr/bin/env node

const program = require('commander')

const makeLib = require('../lib/make/index')

program
  .option('-r, --resource', 'make resource controller')
  .option('-n, --no-ext', 'make file no type ext')
  .parse(process.argv)


makeLib(program)
