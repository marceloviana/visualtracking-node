FROM node:slim AS prod

WORKDIR '/app'
COPY package.json .
COPY src src

RUN npm update && apt-get update && apt-get install -y curl
ENV AWS_REGION="us-east-2"
ENV ENVIRONMENT=dev

CMD ["node", "src/index.js"]