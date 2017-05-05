# dev-environment
Necessary files to setup a [TO DO] complete environment

It will install every service where this repository has been cloned.

For example, to install seedtag platform in ~/seedtag, simply do this:

## Requirements
* Ensure you have [docker environment](https://github.com/seedtag/docker-images) ready
* Ensure you have docker and docker-compose installed
* If your installation is not "~/seedtag" you have to set $SEEDTAG_HOME as ENV pointing to the absolute path of your seedtag installation.

## Setup
```
git clone git@github.com:seedtag/dev-environment.git seedtag
cd seedtag
npm i -g
npm link # to have all your updates over st.js available instantly when running st

# And if you don't have the projects:

# OPTION A (Default SHH-KEY without Passphrase)
st sync -a

# OPTION B (Select SSH-KEY without Passphrase)
SEEDTAG_SSH_KEY=/absolute/route/to/my-ssh-key st sync -a

# Before launch is needed to restore database with the following commands:
st dump
st restore
```

This will download all the services and build them. The st command is idempotent

## Usage
```
$ st --help

  Usage: st [options] [command]


  Commands:

    sync [services...]       If no services option is provided, sync all services
    db_dump                  Make a dump of production db in initial-data/backup-YYYYMMDD
    db_restore [backupName]  Restore a previously made backup. If no backupName it will restore today
    *

  Options:

    -h, --help  output usage information
```

You can sync some of the services providing the name of the services to sync

In order to have db_dump and db_restore dump you have to add mongodb1-instance-2 pointing to the right ip in your /etc/hosts (at the moment 104.155.17.188)

## clients
frontend clients are defined into *docker-compose.clients.yml*

`
$ docker-compose -f docker-compose-clients.yml up gohan
`
