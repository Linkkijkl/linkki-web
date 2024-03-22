FROM klakegg/hugo:ext-alpine-onbuild AS hugo

FROM nginx:alpine
COPY --from=hugo /target /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
