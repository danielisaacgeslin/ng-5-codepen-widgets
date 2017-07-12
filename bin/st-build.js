const program = require('commander');
const getSelectedRepos = require('./utils/get-selected-repositories');
const spawnAsync = require('./utils/child-process').spawnAsync;
const options = require('./utils/options');
const chalk = require('chalk');

const removeDirectories = async (service) => {
  await Promise.all(service.buildCopyDirs.map(async (d) => {
    let dir = d.split(':');
    const localDir = `./${service.name}/${dir[1]}`;
    await spawnAsync('rm', ['-rf', localDir]);
  }));
};

const copyFromContainer = async (service) => {
  const seedtagProjectName = (process.env.SEEDTAG_HOME || '').split(/\/\\/).reverse()[0] || 'seedtag';
  const imageName = `${seedtagProjectName}_${service.name}`;
  const tempContainerName = `${imageName}_directories_cp`;

  const cmd1 = [`docker`, ['run', '-d', '--name', tempContainerName, imageName, 'sleep', 100000]];
  await spawnAsync('docker', ['rm', '-f', tempContainerName]);
  await spawnAsync(...cmd1);

  if (service.buildCopyDirs && service.buildCopyDirs.length) {
    await Promise.all(service.buildCopyDirs.map(async (d) => {
      let dir = d.split(':');
      const containerDir = `${tempContainerName}:${dir[0]}`;
      const localDir = `./${service.name}/${dir[1]}`;
      console.log(chalk.magenta('Copy', containerDir, 'to', `local:${localDir}`));
      await spawnAsync('rm', ['-rf', localDir]);
      const cmd = ['docker', ['cp', containerDir, localDir]];
      await spawnAsync(...cmd);
    }));
  }

  const cmd3 = ['docker', ['rm', '-f', tempContainerName]];
  await spawnAsync(...cmd3);
};

program
  .option('-v, --verbose', 'no comments')
  .option('-a, --all', 'Start all the services defined in the main docker-compose.yml file')
  .parse(process.argv);

const execOpts = Object.assign({ env: { COMPOSE_HTTP_TIMEOUT: '300' } },
    options.execOpts);

if (program.verbose) execOpts.stdio = 'inherit';

const generateDockerComposeArgs = (service, command) => {
  let completeCommand = [];
  if (service.dcFile) completeCommand = completeCommand.concat(['-f', service.dcFile]);
  completeCommand = completeCommand.concat(command.split(' '));
  return completeCommand;
};

const build = async (service, v) => {
  try {
    console.log(chalk.magenta('Building', service.name));
    await spawnAsync(
      'docker-compose',
      generateDockerComposeArgs(service, `build ${service.name}`),
      execOpts
    );
    console.log(chalk.magenta('Synchronizing directories from service image', service.name));
    try {
      await copyFromContainer(service);
    } catch(e) {
      console.log(chalk.magenta('Sync failed. Reinstalling dependencies from clean for', service.name));
      await removeDirectories(service);
      await spawnAsync('docker-compose', generateDockerComposeArgs(service, `run --no-deps --rm ${service.name} yarn --verbose`),
                       execOpts);
    }
    console.log(chalk.green(`${service.name} successfully built`));
  } catch (err) {
    console.error(chalk.red(`${service.name} couldn't be built due to ${err}`));
  }
};

getSelectedRepos(program.args, program.all)
  .forEach(repo =>
    repo.services.map(svc =>
      build(svc)));
