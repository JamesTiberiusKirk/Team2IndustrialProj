#!/bin/sh

if [ -f "../.env" ]; then
    export $(cat ../.env | xargs) 
fi
docker-compose down
docker rm deployment_script_test_db
docker image rm deployment_script_test_db
docker-compose --file ./test-db/docker-compose.yml up -d --build --force-recreate 