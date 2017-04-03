const childProcess = require('child_process');
const Promise = require('bluebird');
const exec = Promise.promisify(childProcess.exec);
const fs = require('fs');

function run(cmd, args) {
  console.log(cmd, args);
  const proc = childProcess.spawnSync(cmd, args, { stdio: 'inherit' });
};

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
      .filter(x => x && x.includes(`_${image}`))
      .map(x => x.split(" ")[0]))
    .then(x => {
      if (x && x.length === 1) {
        return /.*_(.*)_.*/.exec(x[0])[1];
      }
      throw new Error(`Can\'t find an image with name ${image}`);
    });
}

const up = {
  command: 'up',
  description: 'Starts docker-compose project in the current directory',
  action: () => exec('docker-compose up -t 120')
};

const stop = {
  command: 'stop',
  description: 'Stops docker-compose project in the current directory',
  action: () => exec('docker-compose stop')
};

const sh = {
  command: 'sh [image] [command]',
  description: 'default image: guessed by current directory; default command: bash',
  action: (image, command) => {
    guess(image)
      .then(img => {
        command = command || 'bash';
        run('/bin/bash', ['-c', `docker-compose exec ${img} ${command}`]);
      })
    }
};

const test = {
  command: 'test [image] [command]',
  description: 'default image: guessed by current directory; default command: yarn test',
  action: (image, command) => {
    guess(image)
      .then(img => {
        command = command || 'yarn test';
        run('/bin/bash', ['-c', `docker-compose exec ${img} ${command}`]);
      })
    }  
};

const restart = {
  command: 'r [image]',
  description: 'Restarts a service. default image: guessed by current directory',
  action: (image) => {
    guess(image)
      .then(img => {
        run('/bin/bash', ['-c', `docker-compose restart ${img}`]);
      })
    }
};

module.exports = {
  up,
  stop,
  sh,
  test,
  restart
};
