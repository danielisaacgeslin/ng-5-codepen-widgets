const program = require('commander');
const spawn = require('child_process').spawn;

program
  .option('-v, --verbose', 'Verbose mode')
  .parse(process.argv);

const verboseMode = program.verbose ? '-v' : '';

spawn('st', ['library', verboseMode, 'seedtag-constants'], { stdio: 'inherit' })
