const repos = require('../repositories');

class Service {
  constructor(serviceData) {
    this.name = serviceData.name;
    this.dcFile = serviceData.dcFile;
    this.tier = serviceData.tier;
    this.domain = serviceData.domain ? `${serviceData.domain}.seedtag.local` : null;
  }

  static getAll() {
    const services = [];
    Object.keys(repos).forEach(repoName => services.push(repos[repoName]));
    return services;
  }

  static get(serviceName) {
    const svcJson = Object.keys(repos)
      .map(repoName => repos[repoName] // For each repo, get services list
        .filter(svc => svc.name === serviceName)) // Only return selected svc
      .filter(svcs => svcs.length !== 0)[0][0]; // Exit from list of services in list of repos
    return new Service(svcJson);
  }
}

module.exports = Service;
module.exports.getAll = Service.getAll;
module.exports.baseServices = ['mongo', 'redis', 'kafka', 'zookeeper'];
