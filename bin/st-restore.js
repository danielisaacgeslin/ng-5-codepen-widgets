const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');
const moment = require('moment');

program
  .parse(process.argv);

const inputBackupName = program.args.length !== 0 && program.args[0];
const backupName = inputBackupName || `backup-${moment().format('YYYYMMDD')}`;
childProcess.spawn('bin/utils/restore-database.sh', [backupName], options.vexecOpts);
