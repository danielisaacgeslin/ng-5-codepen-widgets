const childProcess = require('child_process');

const DEFAULT_DC_KEY = 'default';

const reduceServicesByDcFiles = services => services.reduce((acc, act) => {
  const key = act.dcFile || DEFAULT_DC_KEY;
  if (acc[key] && acc[key].length) {
    acc[key].push(act);
  } else {
    acc[key] = [act];
  }
  return acc;
}, {});

module.exports = (actionArgs, services, execOpts) => {
  const servicesByDcFiles = reduceServicesByDcFiles(services);

  // One docker-compose up per docker-compose file
  Object.keys(servicesByDcFiles).forEach(dcFile => {
    let commandArr = [];

    // Add custom docker-compose file if needed
    if (dcFile !== DEFAULT_DC_KEY) commandArr = commandArr.concat(['-f', dcFile]);

    commandArr = commandArr.concat(actionArgs);

    // Add every "selected" service
    commandArr = commandArr.concat(servicesByDcFiles[dcFile].map(s => s.name));

    childProcess.spawn('docker-compose', commandArr, execOpts);
  });
};
