const services = require('../services');

class Service {
  constructor(serviceName) {
    this.name = serviceName;
    this.path = services[serviceName].path || serviceName;
    this.dcFile = services[serviceName].dcFile;
    this.domain = services[serviceName].domain
      ? `${services[serviceName].domain}.seedtag.local`
      : null;
  }
}

module.exports = Service;
module.exports.baseServices = ['mongo', 'redis', 'kafka', 'zookeeper'];
