const program = require('commander');
const getSelectedRepos = require('./utils/get-selected-repositories');
const { Multilogger, Logger } = require('./utils/spinners');
const ServiceBuilder = require('./utils/ServiceBuilder');

program
  .option('-v, --verbose', 'no comments')
  .option('-a, --all', 'Start all the services defined in the main docker-compose.yml file')
  .parse(process.argv);


const repos = getSelectedRepos(program.args, program.all);
Promise.all(repos.map(repo => {
  const logger = new Logger(new Multilogger(), repo.name, 'Synchronizing');
  const serviceBuilder = new ServiceBuilder(program.verbose, logger);
  return Promise.all(repo.services.map(svc => serviceBuilder.build(svc)));
}))
  .catch(err => console.log(err));
