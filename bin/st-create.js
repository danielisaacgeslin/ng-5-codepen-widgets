const program = require('commander');
const spawnAsync = require('./utils/child-process').spawnAsync;
const options = require('./utils/options');
// const chalk = require('chalk');

program
  .option('-v, --verbose', 'no comments')
  .parse(process.argv);

if (program.args.length !== 2) {
  program.outputHelp();
  console.log('You have to provide repoType (i.e. node-service) and repoName');
  console.log('Look for options in (remove "create-" from repository name)');
  console.log('https://github.com/seedtag/?utf8=✓&q=create-&type=&language=');
  process.exit(-1);
}

const main = async () => {
  const repoUrl = `git@github.com:seedtag/create-${program.args[0]}`;
  const repoName = program.args[1];
  console.log(`Trying to clone boilerplate repo: ${repoUrl}`);
  await spawnAsync('git', ['clone', repoUrl, repoName],
    options.execOpts);
  const newPath = `${options.execOpts.cwd}/${repoName}`;
  const newOpts = Object.assign({}, options.vexecOpts);
  newOpts.cwd = newPath;
  await spawnAsync('bash', ['init.sh', repoName], newOpts);
};

main()
  .then(() => console.log('Done'))
  .catch(err => console.error(err));
