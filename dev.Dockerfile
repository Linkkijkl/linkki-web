FROM ghcr.io/gohugoio/hugo:latest

USER root:root
RUN npm install -g yarn pagefind
USER 1000:1000

RUN echo -e \
"#!/bin/sh \n \
[ ! -x \"link-node-dependencies.sh\" ] && echo \"No sources found. Remember to mount them to /project\" && exit 1 \n \
yarn \n \
hugo \n \
pagefind --site public \n \
hugo server --bind 0.0.0.0" > /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh

WORKDIR /project
ENTRYPOINT [ "/tmp/entrypoint.sh" ]
