FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i -g pnpm
RUN npm install
COPY . .
RUN pnpm run build

EXPOSE 8080
CMD ["pnpm", "run", "start"]