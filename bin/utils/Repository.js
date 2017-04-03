const repos = require('../repositories');

class Service {
  constructor(serviceData) {
    this.name = serviceData.name;
    this.dcFile = serviceData.dcFile;
    this.tier = serviceData.tier;
    this.domain = serviceData.domain ? `${serviceData.domain}.seedtag.local` : null;
  }
}

class Repository {
  constructor(repoName) {
    this.name = repoName;
    this.services = repos[repoName].map(serviceData => new Service(serviceData));
  }
  static getAll() {
    return Object.keys(repos).map(repoName => new Repository(repoName));
  }
}

module.exports = Repository;
module.exports.getAll = Repository.getAll;
module.exports.baseServices = ['mongo', 'redis', 'kafka', 'zookeeper'];
