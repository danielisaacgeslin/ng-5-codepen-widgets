#!/bin/bash
set -e

SERVICES=(adserver-proxy-service backoffice-client email-service sherlock-service studio-client studio-service tag-manager-service tagging-service user-service)

docker-compose build

for service in "${SERVICES[@]}"; do
    echo "Updating $service"
    docker-compose exec $service npm install
done
