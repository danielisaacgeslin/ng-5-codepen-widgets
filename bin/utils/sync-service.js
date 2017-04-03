const chalk = require('chalk');
const git = require('simple-git/promise');
const Promise = require('bluebird');
const childProcess = require('child_process');
const exec = Promise.promisify(childProcess.exec);
const os = require('os');
const path = require('path');
const Repository = require('./Repository');
const stat = Promise.promisify(require('fs').stat);

// SEEDTAG_HOME or ~/seedtag
const cwd = process.env.SEEDTAG_HOME || path.join(os.homedir(), 'seedtag');
const execOpts = { cwd, maxBuffer: 200 * 1024 * 1024 };

let loadedBaseServices = false;
const loadBaseServicesIfNeeded = () => {
  if (loadedBaseServices) return Promise.resolve();
  loadedBaseServices = true;
  console.log('Loading base services...');
  return exec(`docker-compose up -d ${Repository.baseServices.join(' ')}`, execOpts);
};

const addToHosts = repo => {
  const domains = repo.services.filter(svc => svc.domain).map(svc => svc.domain);
  return Promise.all(
    domains.map(domain => exec('echo "127.0.0.1 ${domain}" | sudo tee -a /etc/hosts')));
};

const setup = repo =>
  exec(`git clone git@github.com:seedtag/${repo.name}.git`, { cwd })
    .then(() => addToHosts(repo));

const getOrSetupRepo = repo => {
  const repoDir = path.join(cwd, repo.name);
  return stat(repoDir)
    // Directory exists, just return repo
    .then(() => git(repoDir))
    // Directory does not exist, setup it and return repo
    .catch(() => {
      console.log('Repo of %s not present, cloning it', repo.name);
      return setup(repo)
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

const dcCommand = (service, command) => {
  let completeCommand = 'docker-compose ';
  if (service.dcFile) completeCommand += `-f ${service.dcFile} `;
  return completeCommand + command;
};

const syncService = service =>
  exec(dcCommand(service, `up -d --no-deps --build -t 300 ${service.name}`), execOpts)
    .then(() => {
      console.log('Installing dependencies of %s', service.name);
      return exec(dcCommand(service, `exec ${service.name} yarn`), execOpts);
    })
    .then(() => {
      console.log('Restarting %s to apply changes', service.name);
      return exec(dcCommand(service, `restart ${service.name}`), execOpts);
    })
    .then(() => console.log(chalk.green(`${service.name} successfully synced`)))
    .catch(err => console.error(chalk.red(`${service.name} couldn't be synced due to ${err}`)));

const syncRepo = repo => {
  let gitRepo;
  return getOrSetupRepo(repo)
    .then(gitRepoArg => {
      gitRepo = gitRepoArg;
      return gitRepo.status();
    })
    .then(status => {
      const [canPull, reason] = canBePulled(status);
      if (!canPull) throw new Error(reason);
      console.log(`Pulling ${repo.name} repo...`);
      return gitRepo.pull();
    })
    .then(loadBaseServicesIfNeeded)
    .then(() => Promise.all(repo.services.map(svc => syncService(svc))))
    .catch(err => {
      console.log(chalk.red(`${repo.name} couldn't be synced due to ${err}`));
      throw err;
    });
};

module.exports = reposList => {
  Promise.all(reposList.map(r => syncRepo(new Repository(r))))
  .then(repos => {
    console.log('Repositories updated');
    process.exit(0);
  })
  .catch(err => {
    console.log(chalk.red('Could not sync some service'));
    console.log(err);
  });
};
