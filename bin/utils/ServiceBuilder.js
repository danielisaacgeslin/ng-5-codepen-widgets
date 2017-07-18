const spawnAsync = require('../utils/child-process').spawnAsync;
const options = require('../utils/options');
const chalk = require('chalk');

module.exports = class ServiceBuilder {
  constructor(verbose = false, logger) {
    this.execOpts = Object.assign({ env: { COMPOSE_HTTP_TIMEOUT: '300' } },
      options.execOpts);
    if (verbose) this.execOpts.stdio = 'inherit';
    this.logger = logger;
  }

  static generateDockerComposeArgs(service, command) {
    let completeCommand = [];
    if (service.dcFile) completeCommand = completeCommand.concat(['-f', service.dcFile]);
    completeCommand = completeCommand.concat(command.split(' '));
    return completeCommand;
  }

  async removeSafe(dir) {
    // Ensure it's a relative path and not root
    if (!/^\.\/.+$/.test(dir)) return;
    await spawnAsync('rm', ['-rf', dir], this.execOpts);
  }

  async removeDirectories(service) {
    await Promise.all(service.buildCopyDirs.map(async (d) => {
      const dir = d.split(':');
      const localDir = `./${service.name}/${dir[1]}`;
      await this.removeSafe(localDir);
    }));
  }

  async copyFromContainer(service) {
    const seedtagProjectName = (process.env.SEEDTAG_HOME || '').split(/\/\\/).reverse()[0] || 'seedtag';
    const imageName = `${seedtagProjectName}_${service.name}`;
    const tempContainerName = `${imageName}_directories_cp`;

    const cmd1 = ['docker', ['run', '-d', '--name', tempContainerName, imageName, 'sleep', 100000], this.execOpts];
    try {
      await spawnAsync('docker', ['rm', '-f', tempContainerName], this.execOpts);
    } catch (err) {
      // old container already deleted
    }
    await spawnAsync(...cmd1);

    if (service.buildCopyDirs && service.buildCopyDirs.length) {
      await Promise.all(service.buildCopyDirs.map(async (d) => {
        const dir = d.split(':');
        const containerDir = `${tempContainerName}:${dir[0]}`;
        const localDir = `./${service.name}/${dir[1]}`;
        this.logger.text = chalk.magenta('Copy', containerDir, 'to', `local:${localDir}`);
        await this.removeSafe(localDir);
        const cmd = ['docker', ['cp', containerDir, localDir], this.execOpts];
        await spawnAsync(...cmd);
      }));
    }

    const cmd3 = ['docker', ['rm', '-f', tempContainerName], this.execOpts];
    await spawnAsync(...cmd3);
  }

  async build(service, verbose) {
    try {
      this.logger.text = chalk.magenta('Building', service.name);
      await spawnAsync(
        'docker-compose',
        ServiceBuilder.generateDockerComposeArgs(service, `build ${service.name}`),
        this.execOpts
      );
      this.logger.text = chalk.magenta('Synchronizing directories from service image', service.name);
      try {
        await this.copyFromContainer(service);
      } catch (e) {
        this.logger.text = chalk.magenta('Sync failed. Reinstalling dependencies from clean for', service.name);
        await this.removeDirectories(service);
        await spawnAsync(
          'docker-compose',
          ServiceBuilder.generateDockerComposeArgs(service, `run --no-deps --rm ${service.name} yarn --verbose`),
          this.execOpts);
      }
      this.logger.text = chalk.green(`${service.name} successfully built`);
    } catch (err) {
      this.logger.error(chalk.red(`${service.name} couldn't be built due to ${err}`));
    }
  }
};
