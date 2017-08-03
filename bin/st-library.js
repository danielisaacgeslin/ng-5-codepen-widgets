const program = require('commander');
const findInFiles = require('find-in-files');
const repositories = Object.keys(require('./repositories'));

program
  .option('-v, --verbose', 'Verbose mode')
  .option('[libraries...]', 'Check the use of these libraries in any service')
  .parse(process.argv);

const libraries = program.args;

const isUsingLibrary = async (repo, library) => {
  const result = await findInFiles.find(library, repo, 'package.json');
  if (program.verbose) {
    console.log(`${library} in ${repo}`);
  } else {
    process.stdout.write('....');
  }
  const isUsing = Object.keys(result).length > 0;
  return { repo, isUsing };
};

const checkLibrary = (library) => {
  const isUsingLibraryPromises = repositories.map(
    (repo) =>
      isUsingLibrary(repo, library).then((r) => {
        if (program.verbose) {
          console.log(`${library} >> ${r.repo} >> ${r.isUsing}`);
        }
        return r;
      })
  );

  Promise.all(isUsingLibraryPromises)
    .then(values => {
      const result = values.filter(repo => repo.isUsing).map(r => r.repo);
      console.log(`\nThese repositories must be upgraded with new ${library} library reference:`);
      result.forEach((repo) => console.log(`  - ${repo}`));
    })
    .catch(reason => {
      console.log(reason);
    });
};

if (libraries.length === 0) {
  console.log('ERROR >>>', 'At least on library must be indicated');
} else {
  console.log('Checking ...');
  libraries.forEach((library) => checkLibrary(library));
}
