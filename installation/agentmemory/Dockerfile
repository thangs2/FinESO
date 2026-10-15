# Dockerfile — agentmemory (single container, engine + worker)
#
# Runs both the III engine (Rust) and agentmemory worker (Node.js) in one
# container, exactly like the official upstream deploy pattern.
# Architecture: https://github.com/aiagentmemory/agentmemory
#
# After container start:
#   III engine → REST API :3111, WS :49134, streams :3112, viewer :3113
#   Worker     → registers functions with engine via WS, runs viewer

ARG III_VERSION=0.11.2
ARG AGENTMEMORY_VERSION=0.9.12
ARG III_SDK_VERSION=0.11.2

# ── Stage 1: get engine binary ────────────────────────────────────────────
FROM iiidev/iii:${III_VERSION} AS iii-image

# ── Stage 2: runtime image ────────────────────────────────────────────────
FROM node:22-slim

# Re-declare build args — ARG before FROM is not visible in RUN unless repeated here.
ARG AGENTMEMORY_VERSION=0.9.12
ARG III_SDK_VERSION=0.11.2

# CA certs + tini (signal handling) + gosu (drop privileges)
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl tini gosu \
 && rm -rf /var/lib/apt/lists/*

# Copy engine binary; agentmemory's startup code detects it by scanning PATH
COPY --from=iii-image /app/iii /usr/local/bin/iii

# Install agentmemory with pinned iii-sdk version to match pinned engine.
# npm install -g ignores overrides, so we install into a local prefix.
WORKDIR /opt/agentmemory
RUN printf '{"name":"agentmemory","version":"1.0.0","private":true,"overrides":{"iii-sdk":"%s"}}\n' "${III_SDK_VERSION}" > package.json \
 && npm install "@agentmemory/agentmemory@${AGENTMEMORY_VERSION}" --omit=optional --no-fund --no-audit \
 && ln -s /opt/agentmemory/node_modules/.bin/agentmemory /usr/local/bin/agentmemory \
 && AM_DIST=/opt/agentmemory/node_modules/@agentmemory/agentmemory/dist \
 && PATCH_FILES="$(grep -rl 'server\.listen([^,]*, "127\.0\.0\.1"' "$AM_DIST" || true)" \
 && if [ -z "$PATCH_FILES" ]; then \
      echo "ERROR: viewer listen patch target not found under $AM_DIST" >&2; \
      ls -la "$AM_DIST" >&2 || true; \
      exit 1; \
    fi \
 && echo "$PATCH_FILES" | xargs -r sed -i \
      's/server\.listen(\([^,]*\), "127\.0\.0\.1"/server.listen(\1, "0.0.0.0"/g' \
 && grep -q 'server\.listen([^,]*, "0.0.0.0"' $(echo "$PATCH_FILES" | tr '\n' ' ') \
 && echo "Patched viewer bind in: $(echo "$PATCH_FILES" | tr '\n' ' ')"

# Copy first-boot entrypoint (handles config override + HMAC secret generation)
COPY --chmod=0755 entrypoint.sh /usr/local/bin/agentmemory-entrypoint.sh

ENV TINI_SUBREAPER=1

EXPOSE 3111 3112 3113 49134 9464

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3111/agentmemory/livez || exit 1

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/agentmemory-entrypoint.sh"]
