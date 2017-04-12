const program = require('commander');
const Repository = require('./utils/Repository');

program
  .parse(process.argv);

const repos = program.args;
const reposToStatus = repos.length !== 0 ? repos.map(r => new Repository(r)) : Repository.getAll();


const run = async () => {
  reposToStatus.forEach(async r => {
    console.log(`${r.name} ${await r.prettyStatus()}`);
  });
};
run().catch(err => console.log(err));
