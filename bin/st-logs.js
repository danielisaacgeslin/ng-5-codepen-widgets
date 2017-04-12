const options = require('./utils/options');
const childProcess = require('child_process');
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

  console.log(`Logging ${services.join(' ')}`);
  return services;
};

const run = async () => {
  const commandArr = getSelectedServices();
  childProcess.spawn('docker-compose', ['logs', '-f'].concat(commandArr), execOpts);
};

run()
  .catch(err => console.log(err));
