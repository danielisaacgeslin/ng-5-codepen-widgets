const childProcess = require('child_process');
const Promise = require('bluebird');
const exec = Promise.promisify(childProcess.exec);
const fs = require('fs');
const services = require('../services.js');

function run(cmd, args) {
  console.log(cmd, args);
  const proc = childProcess.spawnSync(cmd, args, { stdio: 'inherit' });
};

function findTier(n) {
  return Object.keys(services).map(k => [k, services[k]])
    .filter(([k, x]) => x.tier == n)
    .map(([k, x]) => k)
}

const tier = {
  command: 'tier <n>',
  description: 'Starts tier <n>',
  action: (n) => {
    let services = [];
    if (n == 0) {
      services = services.concat(['kafka', 'zookeeper', 'mongo', 'redis']);
    }
    services = services.concat(findTier(n));
    run('/bin/bash', ['-c', `docker-compose restart ${services.join(' ')}`]);
  }
};

module.exports = {
  tier
};
