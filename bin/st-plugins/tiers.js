const childProcess = require('child_process');
const Repository = require('../utils/Repository');

function run(cmd, args) {
  console.log(cmd, args);
  childProcess.spawnSync(cmd, args, { stdio: 'inherit' });
}

function findTier(n) {
  const repos = Repository.getAll();
  const servicesInTier = [];
  for (const repo of repos) {
    repo.services
      .filter(svc => svc.tier === n)
      .forEach(svc => servicesInTier.push(svc.name));
  }
  return servicesInTier;
}

const tier = {
  command: 'tier <n>',
  description: 'Starts tier <n>',
  action: (n) => {
    n = parseInt(n, 10);
    let servicesToRun = [];
    if (n === 0) {
      servicesToRun = servicesToRun.concat(['kafka', 'zookeeper', 'mongo', 'redis']);
    }
    servicesToRun = servicesToRun.concat(findTier(n));
    run('/bin/bash', ['-c', `docker-compose restart ${servicesToRun.join(' ')}`]);
  }
};

module.exports = {
  tier
};
