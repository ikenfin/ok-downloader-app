FROM node:8-alpine
WORKDIR /ok-downloader-app/
# create local user
COPY package.json .

RUN chown -R node:node /ok-downloader-app
RUN mkdir /ok-downloader-data/ && chown -R node:node /ok-downloader-data

WORKDIR /ok-downloader-app/frontend
COPY ./frontend/package.json .
RUN npm install

COPY ./frontend .
RUN npm run build

WORKDIR /ok-downloader-app
USER node
RUN npm install

COPY . .