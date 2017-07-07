const program = require('commander');
const getSelectedRepos = require('./utils/get-selected-repositories');
const spawnAsync = require('./utils/child-process').spawnAsync;
const options = require('./utils/options');
const chalk = require('chalk');


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
    console.log(chalk.magenta('Installing dependencies of', service.name));
    await spawnAsync('docker-compose', generateDockerComposeArgs(service, `run --no-deps --rm ${service.name} yarn --verbose`),
      execOpts);
    console.log(chalk.green(`${service.name} successfully built`));
  } catch (err) {
    console.error(chalk.red(`${service.name} couldn't be built due to ${err}`));
  }
};

getSelectedRepos(program.args, program.all)
  .forEach(repo =>
    repo.services.map(svc =>
      build(svc)));
