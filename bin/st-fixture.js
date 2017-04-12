const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');
const fs = require('fs');

const FIXTURES_PATH = `${options.cwd}/initial-data`;

program
  .parse(process.argv);

function getAvailableFixtures() {
  return fs.readdirSync(FIXTURES_PATH)
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));
}

function loadFixture(name) {
  console.log('Loading fixture', name);
  const file = `${FIXTURES_PATH}/${name}.js`;
  childProcess.spawn('mongo', [name, file], options.vexecOpts);
}

const names = program.args;
if (names.length === 0) {
  console.log('Available fixtures:');
  getAvailableFixtures().forEach(file => console.log(file));
  process.exit();
}

const availableFixtures = getAvailableFixtures();
names.filter(v => availableFixtures.includes(v))
  .forEach(name => loadFixture(name));
