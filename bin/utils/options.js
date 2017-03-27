// SEEDTAG_HOME or ~/seedtag
const path = require('path');
const os = require('os');
const cwd = process.env.SEEDTAG_HOME || path.join(os.homedir(), 'seedtag');
const execOpts = { cwd, maxBuffer: 200 * 1024 * 1024 };

module.exports.cwd = cwd;
module.exports.execOpts = execOpts;
