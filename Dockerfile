FROM alpine AS builder
ADD . /source
WORKDIR /source
RUN apk update && apk add hugo
RUN hugo

FROM nginx:alpine
COPY --from=builder /source/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
