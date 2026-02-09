FROM node:20-slim AS prod

WORKDIR '/app'
COPY . .
RUN npm install
CMD ["npm", "run", "start"]
