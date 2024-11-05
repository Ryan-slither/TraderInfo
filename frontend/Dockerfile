FROM node:18-slim AS development

ENV NODE_ENV development

WORKDIR /frontend
COPY ./frontend/package*.json ./

RUN npm i

COPY ./frontend ./

EXPOSE 3000

CMD ["npm", "run", "dev"]