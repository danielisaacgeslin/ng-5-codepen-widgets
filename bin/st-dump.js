const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');

program
  .parse(process.argv);

childProcess.spawn('bin/utils/dump-database.sh', [], options.vexecOpts);
