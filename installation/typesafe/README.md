# TypeSafe / Jev (System One) — x79

Hosted **System 1** inference for the future harness Decision Facade. x79 uses **TypeSafe only** or `jev.mode=off` (see `document/harness/researches/01.decision-facade/02.hybrid-decision-facade-design.md`).

## Layout

| Path | Purpose |
|------|---------|
| `typesafe.env` | `TYPESAFE_API_KEY` + defaults — **tracked** on private GitLab (maintainer-only) |
| `typesafe.env.example` | Template without secrets |
| `lib/load-env.mjs` | Load env for Bun scripts |
| `smoke-jev.mjs` | `GET /v1/models` + minimal `POST /v1/systemone` |
| `export-env.sh` | `source` in shell for `TYPESAFE_API_KEY` / `JEV_MODE` |
| `install.sh` | Copy env to `~/.gemini/antigravity/typesafe.env` + smoke test |

Harness policy (no secrets): `<repo>/.harness/decision-policy.json`.

## Quick start

```bash
cd installation/typesafe
bash install.sh

# Optional — current shell
source installation/typesafe/export-env.sh
bun run installation/typesafe/smoke-jev.mjs
```

## Environment

| Variable | Default | Notes |
|----------|---------|--------|
| `TYPESAFE_API_KEY` | — | From [console](https://console.typesafe.ai/keys) |
| `TYPESAFE_API_BASE` | `https://api.typesafe.ai` | Do not point at resellers |
| `TYPESAFE_MODEL` | `jev-latest` | Pin e.g. `jev-1.13.0` for benchmarks |
| `JEV_MODE` | `shadow` in env | Facade reads `.harness/decision-policy.json` when implemented |
| `TYPESAFE_ENV_FILE` | repo `typesafe.env` | Override path for scripts |

## Security

- Key in git is **intentional** for this private repo. If collaborators join or the repo is mirrored public, **rotate the key** in the console and move secrets to gitignored `typesafe.env.local`.
- Never paste keys into agent transcripts or SDLC docs.

## Related

- Research: `document/harness/researches/01.decision-facade/01.system-one-jev-harness-research.md`
- WBS: `document/harness/researches/01.decision-facade/03.hybrid-decision-facade-wbs.md` (G4)
