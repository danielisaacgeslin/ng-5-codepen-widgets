const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');
const guess = require('./utils/guess-service');

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
  const baseCommandArr = program.detached ? ['-d'] : [];
  const commandArr = baseCommandArr.concat(getSelectedServices());
  childProcess.spawn('docker-compose', ['up'].concat(commandArr), execOpts);
};

run()
  .catch(err => console.log(err));
