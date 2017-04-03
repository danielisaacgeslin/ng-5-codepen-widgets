'use strict';

const childProcess = require('child_process');
const Promise = require('bluebird');

const exec = Promise.promisify(childProcess.exec);

function run(cmd, args) {
  console.log(cmd, args);
  childProcess.spawnSync(cmd, args, { stdio: 'inherit' });
}

function guess(image) {
  const dirName = process.env.PWD.replace(/.*\//, '');
  if (!image || image === '_' || image === '-') {
    image = dirName;
  }
  if (image === 'tms') {
    image = 'tag-manager-service';
  }
  return exec('docker-compose ps')
    .then(x => x.split('\n')
      .filter(y => y && y.includes(`_${image}`))
      .map(y => y.split(' ')[0]))
    .then((x) => {
      if (x && x.length === 1) {
        return /.*_(.*)_.*/.exec(x[0])[1];
      }
      throw new Error(`Can't find an image with name ${image}`);
    });
}

const up = {
  command: 'up',
  description: 'Starts docker-compose project in the current directory',
  action: () => run('/bin/bash', ['-i', '-c', 'docker-compose up -t 120'])
};

const stop = {
  command: 'stop',
  description: 'Stops docker-compose project in the current directory',
  action: () => run('/bin/bash', ['-i', '-c', 'docker-compose stop'])
};

const sh = {
  command: 'sh [command] [image]',
  description: 'default image: guessed by current directory; default command: bash',
  action: (command, image) => {
    guess(image)
      .then((img) => {
        command = command || 'bash';
        run('/bin/bash', ['-i', '-c', `docker-compose exec ${img} ${command}`]);
      });
  }
};

const test = {
  command: 'test [command] [image]',
  description: 'default image: guessed by current directory; default command: yarn test',
  action: (command, image) => {
    guess(image)
      .then((img) => {
        command = command || 'yarn test';
        run('/bin/bash', ['-i', '-c', `docker-compose exec ${img} ${command}`]);
      });
  }
};

const restart = {
  command: 'r [image]',
  description: 'Restarts a service. default image: guessed by current directory',
  action: (image) => {
    guess(image)
      .then((img) => {
        run('/bin/bash', ['-i', '-c', `docker-compose restart ${img}`]);
      });
  }
};

const yarn = {
  command: 'yarn [image]',
  description: 'default image: guessed by current directory; default command: yarn',
  action: (image) => {
    guess(image)
      .then((img) => {
        command = 'yarn';
        run('/bin/bash', ['-i', '-c', `docker-compose exec ${img} ${command}`]);
      });
  }
};

module.exports = {
  up,
  stop,
  sh,
  test,
  restart,
  yarn
};
