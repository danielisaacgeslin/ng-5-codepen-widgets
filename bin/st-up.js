const options = require('./utils/options');
const dcAction = require('./utils/dc-action');
const program = require('commander');
const guess = require('./utils/guess-service');
const Service = require('./utils/Service');

const execOpts = options.vexecOpts;

program
  .option('-a, --all', 'Start all the services defined in the main docker-compose.yml file')
  .option('-d, --detached', 'Start in background')
  .parse(process.argv);

const getSelectedServices = () => {
  if (program.all) return [];
  let services = program.args;
  if (services.length === 0) services = [guess(null)];
  console.log(`Starting ${services.join(' ')}`);
  return services;
};

const run = async () => {
  const services = getSelectedServices()
    .map(s => Service.get(s));

  const actionsArr = ['up'];
  if (program.detached) actionsArr.push('-d');

  dcAction(actionsArr, services, execOpts);
};

run()
  .catch(err => console.log(err));
