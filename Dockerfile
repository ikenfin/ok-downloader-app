FROM node:8-alpine
RUN adduser -D -g '' app
USER app

WORKDIR /ok-downloader-app/
COPY . .
RUN npm install