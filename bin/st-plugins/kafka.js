const childProcess = require('child_process');
const Promise = require('bluebird');
const exec = Promise.promisify(childProcess.exec);
const fs = require('fs');

function run(cmd, args) {
  console.log(cmd, args);
  const proc = childProcess.spawnSync(cmd, args, { stdio: 'inherit' });
};

function guess(image) {
  if (!image || image === '_' || image === '-') {
    image = 'kafka';
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

const kc = {
  command: 'kc [queue] [image]',
  description: 'Starts a kafka consumer. Default queue: tasks, default image: kafka.*',
  action: (queue, image) => {
    guess(image)
      .then(img => {
        queue = queue || 'tasks';
        command = `/opt/kafka_2.11-0.10.0.1/bin/kafka-console-consumer.sh --new-consumer --bootstrap-server localhost:9092 --topic ${queue}`;
        run('/bin/bash', ['-c', `docker-compose exec ${img} ${command}`]);
      })
    }
};

const kp = {
  command: 'kp [queue] [image]',
  description: 'Starts a kafka producer. default queue: tasks, default image: kafka.*',
  action: (queue, image) => {
    guess(image)
      .then(img => {
        queue = queue || 'tasks';
        command = `/opt/kafka_2.11-0.10.0.1/bin/kafka-console-producer.sh --topic ${queue} --broker-list localhost:9092`;
        run('/bin/bash', ['-c', `docker-compose exec ${img} ${command}`]);
      })
    }
};

module.exports = {
  kc,
  kp
};
