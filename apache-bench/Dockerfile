FROM alpine:3.6

RUN apk add --update curl apache2-utils && rm -rf /var/cache/apk/*

ENTRYPOINT [ "ab" ]
