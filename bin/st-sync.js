const program = require('commander');
const repositories = require('./repositories');
const guess = require('./utils/guess-service');
const chalk = require('chalk');
const git = require('simple-git/promise');
const Promise = require('bluebird');
const childProcess = require('child_process');
const path = require('path');
const Repository = require('./utils/Repository');
const options = require('./utils/options');
const ServiceBuilder = require('./utils/ServiceBuilder');
const { Multilogger, Multispinner, Logger } = require('./utils/spinners');
const spawnAsync = require('./utils/child-process').spawnAsync;
const canBePulled = require('./utils/repo-utils').canBePulled;

const exec = Promise.promisify(childProcess.exec);
const stat = Promise.promisify(require('fs').stat);

program
  .option('-v, --verbose', 'Verbose mode')
  .option('-a, --all', 'Start all the services defined in the main docker-compose.yml file')
  .parse(process.argv);

// SEEDTAG_HOME or ~/seedtag
const execOpts = Object.assign({ env: { COMPOSE_HTTP_TIMEOUT: '300' } },
  options.execOpts);

const getSelectedRepos = () => {
  if (program.all) return Object.keys(repositories);
  let repos = program.args;
  if (repos.length === 0) repos = [guess(null)];
  return repos;
};

const addToHosts = repo => {
  const domains = repo.services.filter(svc => svc.domain).map(svc => svc.domain);
  return Promise.all(
    domains.map(domain => exec(`echo "127.0.0.1 ${domain}" | sudo tee -a /etc/hosts`)));
};

const setup = async repo => {
  const argsStr = `clone git@github.com:seedtag/${repo.name}.git`;
  if (process.env.SEEDTAG_SSH_KEY) {
    await exec(`ssh-agent bash -c "ssh-add ${process.env.SEEDTAG_SSH_KEY}; git ${argsStr}"`);
  } else {
    await spawnAsync('git', argsStr.split(' '), execOpts);
  }
  return addToHosts(repo);
};

const getOrSetupRepo = async (repo, logger) => {
  const repoDir = path.join(options.cwd, repo.name);
  try {
    await stat(repoDir);
  } catch (err) {
    logger.text = 'Repo not present, cloning it';
    await setup(repo);
  }
  return git(repoDir);
};
/**
*
*/
const dcArgs = (service, command) => {
  let completeCommand = [];
  if (service.dcFile) completeCommand = completeCommand.concat(['-f', service.dcFile]);
  completeCommand = completeCommand.concat(command.split(' '));
  return completeCommand;
};

const repoNames = getSelectedRepos();
const repos = repoNames.map(repoName => new Repository(repoName));
const syncRepo = async (repo, logger) => {
  try {
    const gitRepo = await getOrSetupRepo(repo, logger);
    const [canPull, reason] = canBePulled(await gitRepo.status());
    if (!canPull) throw new Error(reason);
    logger.text = 'Pulling repo';
    await gitRepo.pull();
    logger.text = 'Syncing services';
    const serviceBuilder = new ServiceBuilder(program.verbose, logger);
    await Promise.all(repo.services.map(svc => serviceBuilder.build(svc)));
    logger.success('Repo in sync');
  } catch (err) {
    logger.error(`${repo.name} couldn't be synced due to ${err}`);
    throw err;
  }
};

if (program.verbose) execOpts.stdio = 'inherit';

console.log(`Syncing ${repos.map(r => r.name).join(' ')}`);
const multilogger = program.verbose ? new Multilogger() : new Multispinner();
Promise.all(repos.map(r => {
  const logger = new Logger(multilogger, r.name, 'Synchronizing');
  return syncRepo(r, logger);
}))
.then(() => {
  setTimeout(() => process.exit(0), 1000);
})
.catch(err => {
  console.log(chalk.red('Could not sync some service'));
  console.log(err);
});
