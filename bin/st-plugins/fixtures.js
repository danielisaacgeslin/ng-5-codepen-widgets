'use strict';

const childProcess = require('child_process');
const Promise = require('bluebird');
const fs = require('fs');
const options = require('../utils/options');

const exec = Promise.promisify(childProcess.exec);
const FIXTURES_PATH = `${options.cwd}/initial-data`;

function fuzzy(values, corpus) {
  return values.map(v => corpus.find(c => c.includes(v)) || v);
}

function availableFixtures() {
  return fs.readdirSync(FIXTURES_PATH)
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));
}

function loadFixture(name) {
  console.log('Loading fixture', name);
  const file = `${FIXTURES_PATH}/${name}.js`;
  exec(`mongo ${name}${file}`).then(console.log);
}

const user = {
  command: 'fixture [name...]',
  description: 'Load user fixture into the running Mongo, whatever it is',
  action: (names) => {
    if (names.length === 0) {
      console.log('Available fixtures:');
      availableFixtures().forEach(file => console.log(file));
      return;
    }
    fuzzy(names, availableFixtures())
      .forEach(name => loadFixture(name));
  }
};

module.exports = {
  user
};
