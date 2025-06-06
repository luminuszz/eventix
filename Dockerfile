
FROM node:alpine

WORKDIR /app


COPY package.json .

COPY . .

RUN corepack enable

RUN corepack prepare pnpm@latest --activate

RUN pnpm install

CMD ["pnpm", "run", "start:dev"]