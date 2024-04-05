FROM node:16-alpine
USER root
WORKDIR /app

ARG API_PORT

COPY /api .
COPY migrations .
COPY database.json .
COPY index.js .
COPY package.json .
COPY package-lock.json .

RUN npm install

HEALTHCHECK --interval=15m --timeout=2s \
  CMD curl -f http://localhost:${API_PORT}/statusCheck || exit 1

EXPOSE ${API_PORT}

ENTRYPOINT [ "npm", "start" ]
