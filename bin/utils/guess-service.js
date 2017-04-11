const exec = Promise.promisify(childProcess.exec);

module.exports = async function guess(service) {
  const dirName = process.env.PWD.replace(/.*\//, '');
  if (!service || service === '_' || service === '-') service = dirName;
  if (service === 'tms') service = 'tag-manager-service';

  const containers = await exec('docker-compose ps', execOpts);
  const containerNames = containers
    .split('\n')
    .filter(y => y && y.includes(`_${service}`))
    .map(y => y.split(' ')[0]);

  if (containerNames && containerNames.length === 1) return /.*_(.*)_.*/.exec(x[0], execOpts)[1];
  throw new Error(`Can't find a service with name ${service}`);
}
