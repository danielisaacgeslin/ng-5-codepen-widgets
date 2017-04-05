'use strict';

const childProcess = require('child_process');
const Promise = require('bluebird');

const exec = Promise.promisify(childProcess.exec);

function run(cmd, args) {
  console.log(cmd, args);
  childProcess.spawnSync(cmd, args, { stdio: 'inherit' });
}

function guess(image) {
  if (!image || image === '_' || image === '-') {
    image = 'kafka';
  }
  return exec('docker-compose ps')
    .then(x => x.split('\n')
      .filter(y => x && y.includes(`_${image}`))
      .map(y => y.split(' ')[0]))
    .then((x) => {
      if (x && x.length === 1) {
        return /.*_(.*)_.*/.exec(x[0])[1];
      }
      throw new Error(`Can't find an image with name ${image}`);
    });
}

const kc = {
  command: 'kc [queue] [image]',
  description: 'Starts a kafka consumer. Default queue: tasks, default image: kafka.*',
  action: (queue, image) => {
    guess(image)
      .then((img) => {
        queue = queue || 'tasks';
        const command = `/opt/kafka_2.11-0.10.0.1/bin/kafka-console-consumer.sh --new-consumer --bootstrap-server localhost:9092 --topic ${queue}`;
        run('/ bin/bash', ['-c', `docker-compose exec ${img} ${command}`]);
      });
  }
};

const kp = {
  command: 'kp [queue] [image]',
  description: 'Starts a kafka producer. default queue: tasks, default image: kafka.*',
  action: (queue, image) => {
    guess(image)
      .then((img) => {
        queue = queue || 'tasks';
        const command = `/opt/kafka_2.11-0.10.0.1/bin/kafka-console-producer.sh --topic ${queue} --broker-list localhost:9092`;
        run('/bin/bash', ['-c', `docker-compose exec ${img} ${command}`]);
      });
  }
};

module.exports = {
  kc,
  kp
};
