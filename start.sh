BASE_SITE=do1920-03.com

export NODE_ENV=development
export PORT=8008
export DBPORT=27018
export VIRTUAL_HOST=${NODE_ENV}.${BASE_SITE}

docker-compose -p ${VIRTUAL_HOST} up -d --build

export NODE_ENV=production
export PORT=8018
export DBPORT=27019
export VIRTUAL_HOST=${BASE_SITE}

docker-compose -p ${VIRTUAL_HOST} up -d --build



