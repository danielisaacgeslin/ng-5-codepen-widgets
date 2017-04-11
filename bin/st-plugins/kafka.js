'use strict';

const childProcess = require('child_process');
const baseExecOpts = require('../utils/options').execOpts;

const execOpts = Object.assign({ stdio: 'inherit' }, baseExecOpts);

const KAFKA_SERVICE = 'kafka';

function run(cmd, args) {
  console.log(cmd, args);
  childProcess.spawnSync(cmd, args, execOpts);
}

const kc = {
  command: 'kc [queue]',
  description: 'Starts a kafka consumer. Default queue: tasks, default image: kafka.*',
  action: (queue) => {
    queue = queue || 'tasks';
    const command = `/opt/kafka/bin/kafka-console-consumer.sh --new-consumer \
--bootstrap-server localhost:9092 --topic ${queue}`;
    run('/bin/bash', ['-c', '-i', `"docker-compose exec ${KAFKA_SERVICE} ${command}"`]);
  }
};

const kp = {
  command: 'kp [queue]',
  description: 'Starts a kafka producer. default queue: tasks, default image: kafka.*',
  action: (queue) => {
    queue = queue || 'tasks';
    const command = `/opt/kafka/bin/kafka-console-producer.sh --topic ${queue} \
--broker-list localhost:9092`;
    run('/bin/bash', ['-c', '-i', `"docker-compose exec ${KAFKA_SERVICE} ${command}"`]);
  }
};

module.exports = {
  kc,
  kp
};
