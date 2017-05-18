const repositories = require('../repositories');
const guess = require('./guess-service');
const Repository = require('./Repository');

/**
* @param allRepos: boolean flag to  use all repositories
* @return string[]
*/
function getRepoNames(repoList, allRepos) {
  if (allRepos) return Object.keys(repositories);
  if (repoList.length === 0) {
    return [guess(null)];
  }
  return repoList;
}

/**
* @param allRepos: boolean flag to  use all repositories
* @return Repository[]
*/
const getSelectedRepos = (repoList, allRepos) =>
  getRepoNames(repoList, allRepos).map(n => new Repository(n));

module.exports = getSelectedRepos;
