FROM alpine AS builder
RUN apk update && apk add hugo
ADD . /source
WORKDIR /source
RUN hugo

FROM nginx:alpine
COPY --from=builder /source/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
