FROM alpine AS builder
RUN apk update && apk add hugo npm dart-sass
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
COPY --from=builder /source/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
