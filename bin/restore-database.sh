#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <backup-name>"
    exit 1
fi

docker-compose exec mongo mongorestore --drop --gzip /initial-data/$1
