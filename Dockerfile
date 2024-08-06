FROM node:slim AS prod

WORKDIR '/app'
COPY package.json .
COPY src src

RUN npm update && apt-get update && apt-get install -y curl

EXPOSE 8080
CMD ["node", "src/index.js"]