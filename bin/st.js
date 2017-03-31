#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const syncServices = require('./utils/sync-service');
const services = require('./services');
const childProcess = require('child_process');
const options = require('./utils/options');
const moment = require('moment');
const fs = require('fs');

if (process.env.SEEDTAG_HOME && process.env.SEEDTAG_HOME.indexOf('~') !== -1) {
  throw new Error('SEEDTAG_HOME cannot contain ~, use absolute paths');
}

const runScript = (scriptPath, args) => {
  const proc = childProcess.spawn(scriptPath, args, options.execOpts);
  proc.stdout.on('data', data => process.stdout.write(data.toString()));
  proc.stderr.on('data', data => process.stderr.write(chalk.yellow(data.toString())));
  proc.on('exit', code => console.log(code.toString()));
};

const PLUGINS_DIR = `${__dirname}/st-plugins`;
const pluginFiles = fs.readdirSync(PLUGINS_DIR);
pluginFiles.forEach(file => {
  const name = file.replace('.js', '');
  const plugin = require(`${PLUGINS_DIR}/${name}`);
  Object.keys(plugin).forEach(key => {
    const command = plugin[key];
    program
      .command(command.command)
      .description(command.description)
      .action(command.action);
  });
});

program
  .command('sync [services...]')
  .description('If no services option is provided, sync all services')
  .action(servicesArg => {
    console.log(servicesArg);
    const servicesToSync = servicesArg.length !== 0 ? servicesArg : Object.keys(services);
    return syncServices(servicesToSync);
  });

program
  .command('db_dump')
  .description('Make a dump of production db in initial-data/backup-YYYYMMDD')
  .action(() => runScript('bin/utils/dump-database.sh', []));

program
  .command('db_restore [backupName]')
  .description('Restore a previously made backup. If no backupName it will restore today')
  .action(() => {
    const backupName = program.backupName || `backup-${moment().format('YYYYMMDD')}`;
    return runScript('bin/utils/restore-database.sh', [backupName]);
  });

program
  .command('ui')
  .action(() => {
    require('./ui'); // eslint-disable-line
  });

program
  .command('*')
  .action(() => {
    program.help(); // eslint-disable-line
  });

program.parse(process.argv);

