FROM node:carbon

WORKDIR /usr/hello-world-api

COPY ./package*.json ./
RUN npm install

COPY ./ ./

EXPOSE 3000

CMD ["npm", "start"]