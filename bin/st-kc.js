const options = require('./utils/options');
const childProcess = require('child_process');
const program = require('commander');

const KAFKA_SERVICE = 'kafka';

program
  .parse(process.argv);

const queue = program.args.length ? program.args[0] : 'tasks';
const command = `/opt/kafka/bin/kafka-console-consumer.sh --new-consumer \
--bootstrap-server localhost:9092 --topic ${queue}`;
childProcess.spawn('/bin/bash', ['-c', '-i', `"docker-compose exec ${KAFKA_SERVICE} ${command}"`],
  options.vexecOpts);