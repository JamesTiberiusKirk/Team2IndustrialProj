date >> web_update.log
docker-compose stop
docker-compose rm -f
docker image rm dumitruvulpe/team2ip-web
docker-compose -f docker-compose.yml up -d
