'use strict';

const childProcess = require('child_process');
const baseExecOpts = require('../utils/options').execOpts;
const Promise = require('bluebird');

const exec = Promise.promisify(childProcess.exec);
const execOpts = Object.assign({ stdio: 'inherit' }, baseExecOpts);

function run(cmd, args) {
  console.log(cmd, args);
  childProcess.spawnSync(cmd, args, execOpts);
}

async function guess(service) {
  const dirName = process.env.PWD.replace(/.*\//, '');
  if (!service || service === '_' || service === '-') service = dirName;
  if (service === 'tms') service = 'tag-manager-service';

  const containers = await exec('docker-compose ps', execOpts);
  const containerNames = containers
    .split('\n')
    .filter(y => y && y.includes(`_${service}`))
    .map(y => y.split(' ')[0]);

  if (containerNames && containerNames.length === 1) {
    return /.*_(.*)_.*/.exec(containerNames[0], execOpts)[1];
  }
  throw new Error(`Can't find a service with name ${service}`);
}

const up = {
  command: 'up [services...]',
  description: 'Starts services, if services not provided, starts service of the current directory',
  action: async services => {
    if (services.length === 0) services = [await guess()];
    return run('/bin/bash', ['-i', '-c',
      `"docker-compose up -t 120 ${services.join(' ')}"`]);
  }
};

const stop = {
  command: 'stop [services...]',
  description: 'Stop services, if services not provided, starts service of the current directory',
  action: async (services) => {
    if (services.length === 0) services = [await guess()];
    return run('/bin/bash', ['-i', '-c',
      `"docker-compose stop ${services.join(' ')}"`]);
  }
};

const touch = {
  command: 't [service]',
  description: 'Touches some .js file so that the app is restarted by nodemon',
  action: async (service) => {
    if (!service) service = await guess();
    run('/bin/bash', ['-i', '-c',
      `"find ${service} -maxdepth 2 ! -path '*node_modules/*' -name *.js | head -n 1 | \
xargs touch"`]);
  }
};

const sh = {
  command: 'sh [service] [command...]',
  description: 'default service: guessed by current directory; default command: bash',
  action: async (service, commandArr) => {
    service = await guess(service);
    const command = commandArr.length === 0 ? 'bash' : commandArr.join(' ');
    run('/bin/bash', ['-i', '-c', `"docker-compose exec ${service} ${command}"`]);
  }
};

const test = {
  command: 'test [service] [command]',
  description: 'default service: guessed by current directory; default command: yarn test',
  action: async (service, command) => {
    service = await guess(service);
    command = command || 'yarn test';
    run('/bin/bash', ['-i', '-c', `"docker-compose exec ${service} ${command}"`]);
  }
};

const restart = {
  command: 'r [service]',
  description: 'Restarts a service. default service: guessed by current directory',
  action: async (service) => {
    service = await guess(service);
    run('/bin/bash', ['-i', '-c', `"docker-compose restart ${service}"`]);
  }
};

const yarn = {
  command: 'yarn [service]',
  description: 'default service: guessed by current directory; default command: yarn',
  action: async (service) => {
    service = await guess(service);
    const command = 'yarn';
    run('/bin/bash', ['-i', '-c', `"docker-compose exec ${service} ${command}"`]);
  }
};

module.exports = {
  up,
  stop,
  sh,
  test,
  restart,
  yarn,
  touch
};
