#!/usr/bin/env node
/**
 * Smoke test: GET /v1/models + POST /v1/systemone (minimal noul).
 * Usage: bun run installation/typesafe/smoke-jev.mjs
 */
import { loadTypesafeEnv, requireTypesafeKey } from "./lib/load-env.mjs";

const loadedFrom = loadTypesafeEnv();
const apiKey = requireTypesafeKey();
const base = (process.env.TYPESAFE_API_BASE || "https://api.typesafe.ai").replace(/\/$/, "");
const model = process.env.TYPESAFE_MODEL || "jev-latest";

async function getModels() {
    const res = await fetch(`${base}/v1/models`, {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    const body = await res.text();
    if (!res.ok) {
        throw new Error(`GET /v1/models ${res.status}: ${body}`);
    }
    return JSON.parse(body);
}

async function postSystemOne() {
    const payload = {
        model,
        state: "x79 harness smoke: agent asked to rename a DTO folder without acceptance criteria.",
        questions: {
            needs_human: {
                type: "noul",
                instructions: "Does this work require human acceptance or product sign-off before coding?",
            },
        },
    };
    const res = await fetch(`${base}/v1/systemone`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const body = await res.text();
    if (!res.ok) {
        throw new Error(`POST /v1/systemone ${res.status}: ${body}`);
    }
    return JSON.parse(body);
}

console.log(`[typesafe] env loaded from: ${loadedFrom ?? "(process env only)"}`);
console.log(`[typesafe] base=${base} model=${model} jev_mode=${process.env.JEV_MODE ?? "(unset)"}`);

const models = await getModels();
console.log("[typesafe] models:", JSON.stringify(models, null, 2));

const answer = await postSystemOne();
console.log("[typesafe] systemone:", JSON.stringify(answer, null, 2));
console.log("[typesafe] OK");
