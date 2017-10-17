const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');
const fs = require('fs');

const FIXTURES_FOLDER = 'initial-data';

const FIXTURES_PATH = `${options.cwd}/${FIXTURES_FOLDER}`;

program
  .option('-a, --all', 'Load all available fixtures')
  .parse(process.argv);

function getAvailableFixtures() {
  return fs.readdirSync(FIXTURES_PATH)
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));
}
const availableFixtures = getAvailableFixtures();

function loadFixture(name) {
  console.log('Loading fixture', name);
  const file = `${FIXTURES_FOLDER}/${name}.js`;
  childProcess.spawn('docker-compose', ['exec', 'mongo', 'mongo', name, file], options.vexecOpts);
}

const names = program.all ? availableFixtures : program.args;
if (names.length === 0) {
  console.log('Available fixtures:');
  getAvailableFixtures().forEach(file => console.log(file));
  process.exit();
}

names.filter(v => availableFixtures.includes(v))
  .forEach(name => loadFixture(name));
