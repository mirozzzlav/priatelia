FROM node:22-slim

WORKDIR /app/web

COPY web/package.json web/package-lock.json ./
RUN npm ci

COPY web .
COPY shared /app/shared

EXPOSE 4444

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4444"]
