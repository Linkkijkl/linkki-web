FROM alpine AS builder
RUN apk update && apk add hugo npm
RUN apk add dart-sass --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing
# Install pagefind
RUN npx pagefind --version
# Install yarn
RUN npx yarn --version
# Copy site
ADD . /source
WORKDIR /source
# Fetch dependencies
RUN npx yarn
# Build site
RUN hugo --minify
# Build search index
RUN npx pagefind --site public

FROM nginx:alpine
RUN mkdir -p /tmp/cache/tmp
COPY --from=builder /source/public /usr/share/nginx/html
COPY dev-nginx.conf /etc/nginx/nginx.conf
