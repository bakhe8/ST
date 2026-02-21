#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mode = process.argv[2] || "check";
if (!["check", "sync"].includes(mode)) {
    console.error("Usage: node tools/doc-drift/doc-drift.mjs [check|sync]");
    process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");

const API_INDEX_REL = "apps/api/src/index.ts";
const PRISMA_SCHEMA_REL = "packages/data/prisma/schema.prisma";
const API_SNAPSHOT_REL = "Docs/VTDR/API-ROUTES.snapshot.json";
const SCHEMA_SNAPSHOT_REL = "Docs/VTDR/DATA-SCHEMA.snapshot.json";

function readText(relPath) {
    return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

function writeJson(relPath, value) {
    const absPath = path.join(rootDir, relPath);
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function toRouteFileRel(factoryName) {
    const slug = factoryName
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase();
    return `apps/api/src/routes/${slug}.routes.ts`;
}

function normalizePath(basePath, routePath) {
    const cleanBase = basePath === "/" ? "" : basePath.replace(/\/+$/, "");
    const cleanRoute = routePath.replace(/^\/+/, "");
    if (!cleanRoute) return cleanBase || "/";
    const joined = `${cleanBase}/${cleanRoute}`.replace(/\/{2,}/g, "/");
    return joined.startsWith("/") ? joined : `/${joined}`;
}

function extractMountedFactories(indexSource) {
    const mounts = [];
    const routeVars = new Map();

    const varRegex = /const\s+([A-Za-z0-9_]+)\s*=\s*create([A-Za-z]+)Routes\(/g;
    let varMatch;
    while ((varMatch = varRegex.exec(indexSource)) !== null) {
        routeVars.set(varMatch[1], varMatch[2]);
    }

    const directMountRegex =
        /(apiRouter|app)\.use\(\s*'([^']+)'\s*,[^;\n]*?create([A-Za-z]+)Routes\(/g;
    let match;
    while ((match = directMountRegex.exec(indexSource)) !== null) {
        const owner = match[1];
        const mountPath = match[2];
        const factory = match[3];
        const prefix = owner === "apiRouter" ? "/api" : "";
        mounts.push({
            owner,
            factory,
            mountPath: `${prefix}${mountPath}`.replace(/\/{2,}/g, "/"),
        });
    }

    const variableMountRegex =
        /(apiRouter|app)\.use\(\s*'([^']+)'\s*,\s*([A-Za-z0-9_]+)\s*\)/g;
    let variableMatch;
    while ((variableMatch = variableMountRegex.exec(indexSource)) !== null) {
        const owner = variableMatch[1];
        const mountPath = variableMatch[2];
        const variableName = variableMatch[3];
        const factory = routeVars.get(variableName);
        if (!factory) continue;
        const prefix = owner === "apiRouter" ? "/api" : "";
        mounts.push({
            owner,
            factory,
            mountPath: `${prefix}${mountPath}`.replace(/\/{2,}/g, "/"),
        });
    }

    return mounts;
}

function extractAppDirectRoutes(indexSource) {
    const routes = [];
    const directRegex = /app\.(get|post|put|patch|delete)\(\s*'([^']+)'\s*,/g;
    let match;
    while ((match = directRegex.exec(indexSource)) !== null) {
        routes.push({
            method: match[1].toUpperCase(),
            path: match[2],
            source: API_INDEX_REL,
        });
    }
    return routes;
}

function extractRouterRoutes(routeSource, sourceFileRel) {
    const routes = [];
    const routeRegex = /router\.(get|post|put|patch|delete)\(\s*'([^']+)'/g;
    let match;
    while ((match = routeRegex.exec(routeSource)) !== null) {
        routes.push({
            method: match[1].toUpperCase(),
            routePath: match[2],
            source: sourceFileRel,
        });
    }
    return routes;
}

function buildApiSnapshot() {
    const indexSource = readText(API_INDEX_REL);
    const mountedFactories = extractMountedFactories(indexSource);
    const endpoints = extractAppDirectRoutes(indexSource);

    for (const mount of mountedFactories) {
        const routeFileRel = toRouteFileRel(mount.factory);
        const routeFileAbs = path.join(rootDir, routeFileRel);
        if (!fs.existsSync(routeFileAbs)) continue;

        const routeSource = readText(routeFileRel);
        const definitions = extractRouterRoutes(routeSource, routeFileRel);
        for (const def of definitions) {
            endpoints.push({
                method: def.method,
                path: normalizePath(mount.mountPath, def.routePath),
                source: def.source,
            });
        }
    }

    const deduped = new Map();
    for (const endpoint of endpoints) {
        const key = `${endpoint.method} ${endpoint.path}`;
        if (!deduped.has(key)) deduped.set(key, endpoint);
    }

    const sorted = Array.from(deduped.values()).sort((a, b) => {
        const byPath = a.path.localeCompare(b.path);
        if (byPath !== 0) return byPath;
        return a.method.localeCompare(b.method);
    });

    return {
        version: 1,
        generatedFrom: {
            apiIndex: API_INDEX_REL,
        },
        totalEndpoints: sorted.length,
        endpoints: sorted,
    };
}

function buildSchemaSnapshot() {
    const schemaSource = readText(PRISMA_SCHEMA_REL);
    const hash = crypto.createHash("sha256").update(schemaSource).digest("hex");
    const modelMatches = [
        ...schemaSource.matchAll(/^\s*model\s+([A-Za-z0-9_]+)\s+\{/gm),
    ];
    const models = modelMatches
        .map((m) => m[1])
        .sort((a, b) => a.localeCompare(b));

    return {
        version: 1,
        generatedFrom: PRISMA_SCHEMA_REL,
        sha256: hash,
        modelCount: models.length,
        models,
    };
}

function readSnapshot(relPath) {
    const absPath = path.join(rootDir, relPath);
    if (!fs.existsSync(absPath)) return null;
    return JSON.parse(fs.readFileSync(absPath, "utf8"));
}

function routeKey(route) {
    return `${route.method} ${route.path}`;
}

function compareRoutes(expected, actual) {
    const expectedSet = new Set(expected.endpoints.map(routeKey));
    const actualSet = new Set(actual.endpoints.map(routeKey));
    const missing = [...expectedSet].filter((x) => !actualSet.has(x)).sort();
    const extra = [...actualSet].filter((x) => !expectedSet.has(x)).sort();
    return { missing, extra };
}

function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

const apiCurrent = buildApiSnapshot();
const schemaCurrent = buildSchemaSnapshot();

if (mode === "sync") {
    writeJson(API_SNAPSHOT_REL, apiCurrent);
    writeJson(SCHEMA_SNAPSHOT_REL, schemaCurrent);
    console.log(
        `[DOC-DRIFT] Synced snapshots: ${API_SNAPSHOT_REL}, ${SCHEMA_SNAPSHOT_REL}`,
    );
    process.exit(0);
}

const apiExpected = readSnapshot(API_SNAPSHOT_REL);
const schemaExpected = readSnapshot(SCHEMA_SNAPSHOT_REL);

let failed = false;

if (!apiExpected) {
    console.error(`[DOC-DRIFT] Missing snapshot: ${API_SNAPSHOT_REL}`);
    failed = true;
} else {
    const { missing, extra } = compareRoutes(apiExpected, apiCurrent);
    if (missing.length || extra.length) {
        failed = true;
        console.error("[DOC-DRIFT] API routes drift detected.");
        if (missing.length) {
            console.error(`  Missing routes in code (${missing.length}):`);
            for (const item of missing) console.error(`    - ${item}`);
        }
        if (extra.length) {
            console.error(
                `  New/changed routes not documented (${extra.length}):`,
            );
            for (const item of extra) console.error(`    - ${item}`);
        }
    }
}

if (!schemaExpected) {
    console.error(`[DOC-DRIFT] Missing snapshot: ${SCHEMA_SNAPSHOT_REL}`);
    failed = true;
} else {
    const hashMismatch = schemaExpected.sha256 !== schemaCurrent.sha256;
    const modelsMismatch = !arraysEqual(
        schemaExpected.models,
        schemaCurrent.models,
    );
    if (hashMismatch || modelsMismatch) {
        failed = true;
        console.error("[DOC-DRIFT] Prisma schema drift detected.");
        if (hashMismatch) {
            console.error(`  Expected sha256: ${schemaExpected.sha256}`);
            console.error(`  Current  sha256: ${schemaCurrent.sha256}`);
        }
        if (modelsMismatch) {
            console.error(
                `  Expected models: ${schemaExpected.models.join(", ")}`,
            );
            console.error(
                `  Current  models: ${schemaCurrent.models.join(", ")}`,
            );
        }
    }
}

if (failed) {
    console.error(
        "[DOC-DRIFT] Run: npm run docs:sync then update documentation files in Docs/Specifications.",
    );
    process.exit(1);
}

console.log("[DOC-DRIFT] No drift detected for API routes and Prisma schema.");
