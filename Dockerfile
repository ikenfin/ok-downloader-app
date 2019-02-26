FROM node:8-alpine

WORKDIR /ok-downloader-app/
COPY . .
RUN npm install