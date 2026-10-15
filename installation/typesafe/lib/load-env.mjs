import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const installDir = join(moduleDir, "..");

const ENV_CANDIDATES = [
    process.env.TYPESAFE_ENV_FILE,
    join(installDir, "typesafe.env"),
    join(homedir(), ".gemini", "antigravity", "typesafe.env"),
].filter(Boolean);

/** @param {string} line */
function applyEnvLine(line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
        return;
    }
    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
        return;
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
        process.env[key] = value;
    }
}

export function loadTypesafeEnv() {
    for (const path of ENV_CANDIDATES) {
        if (!existsSync(path)) {
            continue;
        }
        const text = readFileSync(path, "utf8");
        for (const line of text.split("\n")) {
            applyEnvLine(line);
        }
        return path;
    }
    return null;
}

export function requireTypesafeKey() {
    loadTypesafeEnv();
    const key = process.env.TYPESAFE_API_KEY;
    if (!key || key.includes("your_key_here")) {
        throw new Error(
            "TYPESAFE_API_KEY missing. Set installation/typesafe/typesafe.env or TYPESAFE_ENV_FILE.",
        );
    }
    return key;
}
