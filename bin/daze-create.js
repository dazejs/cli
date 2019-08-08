
const program = require('commander');
const Create = require('../lib/create');

program
  .option('-f, --force', 'force installation without npm install')
  .option('-b, --branch', 'install which branch in github')
  .parse(process.argv);

(async () => {
  await (new Create(program)).handle();
})();
