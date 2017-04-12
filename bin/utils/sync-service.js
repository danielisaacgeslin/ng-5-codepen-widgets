const chalk = require('chalk');
const git = require('simple-git/promise');
const Promise = require('bluebird');
const childProcess = require('child_process');
const os = require('os');
const path = require('path');
const Repository = require('./Repository');
const Service = require('./Service');
const canBePulled = require('./repo-utils').canBePulled;

const exec = Promise.promisify(childProcess.exec);
const stat = Promise.promisify(require('fs').stat);

// SEEDTAG_HOME or ~/seedtag
const cwd = process.env.SEEDTAG_HOME || path.join(os.homedir(), 'seedtag');
const execOpts = { cwd, maxBuffer: 200 * 1024 * 1024 };

let loadedBaseServices = false;
const loadBaseServicesIfNeeded = async () => {
  if (loadedBaseServices) return null;
  loadedBaseServices = true;
  console.log('Loading base services...');
  return exec(`docker-compose up -d ${Service.baseServices.join(' ')}`, execOpts);
};

const addToHosts = repo => {
  const domains = repo.services.filter(svc => svc.domain).map(svc => svc.domain);
  return Promise.all(
    domains.map(domain => exec(`echo "127.0.0.1 ${domain}" | sudo tee -a /etc/hosts`)));
};

const setup = async repo => {
  await exec(`git clone git@github.com:seedtag/${repo.name}.git`, { cwd });
  return addToHosts(repo);
};

const getOrSetupRepo = async repo => {
  const repoDir = path.join(cwd, repo.name);
  try {
    await stat(repoDir);
  } catch (err) {
    console.log('Repo of %s not present, cloning it', repo.name);
    await setup(repo);
  }
  return git(repoDir);
};

const dcCommand = (service, command) => {
  let completeCommand = 'docker-compose ';
  if (service.dcFile) completeCommand += `-f ${service.dcFile} `;
  return completeCommand + command;
};

const syncService = async service => {
  try {
    await exec(dcCommand(service, `up -d --no-deps --build -t 300 ${service.name}`), execOpts);
    console.log('Installing dependencies of %s', service.name);
    await exec(dcCommand(service, `exec ${service.name} yarn`), execOpts);
    console.log('Restarting %s to apply changes', service.name);
    await exec(dcCommand(service, `restart ${service.name}`), execOpts);
    console.log(chalk.green(`${service.name} successfully synced`));
  } catch (err) {
    console.error(chalk.red(`${service.name} couldn't be synced due to ${err}`));
  }
};

const syncRepo = async repo => {
  try {
    const gitRepo = await getOrSetupRepo(repo);
    const [canPull, reason] = canBePulled(await gitRepo.status());
    if (!canPull) throw new Error(reason);
    await gitRepo.pull();
    await loadBaseServicesIfNeeded();
    await Promise.all(repo.services.map(svc => syncService(svc)));
  } catch (err) {
    console.log(chalk.red(`${repo.name} couldn't be synced due to ${err}`));
    throw err;
  }
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
