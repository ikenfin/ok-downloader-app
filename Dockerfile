FROM node:8-alpine
WORKDIR /ok-downloader-app/
# create local user
COPY . .

RUN chown -R node:node /ok-downloader-app

USER node
RUN npm install