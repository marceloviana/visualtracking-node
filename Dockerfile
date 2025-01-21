FROM node:20  AS prod

WORKDIR '/app'
COPY package.json .
COPY src src

RUN npm install
ENV AWS_REGION="us-east-2"
ENV ENVIRONMENT=dev

CMD ["node", "src/index.js"]