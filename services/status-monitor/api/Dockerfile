FROM node:carbon

WORKDIR /usr/status-monitor-api

COPY ./package*.json ./
RUN npm install

COPY ./config.json ./
COPY ./server.js ./

EXPOSE 5100

CMD ["npm", "start"]