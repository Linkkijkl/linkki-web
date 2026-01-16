FROM alpine:edge AS builder
RUN apk update && apk add hugo npm
RUN apk add dart-sass --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing
# Install yarn and pagefind
RUN npm install -g yarn pagefind
# Copy site
ADD . /source
WORKDIR /source
# Fetch dependencies
RUN yarn
# Build site
RUN hugo --minify
# Build search index
RUN pagefind --site public

FROM nginx:alpine
COPY --from=builder /source/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
