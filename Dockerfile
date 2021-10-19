FROM node:12-slim

WORKDIR /usr/src/app
COPY srv .
RUN npm install

EXPOSE 8080
USER node
CMD [ "npm", "start" ]
