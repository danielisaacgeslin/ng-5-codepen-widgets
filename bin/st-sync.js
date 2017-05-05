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
    await exec(`ssh-agent bash -c "ssh-add ${process.env.SEEDTAG_SSH_KEY}; git ${argsStr}"`)
  } else {
    await spawnAsync('git', argsStr.split(' '), execOpts);
  }
  return addToHosts(repo);
};

const getOrSetupRepo = async repo => {
  const repoDir = path.join(options.cwd, repo.name);
  try {
    await stat(repoDir);
  } catch (err) {
    console.log('Repo of %s not present, cloning it', repo.name);
    await setup(repo);
  }
  return git(repoDir);
};

const dcArgs = (service, command) => {
  let completeCommand = [];
  if (service.dcFile) completeCommand = completeCommand.concat(['-f', service.dcFile]);
  completeCommand = completeCommand.concat(command.split(' '));
  return completeCommand;
};

const syncService = async service => {
  try {
    console.log(chalk.magenta('Building', service.name));
    await spawnAsync('docker-compose', dcArgs(service, `build ${service.name}`), execOpts);
    console.log(chalk.magenta('Installing dependencies of', service.name));
    await spawnAsync('docker-compose', dcArgs(service, `run --no-deps --rm ${service.name} yarn`),
      execOpts);
    console.log(chalk.green(`${service.name} successfully synced`));
  } catch (err) {
    console.error(chalk.red(`${service.name} couldn't be synced due to ${err}`));
  }
};

const repoNames = getSelectedRepos();
const repos = repoNames.map(repoName => new Repository(repoName));
const remainingRepos = new Set(repoNames);
const syncRepo = async repo => {
  try {
    const gitRepo = await getOrSetupRepo(repo);
    const [canPull, reason] = canBePulled(await gitRepo.status());
    if (!canPull) throw new Error(reason);
    await gitRepo.pull();
    await Promise.all(repo.services.map(svc => syncService(svc)));

    remainingRepos.delete(repo.name);
    if (remainingRepos.size) {
      console.log(chalk.green(`[${repoNames.length - remainingRepos.size}/${repoNames.length}] \
Repos in progress: ${Array.from(remainingRepos).join(' ')}`));
    }
  } catch (err) {
    console.log(chalk.red(`${repo.name} couldn't be synced due to ${err}`));
    throw err;
  }
};

if (program.verbose) execOpts.stdio = 'inherit';

console.log(`Syncing ${repos.map(r => r.name).join(' ')}`);
Promise.all(repos.map(r => syncRepo(r)))
.then(() => {
  console.log('Repositories updated');
  process.exit(0);
})
.catch(err => {
  console.log(chalk.red('Could not sync some service'));
  console.log(err);
});

