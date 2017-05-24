const Repositories = require('./repositories');
const Service = require('./utils/Service');
const program = require('commander');
const sh = require('sh');

program
  .option('[client]', 'Start this client')
  .option('-b, --build [client]', 'Build this client')
  .parse(process.argv);

const CLIENT = program.args && program.args[0];

const BCG_SERVICES = [
  // 'aggregation-service',
  // 'adserver-report-extraction-task',
  'adserver-proxy-service',
  'analytics-service',
  'blacklist-service',
  'campaign-service',
  'custom-categories-service',
  'email-service',
  'event-bigdata-service',
  'sherlock-service',
  'tag-manager-service',
  'tagging-service',
  'user-service',
  'error-service',
  'blacklist-service'
];

const run = async () => {

  const BCG_SERVICES_PLAIN = BCG_SERVICES.toString().replace(/(,)/gi, ' ');

  if (program.build) {
    checkInvalidClient(program.build);
    sh(`st sync ${BCG_SERVICES_PLAIN} ${program.build}`);
  } else {
    checkInvalidClient(CLIENT);
    const cientProject = CLIENT ? CLIENT : 'studio-service studio-client';
    sh(`st up nginx ${BCG_SERVICES_PLAIN} ${cientProject}`);
  }

};

const checkInvalidClient = (c) => {
  if (Repositories[c] === undefined) {
    throw new Error('You need specified a valid CLIENT for this command');
  };
}

run()
  .catch(err => console.log(err));
