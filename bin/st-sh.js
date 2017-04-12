const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');
const guess = require('./utils/guess-service');
const Service = require('./utils/Service');

const execOpts = options.vexecOpts;

program
  .parse(process.argv);

const args = program.args || [];
let serviceName = args[0] || '';
let commandArr = args.slice(1);

const run = async () => {
  serviceName = guess(serviceName);
  if (commandArr.length === 0) commandArr = ['bash'];
  console.log(`Running ${commandArr.join(' ')} in serviceName ${serviceName}`);

  const service = Service.get(serviceName);

  // Define custom docker-compose file if needed
  const baseCommandArr = service.dcFile ? ['-f', service.dcFile] : [];

  const dcArgs = baseCommandArr.concat(['exec', serviceName]).concat(commandArr);
  childProcess.spawn('docker-compose', dcArgs, execOpts);
};

run()
  .catch(err => console.log(err));
