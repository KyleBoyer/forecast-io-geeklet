FROM alpine
RUN apk update && apk add --update nodejs-current-npm
RUN mkdir -p /app/
ADD package* /app/
WORKDIR /app/
RUN npm i --only-production
ADD * /app/
EXPOSE 8080
ENTRYPOINT ["sh","-c","node /app/index.js"]