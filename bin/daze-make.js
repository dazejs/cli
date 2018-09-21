#!/usr/bin/env node

const program = require('commander')

const makeLib = require('../lib/make/index')

program
  .option('-r, --resource', 'make framework file')
  .parse(process.argv)


makeLib(program)
