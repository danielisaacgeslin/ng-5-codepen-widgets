const options = require('./utils/options');
const dcAction = require('./utils/dc-action');
const Service = require('./utils/Service');
const program = require('commander');
const guess = require('./utils/guess-service');

const execOpts = options.vexecOpts;

program
  .option('-a, --all', 'Start all the services defined in the main docker-compose.yml file')
  .parse(process.argv);

const getSelectedServices = () => {
  if (program.all) return [];
  let services = program.args;
  if (services.length === 0) services = [guess(null)];

  console.log(`Stoping ${services.join(' ')}`);
  return services;
};

const run = async () => {
  const services = getSelectedServices()
    .map(s => Service.get(s));

  const actionsArr = ['stop'];
  dcAction(actionsArr, services, execOpts);
};

run()
  .catch(err => console.log(err));
