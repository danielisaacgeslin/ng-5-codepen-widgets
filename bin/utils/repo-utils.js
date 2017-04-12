const canBePulled = status => {
  if (status.current !== 'master') return [false, 'Could not sync service outside master'];
  if (status.ahead > 0) return [false, 'You cannot be ahead master, please push'];
  if (status.conflicted.length !== 0) return [false, 'You have conflicted files'];
  if (status.created.length !== 0) return [false, 'You have created files'];
  if (status.deleted.length !== 0) return [false, 'You have deleted files'];
  if (status.modified.length !== 0) return [false, 'You have modified files'];
  if (status.renamed.length !== 0) return [false, 'You have renamed files'];
  return [true, null];
};

module.exports.canBePulled = canBePulled;
