FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install
COPY . .
RUN npx prisma migrate deploy
RUN npx prisma generate
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "start"]