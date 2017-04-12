const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');
const guess = require('./utils/guess-service');

program
  .parse(process.argv);

const service = program.args[0] || guess();
childProcess.spawn('st', ['sh', service,
  '\'bash -c "find . -maxdepth 2 ! -path \\"*node_modules/*\\" -name *.js | head -n 1 | xargs touch"\''],
  options.vexecOpts);
