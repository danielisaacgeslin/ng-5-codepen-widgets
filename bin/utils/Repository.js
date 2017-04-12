const repos = require('../repositories');
const chalk = require('chalk');
const path = require('path');
const git = require('simple-git/promise');
const repoUtils = require('./repo-utils');
const options = require('./options');
const Promise = require('bluebird');
const emoji = require('node-emoji');

const stat = Promise.promisify(require('fs').stat);
const exec = Promise.promisify(require('child_process').exec);

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
    if (!repos[repoName]) throw new Error(`The repository ${repoName} doesn't exist `);
    this.name = repoName;
    this.services = repos[repoName].map(serviceData => new Service(serviceData));
  }

  async prettyStatus() {
    let status = '';
    try {
      const repoDir = path.join(options.cwd, this.name);
      // Check that the directory exists to avoid unhandler rejection in simplegitPromise
      await stat(repoDir);

      // Do manually git status in order to check new commits
      await exec('git status', { cwd: repoDir });

      const gitRepo = await git(repoDir);
      const gitStatus = await gitRepo.status();
      const canPull = repoUtils.canBePulled(gitStatus)[0];

      let description = '';
      if (gitStatus.current !== 'master') description += `(${chalk.yellow(gitStatus.current)}) `;
      if (gitStatus.ahead > 0) description += `[${gitStatus.ahead}${emoji.get('arrow_heading_up')} ] `;
      if (gitStatus.behind > 0) description += `[${gitStatus.behind}${emoji.get('arrow_heading_down')} ] `;
      if (gitStatus.conflicted.length !== 0) description += `[${gitStatus.conflicted.length}${emoji.get('x')} ] `;
      const totalChanged = gitStatus.created.length +
        gitStatus.deleted.length +
        gitStatus.modified.length +
        gitStatus.renamed.length;

      if (totalChanged !== 0) description += `[${totalChanged}${emoji.get('pencil2')} ] `;

      const color = canPull ? 'green' : 'red';
      description += canPull ? emoji.get('white_check_mark') : '';
      status = chalk[color](description);
    } catch (err) {
      status = chalk.red(err);
    }
    return status;
  }

  static getAll() {
    return Object.keys(repos).map(repoName => new Repository(repoName));
  }
}

module.exports = Repository;
module.exports.getAll = Repository.getAll;
module.exports.baseServices = ['mongo', 'redis', 'kafka', 'zookeeper'];
