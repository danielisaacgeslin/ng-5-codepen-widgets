'use strict';

const childProcess = require('child_process');
const Promise = require('bluebird');

const exec = Promise.promisify(childProcess.exec);
const baseExecOpts = require('../utils/options').execOpts;
const execOpts = Object.assign({ stdio: 'inherit' }, baseExecOpts);

function run(cmd, args) {
  console.log(cmd, args);
  childProcess.spawnSync(cmd, args, execOpts);
}

function guess(service) {
  const dirName = process.env.PWD.replace(/.*\//, '');
  if (!service || service === '_' || service === '-') {
    service = dirName;
  }
  if (service === 'tms') {
    service = 'tag-manager-service';
  }
  return exec('docker-compose ps', execOpts)
    .then(x => x.split('\n')
      .filter(y => y && y.includes(`_${service}`))
      .map(y => y.split(' ')[0]))
    .then((x) => {
      if (x && x.length === 1) {
        return /.*_(.*)_.*/.exec(x[0], execOpts)[1];
      }
      throw new Error(`Can't find a service with name ${service}`);
    });
}

const up = {
  command: 'up [services...]',
  description: 'Starts docker-compose project in the current directory',
  action: (services) => run('/bin/bash', ['-i', '-c',
    `"docker-compose up -t 120 ${services.join(' ')}"`])
};

const stop = {
  command: 'stop [services...]',
  description: 'Stops docker-compose project in the current directory',
  action: (services) => run('/bin/bash', ['-i', '-c',
    `"docker-compose stop ${services.join(' ')}"`])
};

const kill = {
  command: 'kill',
  description: 'Stops all docker containers',
  action: () => run('/bin/bash', ['-i', '-c', 'docker ps | grep -v CONTA | awk \'{print $1}\' | xargs docker stop'])
};

const touch = {
  command: 't',
  description: 'Touches some .js file so that the app is restarted by nodemon',
  action: () =>
    run('/bin/bash', ['-i', '-c', '"find . src -d 1 -name *.js | head -n 1 | xargs touch"'])
};

const sh = {
  command: 'sh [command] [service]',
  description: 'default service: guessed by current directory; default command: bash',
  action: (command, service) => {
    guess(service)
      .then((svc) => {
        command = command || 'bash';
        run('/bin/bash', ['-i', '-c', `"docker-compose exec ${svc} ${command}"`]);
      });
  }
};

const test = {
  command: 'test [service] [command]',
  description: 'default service: guessed by current directory; default command: yarn test',
  action: (service, command) => {
    guess(service)
      .then((svc) => {
        command = command || 'yarn test';
        run('/bin/bash', ['-i', '-c', `"docker-compose exec ${svc} ${command}"`]);
      });
  }
};

const restart = {
  command: 'r [service]',
  description: 'Restarts a service. default service: guessed by current directory',
  action: (service) => {
    guess(service)
      .then((svc) => {
        run('/bin/bash', ['-i', '-c', `"docker-compose restart ${svc}"`]);
      });
  }
};

const yarn = {
  command: 'yarn [service]',
  description: 'default service: guessed by current directory; default command: yarn',
  action: (service) => {
    guess(service)
      .then((svc) => {
        const command = 'yarn';
        run('/bin/bash', ['-i', '-c', `"docker-compose exec ${svc} ${command}"`]);
      });
  }
};

module.exports = {
  up,
  stop,
  sh,
  test,
  restart,
  yarn,
  touch,
  kill
};
