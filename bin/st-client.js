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
  'adserver-proxy-service',
  'audit-service',
  'analytics-service',
  'blacklist-service',
  'campaign-service',
  'custom-categories-service',
  'email-service',
  'event-bigdata-service',
  'tag-manager-service',
  'tagging-service',
  'user-service',
  'error-service',
  'blacklist-service'
];

const run = async () => {
  const BCG_SERVICES_PLAIN = BCG_SERVICES.toString().replace(/(,)/gi, ' ');

  const checkInvalidClient = (c) => {
    if (Repositories[c] === undefined) {
      throw new Error('You need specified a valid CLIENT for this command');
    }
    return true;
  };

  if (program.build) {
    checkInvalidClient(program.build);
    sh(`st sync ${BCG_SERVICES_PLAIN} ${program.build}`);
  } else {
    checkInvalidClient(CLIENT);
    const clientProject =
      checkInvalidClient(CLIENT) && CLIENT !== 'studio'
        ? CLIENT : 'studio-service studio-client';
    sh(`st up -d nginx ${BCG_SERVICES_PLAIN}`); // Starting detached
    sh(`st up ${clientProject}`);
  }
};

run()
  .catch(err => console.log(err));
