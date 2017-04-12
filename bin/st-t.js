const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');
const guess = require('./utils/guess-service');

const execOpts = options.vexecOpts;

program
  .parse(process.argv);

const service = program.args[0] || guess();
childProcess.spawn('/bin/bash', ['-i', '-c',
  `"find ${service} -maxdepth 2 ! -path '*node_modules/*' -name *.js | head -n 1 | \
xargs touch"`], execOpts);
