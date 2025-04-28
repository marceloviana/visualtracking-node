FROM node:20-slim AS prod

WORKDIR '/app'
COPY . .

# RUN RUN apt-get update && apt-get install -y build-essential
RUN npm install

ENV AWS_REGION="us-east-2"
ENV ENVIRONMENT=dev

CMD ["npm", "start"]