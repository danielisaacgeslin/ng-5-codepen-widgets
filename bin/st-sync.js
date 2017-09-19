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

const getAddToHostsCmd = repo => {
  const domains = repo.services.filter(svc => svc.domain).map(svc => svc.domain);
  return domains.map(domain => ` add "127.0.0.1 ${domain}" to /etc/hosts`).join('and ');
};

const setup = async repo => {
  const argsStr = `clone git@github.com:seedtag/${repo.name}.git`;
  if (process.env.SEEDTAG_SSH_KEY) {
    await exec(`ssh-agent bash -c "ssh-add ${process.env.SEEDTAG_SSH_KEY}; git ${argsStr}"`);
  } else {
    await spawnAsync('git', argsStr.split(' '), execOpts);
  }
};

const getOrSetupRepo = async (repo, logger) => {
  const repoDir = path.join(options.cwd, repo.name);
  let isNew = false;
  try {
    await stat(repoDir);
  } catch (err) {
    logger.text = 'Repo not present, cloning it';
    isNew = true;
    await setup(repo);
  }
  return [isNew, git(repoDir)];
};

const repoNames = getSelectedRepos();
const repos = repoNames.map(repoName => new Repository(repoName));
const syncRepo = async (repo, logger) => {
  try {
    const [isNew, gitRepo] = await getOrSetupRepo(repo, logger);
    const [canPull, reason] = canBePulled(await gitRepo.status());
    if (!canPull) throw new Error(reason);
    logger.text = 'Pulling repo';
    await gitRepo.pull();
    logger.text = 'Syncing services';
    const serviceBuilder = new ServiceBuilder(program.verbose, logger);
    await Promise.all(repo.services.map(svc => serviceBuilder.build(svc)));
    let successMsg = 'Repo in sync';
    if (isNew) successMsg += `, ${getAddToHostsCmd(repo)}`;
    logger.success(successMsg);
  } catch (err) {
    logger.error(`${repo.name} couldn't be synced due to ${err}. Try to re run it with -v`);
    throw err;
  }
};

if (program.verbose) execOpts.stdio = 'inherit';

console.log(`Syncing ${repos.map(r => r.name).join(' ')}`);
const multilogger = program.verbose ? new Multilogger() : new Multispinner();
// const multilogger = new Multilogger();
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
