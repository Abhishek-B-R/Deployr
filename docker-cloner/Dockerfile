FROM node:20-alpine

# THIS IS REQUIRED:
RUN apk add --no-cache git

WORKDIR /app

COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

EXPOSE 8080
CMD ["pnpm", "run", "start"]