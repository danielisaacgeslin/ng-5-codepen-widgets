'use strict';

const childProcess = require('child_process');
const services = require('../services.js');

function run(cmd, args) {
  console.log(cmd, args);
  childProcess.spawnSync(cmd, args, { stdio: 'inherit' });
}

function findTier(n) {
  return Object.keys(services).map(k => [k, services[k]])
    .filter(([k, x]) => x.tier === n)
    .map(([k, x]) => k);
}

const tier = {
  command: 'tier <n>',
  description: 'Starts tier <n>',
  action: (n) => {
    let svcs = [];
    if (n === 0) {
      svcs = svcs.concat(['kafka', 'zookeeper', 'mongo', 'redis']);
    }
    svcs = svcs.concat(findTier(n));
    run('/bin/bash', ['-c', `docker-compose restart ${svcs.join(' ')}`]);
  }
};

module.exports = {
  tier
};
