#!/usr/bin/env node

const program = require('commander');

if (process.env.SEEDTAG_HOME && process.env.SEEDTAG_HOME.indexOf('~') !== -1) {
  throw new Error('SEEDTAG_HOME cannot contain ~, use absolute paths');
}

program
  .version('0.1')
  .command('sync [repos]', 'If no repos option is provided, sync all repos')
  .command('dump', 'Make a dump of production db in initial-data/backup-YYYYMMDD')
  .command('restore [backupName]',
    'Restore a previously made backup. If no backupName it will restore today')
  .command('ui', 'Launch graphical interface to manage repositories', { isDefault: true })
  .command('kc [queue]', 'Starts a kafka consumer. Default queue: tasks')
  .command('kp [queue]', 'Starts a kafka producer. Default queue: tasks')
  .command('fixture [fixtures...]', 'Load user fixture into the running Mongo, whatever it is')
  .command('up [services...]', 'Starts services, if svc arg not provided, svc of cwd')
  .command('stop [services...]', 'Stop services, if svc arg not provided, svc of cwd')
  .command('t [service]', 'Touches some .js file so that the app is restarted by nodemon')
  .command('sh [service] [command...]',
    'default service: guessed by current directory; default command: bash')
  .command('r [service]', 'Restarts a service. default service: guessed by current directory')
  .parse(process.argv);
