FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm install typescript @types/node --save-dev

RUN npm run build

RUN npm prune --production

EXPOSE 8082

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "dist/index.js"]
