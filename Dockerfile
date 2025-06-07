
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

FROM node:22-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma
COPY --from=dependencies /app/generated /app/generated


COPY . .

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

FROM node:22-alpine AS production


WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/generated /app/generated
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./

RUN apk add --no-cache openssl

EXPOSE 3000

CMD ["node", "dist/main"]