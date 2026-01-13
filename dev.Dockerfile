FROM ghcr.io/gohugoio/hugo:latest
WORKDIR /project

RUN --mount=type=bind,source=package.json,target=/project/package.json \
    --mount=type=bind,source=link-node-dependencies.sh,target=/project/link-node-dependencies.sh \
    npx yarn

ENTRYPOINT [ "hugo", "server" ]
