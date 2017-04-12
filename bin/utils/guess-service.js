// const options = require('./options');
// const childProcess = require('child_process');
// const Promise = require('bluebird');

// const exec = Promise.promisify(childProcess.exec);
// const execOpts = Object.assign({ stdio: 'inherit' }, options.execOpts);

module.exports = function guess(service) {
  const dirName = process.env.PWD.replace(/.*\//, '');
  if (!service || service === '_' || service === '-') service = dirName;
  if (service === 'tms') service = 'tag-manager-service';
  return service;

  // const containers = await exec('docker-compose ps', execOpts);
  // const containerNames = containers
  //   .split('\n')
  //   .filter(y => y && y.includes(`_${service}`))
  //   .map(y => y.split(' ')[0]);

  // if (containerNames && containerNames.length === 1) {
  //   return /.*_(.*)_.*/.exec(containerNames[0], execOpts)[1];
  // }
  // throw new Error(`Can't find a service with name ${service}`);
};
