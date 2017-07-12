const repos = require('../repositories');
const _ = require('lodash');

class Service {
  constructor(serviceData) {
    this.name = serviceData.name;
    this.dcFile = serviceData.dcFile;
    this.domain = serviceData.domain ? `${serviceData.domain}.seedtag.local` : null;
    this.buildCopyDirs = serviceData.buildCopyDirs || ['/code/node_modules:node_modules'];
  }

  static getAll() {
    const services = [];
    Object.keys(repos).forEach(repoName => services.push(repos[repoName]));
    return services;
  }

  static get(serviceName) {
    const svcListFromRepoList = Object.keys(repos)
      .map(repoName => repos[repoName] // For each repo, get services list
        .filter(svc => svc.name === serviceName)) // Only return selected svc
      .filter(svcs => svcs.length !== 0);
    // SvcListFromRepoList is a list of a list conaining the service.
    const svcJson = _.get(svcListFromRepoList, '0.0', { name: serviceName });
    return new Service(svcJson);
  }
}

module.exports = Service;
module.exports.getAll = Service.getAll;
module.exports.baseServices = ['mongo', 'redis', 'kafka', 'zookeeper'];
