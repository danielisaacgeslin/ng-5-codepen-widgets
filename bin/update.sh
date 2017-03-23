#!/bin/bash

GC_FILE=~/.st_docker_gc
if [ ! -e $GC_FILE ] || test `find "$GC_FILE" -mtime +15`; then
    echo "Cleaning up docker"
    docker rmi -f $(docker images --filter='dangling=true' -q)
    docker volume rm $(docker volume ls -qf dangling=true)
    touch $GC_FILE
fi

docker_changes=()
npm_changes=()

for service in *; do
    if [[ ! -d $service ]]; then
        continue
    fi
    if [[ ! -d $service/.git ]]; then
        continue
    fi
    echo "Updating $service"
    cd $service
    uncommited_changes=`git status -s | grep -v "??" | wc -l`
    if [ $uncommited_changes -ne 0 ]; then
        echo "Uncommited changes, skipping"
        cd ..
        continue
    fi
    git fetch
    git diff --quiet HEAD origin/master -- Dockerfile
    dockerfile_changed=$?
    git diff --quiet HEAD origin/master -- package.json
    npm_changed=$?
    git pull
    if [ $dockerfile_changed -ne 0 ]; then
        echo "Dockerfile changed for $service"
        docker_changes+=($service)
    fi
    if [ $npm_changed -ne 0 ]; then
        echo "Package.json changed for $service"
        npm_changes+=($service)
    fi

    cd ..
done

echo $npm_changes
echo $docker_changes

if [ ${#docker_changes[@]} -ne 0 ]; then
    docker-compose build `echo $docker_changes`
fi

for service in "${npm_changes[@]}"; do
    docker-compose exec $service yarn
done
