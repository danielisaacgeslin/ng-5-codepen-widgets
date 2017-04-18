const childProcess = require('child_process');

module.exports.spawnAsync = (command, args, options) => new Promise((resolve, reject) => {
  let stderr = '';
  try {
    const proc = childProcess.spawn(command, args, options);
    if (proc.stderr) { // Else is verbose mode, already printed the error
      proc.stderr.on('data', data => {
        stderr += data;
      });
    }
    proc.on('close', code => {
      if (code === 0) return resolve();
      console.log(code);
      return reject(stderr);
    });
  } catch (err) {
    reject(stderr);
  }
});
