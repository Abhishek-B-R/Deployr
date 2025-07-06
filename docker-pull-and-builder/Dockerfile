FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

EXPOSE 8082
CMD ["pnpm", "run", "start"]