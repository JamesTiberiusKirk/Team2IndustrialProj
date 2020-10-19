FROM node:alpine as builder
RUN apk update && apk add --no-cache make git

COPY package.json package-lock.json /app/
RUN cd /app && npm install

COPY .  /app
RUN cd /app && npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/* 
COPY ./nginx/web.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/angular-test /usr/share/nginx/html

EXPOSE 80