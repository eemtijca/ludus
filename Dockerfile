# Ludus. Imagem da aplicação (Next.js standalone).
# Multi-estágio para manter a imagem final pequena.

# Base comum: habilita o pnpm via Corepack em todos os estágios.
FROM node:24-bookworm-slim AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# 1. Dependências
FROM base AS dependencias
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Compilação
FROM base AS compilacao
WORKDIR /app
COPY --from=dependencias /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# 3. Execução (somente o necessário)
FROM node:24-bookworm-slim AS execucao
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Escuta em todas as interfaces: o healthcheck e os proxies internos usam 127.0.0.1.
ENV HOSTNAME=0.0.0.0
COPY --from=compilacao --chown=node:node /app/.next/standalone ./
COPY --from=compilacao --chown=node:node /app/.next/static ./.next/static
COPY --from=compilacao --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT ?? 3000) + '/api').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "server.js"]
