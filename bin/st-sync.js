const program = require('commander');
const syncServices = require('./utils/sync-service');
const repositories = require('./repositories');

program
  .parse(process.argv);

const repos = program.args;

const reposToSync = repos.length !== 0 ? repos : Object.keys(repositories);
console.log(`Syncing ${reposToSync}`);
syncServices(reposToSync);
