docker stop nginx-proxy
docker rm nginx-proxy
docker network rm service-tier
docker volume rm logsVolume

