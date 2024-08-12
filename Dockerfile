FROM node:slim AS prod

WORKDIR '/app'
COPY package.json .
COPY src src

RUN npm update && apt-get update && apt-get install -y curl
ENV AWS_REGION="sa-east-1"

CMD ["node", "src/index.js"]