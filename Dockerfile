FROM node:12

WORKDIR /usr/src/app

COPY . .

# VOLUME /usr/src/app/data

RUN npm i -quiet

VOLUME /usr/src/app/logs

EXPOSE 8080

CMD [ "npm" , "start"]