const childProcess = require('child_process');
const Repository = require('../utils/Repository');

function run(cmd, args) {
  console.log(cmd, args);
  childProcess.spawn(cmd, args, { stdio: 'inherit' });
}

function findTier(n) {
  const repos = Repository.getAll();
  const servicesInTier = [];
  for (const repo of repos) {
    repo.services
      .filter(svc => svc.tier === n)
      .forEach(svc => servicesInTier.push(svc));
  }
  return servicesInTier;
}

const tier = {
  command: 'tier <n>',
  description: 'Starts tier <n>',
  action: (n) => {
    n = parseInt(n, 10);
    let services = [];
    if (n === 0) {
      run('/bin/bash', ['-c', `docker-compose up -d ${Repository.baseServices.join(' ')}`]);
      services = services.concat(Repository.baseServices);
    }
    findTier(n)
      .forEach(svc => {
        const args = [];
        if (svc.dcFile) {
          args.push(`-f ${svc.dcFile}`);
        }
        args.push(`up -d ${svc.name}`);
        run('/bin/bash', ['-c', `sleep 30 ; docker-compose ${args.join(' ')}`]);
        services.push(svc.name);
      });

    run('/bin/bash', ['-i', '-c', `sleep 60 ; docker-compose logs -f --tail=100 ${services.join(' ')}`]);
  }
};

module.exports = {
  tier
};
