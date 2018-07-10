FROM node:carbon

WORKDIR /usr/log-listener

COPY ./package*.json ./
RUN npm install

COPY ./config.json ./
COPY ./logger.js ./
COPY ./server.js ./

EXPOSE 80

CMD ["npm", "start"]