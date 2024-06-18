FROM alpine AS builder
RUN apk update && apk add hugo npm
# Install pagefind
RUN npx pagefind --version
# Copy site
ADD . /source
WORKDIR /source
# Build with hugo
RUN hugo
# Build search index
RUN npx pagefind --site public

FROM nginx:alpine
COPY --from=builder /source/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
