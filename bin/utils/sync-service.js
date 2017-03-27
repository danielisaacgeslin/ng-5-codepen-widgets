const chalk = require('chalk');
const git = require('simple-git/promise');
const Promise = require('bluebird');
const childProcess = require('child_process');
const exec = Promise.promisify(childProcess.exec);
const os = require('os');
const path = require('path');
const Service = require('./Service');
const stat = Promise.promisify(require('fs').stat);

// SEEDTAG_HOME or ~/seedtag
const cwd = process.env.SEEDTAG_HOME || path.join(os.homedir(), 'seedtag');
const execOpts = { cwd, maxBuffer: 200 * 1024 * 1024 };

const addToHosts = service => {
  if (service.domain) return exec('echo "127.0.0.1 ${service.domain}" | sudo tee -a /etc/hosts');
  return Promise.resolve();
};

const setup = service =>
  exec(`git clone git@github.com:seedtag/${service.name}.git`, { cwd })
    .then(() => addToHosts(service));

const getOrSetupRepo = service => {
  const repoDir = path.join(cwd, service.path);
  return stat(repoDir)
    // Directory exists, just return repo
    .then(() => git(repoDir))
    // Directory does not exist, setup it and return repo
    .catch(() => {
      console.log('Repo of %s not present, cloning it', service.name);
      return setup(service)
      .then(() => git(repoDir));
    });
};

const canBePulled = status => {
  if (status.current !== 'master') return [false, 'Could not sync service outside master'];
  if (status.ahead > 0) return [false, 'You cannot be ahead master, please push'];
  if (status.conflicted.length !== 0) return [false, 'You have conflicted files'];
  if (status.created.length !== 0) return [false, 'You have created files'];
  if (status.deleted.length !== 0) return [false, 'You have deleted files'];
  if (status.modified.length !== 0) return [false, 'You have modified files'];
  if (status.renamed.length !== 0) return [false, 'You have renamed files'];
  return [true, null];
};

const dbCommand = (service, command) => {
  let completeCommand = 'docker-compose ';
  if (service.dcFile) completeCommand += `-f ${service.dcFile} `;
  return completeCommand + command;
};

const pulledServices = [];
const syncService = serviceName => {
  const service = new Service(serviceName);
  let repo;
  return getOrSetupRepo(service)
    .then(repo1 => {
      repo = repo1;
      return repo.status();
    })
    .then(status => {
      if (pulledServices.indexOf(serviceName) !== -1) return null;
      pulledServices.push(serviceName);
      const [canPull, reason] = canBePulled(status);
      if (!canPull) throw new Error(reason);
      console.log('Pulling repo...');
      return repo.pull();
    })
    .then(() => {
      console.log('Building and loading %s', service.name);
      return exec(dbCommand(service, `up -d --no-deps --build -t 300 ${service.name}`), execOpts);
    })
    .then(() => {
      console.log('Installing dependencies of %s', service.name);
      return exec(dbCommand(service, `exec ${service.name} yarn`), execOpts);
    })
    .then(() => {
      console.log('Restarting %s to apply changes', service.name);
      return exec(dbCommand(service, `restart ${service.name}`), execOpts);
    })
    .then(() => console.log(chalk.green(`${serviceName} successfully synced`)))
    .catch(err => {
      console.log(chalk.red(`${serviceName} couldn't be synced due to ${err}`));
      throw err;
    });
};

module.exports = serviceList => {
  console.log('Loading base services...');
  return exec(`docker-compose up -d --no-deps ${Service.baseServices.join(' ')}`, execOpts)
  .then(() => Promise.all(serviceList.map(s => syncService(s))))
  .then(() => {
    console.log('Everything went perfect');
    process.exit(0);
  })
  .catch(err => {
    console.log(chalk.red('Could not sync some service'));
    console.log(err);
  });
};
