const program = require('commander');
const spawnAsync = require('./utils/child-process').spawnAsync;
const options = require('./utils/options');
// const chalk = require('chalk');

program
  .option('-v, --verbose', 'no comments')
  .parse(process.argv);

if (program.args.length !== 2) {
  program.outputHelp();
  process.exit(-1);
}

const main = async () => {
  const repoUrl = `git@github.com:seedtag/create-${program.args[0]}`;
  const repoName = program.args[1];
  console.log(`Trying to clone boilerplate repo: ${repoUrl}`);
  await spawnAsync('git', ['clone', repoUrl, repoName],
    options.execOpts);
  const newPath = `${options.execOpts.cwd}/${repoName}`;
  const newOpts = Object.assign({}, options.execOpts);
  newOpts.cwd = newPath;
  await spawnAsync('bash', ['init.sh'], newOpts);
};

main()
  .then(() => console.log('Done'))
  .catch(err => console.error(err));

// const execOpts = Object.assign({ env: { COMPOSE_HTTP_TIMEOUT: '300' } },
//     options.execOpts);

// if (program.verbose) execOpts.stdio = 'inherit';

// const generateDockerComposeArgs = (service, command) => {
//   let completeCommand = [];
//   if (service.dcFile) completeCommand = completeCommand.concat(['-f', service.dcFile]);
//   completeCommand = completeCommand.concat(command.split(' '));
//   return completeCommand;
// };

// const build = async (service, v) => {
//   try {
//     console.log(chalk.magenta('Building', service.name));
//     await spawnAsync(
//       'docker-compose',
//       generateDockerComposeArgs(service, `build ${service.name}`),
//       execOpts
//     );
//     console.log(chalk.magenta('Installing dependencies of', service.name));
//     await spawnAsync('docker-compose', generateDockerComposeArgs(service, `run --no-deps --rm ${service.name} yarn --verbose`),
//       execOpts);
//     console.log(chalk.green(`${service.name} successfully built`));
//   } catch (err) {
//     console.error(chalk.red(`${service.name} couldn't be built due to ${err}`));
//   }
// };


// getSelectedRepos(program.args, program.all).map(s => build(s));
