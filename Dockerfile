FROM node:20-slim AS prod

WORKDIR '/app'
COPY package.json .
COPY src src

# RUN RUN apt-get update && apt-get install -y build-essential
RUN npm install 

ENV AWS_REGION="us-east-2"
ENV ENVIRONMENT=dev

CMD ["node", "src/index.js"]