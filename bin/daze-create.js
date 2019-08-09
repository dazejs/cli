
const program = require('commander');
const Create = require('../lib/create');

program
  .option('-f, --force', 'force installation without npm install')
  .option('-n, --next', 'install the newest version')
  .parse(process.argv);

(async () => {
  await (new Create(program)).handle();
})();
