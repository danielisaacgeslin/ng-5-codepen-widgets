const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');
const guess = require('./utils/guess-service');

const execOpts = options.vexecOpts;

program
  .parse(process.argv);

const args = program.args || [];
let service = args[0] || '';
let commandArr = args.slice(1);

const run = async () => {
  service = guess(service);
  if (commandArr.length === 0) commandArr = ['bash'];
  console.log(`Running ${commandArr.join(' ')} in service ${service}`);
  childProcess.spawn('docker-compose', ['exec', service].concat(commandArr), execOpts);
};

run()
  .catch(err => console.log(err));
