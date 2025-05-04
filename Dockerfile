FROM node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=3000

RUN apk add --no-cache dumb-init  \
    && addgroup -S ophra  \
    && adduser -S ophra -G ophra \
    && corepack enable

WORKDIR /app

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM base AS final

COPY --from=build /app/dist/apps ./
COPY --from=prod-deps /app/node_modules ./node_modules

EXPOSE $PORT

USER ophra

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "main.js"]
