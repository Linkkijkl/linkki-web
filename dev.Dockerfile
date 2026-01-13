FROM ghcr.io/gohugoio/hugo:latest AS dependencies
WORKDIR /build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=link-node-dependencies.sh,target=link-node-dependencies.sh \
    npx yarn

FROM ghcr.io/gohugoio/hugo:latest AS runner
WORKDIR /project
COPY --link --from=dependencies /build/assets/node/ /project/assets/node/
ENTRYPOINT [ "hugo", "server" ]
