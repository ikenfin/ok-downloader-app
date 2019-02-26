FROM node:8-alpine
RUN groupadd -r app && useradd -r -g app app
USER app

WORKDIR /ok-downloader-app/
COPY . .
RUN npm install