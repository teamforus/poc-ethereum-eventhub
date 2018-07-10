FROM node:carbon

WORKDIR /usr/eth-api

COPY ./package*.json ./
RUN npm install

COPY ./config.json ./
COPY ./server.js ./

CMD ["npm", "start"]