#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const index = args.indexOf(`--${name}`);
    if (index === -1) return fallback;
    const value = args[index + 1];
    if (!value || value.startsWith("--")) return fallback;
    return value;
};

const registryRel = getArg(
    "registry",
    "Docs/VTDR_Docs/SALLA_CONTRACT_COVERAGE_REGISTRY.json",
);
const outputDirRel = getArg("outputDir", "Docs/VTDR");
const strictPassEvidence = getArg("strictPassEvidence", "true") !== "false";

const allowedStatus = new Set(["GAP", "PARTIAL", "PASS", "N/A"]);

const asPosix = (value) => String(value || "").replace(/\\/g, "/");
const nowIso = () => new Date().toISOString();
const timestampToken = () =>
    nowIso().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "-");

const readJson = (relPath) => {
    const absPath = path.join(rootDir, relPath);
    if (!fs.existsSync(absPath)) {
        throw new Error(`Registry file not found: ${relPath}`);
    }
    return JSON.parse(fs.readFileSync(absPath, "utf8"));
};

const looksLikeUrl = (value) =>
    /^https?:\/\//i.test(String(value || "").trim());

const validatePathRefs = (refs, fieldName, contractId, errors, warnings) => {
    if (!Array.isArray(refs)) {
        errors.push(`[${contractId}] "${fieldName}" must be an array.`);
        return;
    }

    refs.forEach((ref) => {
        const normalized = asPosix(ref).trim();
        if (!normalized) return;
        if (looksLikeUrl(normalized)) return;
        const abs = path.join(rootDir, normalized);
        if (!fs.existsSync(abs)) {
            errors.push(
                `[${contractId}] Missing file reference in "${fieldName}": ${normalized}`,
            );
        }
    });

    if (!refs.length) {
        warnings.push(`[${contractId}] "${fieldName}" is empty.`);
    }
};

const run = () => {
    const errors = [];
    const warnings = [];

    let registry;
    try {
        registry = readJson(registryRel);
    } catch (error) {
        console.error(`[CONTRACT-COVERAGE] ${String(error.message || error)}`);
        process.exit(1);
    }

    const requiredCoverageIds = Array.isArray(registry?.requiredCoverageIds)
        ? registry.requiredCoverageIds
              .map((entry) => String(entry || "").trim())
              .filter(Boolean)
        : [];
    const contracts = Array.isArray(registry?.contracts)
        ? registry.contracts
        : [];
    const defaults =
        registry?.defaults && typeof registry.defaults === "object"
            ? registry.defaults
            : {};

    if (!String(registry?.version || "").trim()) {
        errors.push('Missing "version" in registry.');
    }
    if (!requiredCoverageIds.length) {
        errors.push('Missing or empty "requiredCoverageIds".');
    }
    if (!contracts.length) {
        errors.push('Missing or empty "contracts".');
    }

    const byId = new Map();
    for (const contract of contracts) {
        const id = String(contract?.id || "").trim();
        if (!id) {
            errors.push('Found contract without "id".');
            continue;
        }
        if (byId.has(id)) {
            errors.push(`Duplicate contract id: ${id}`);
            continue;
        }
        byId.set(id, contract);
    }

    for (const id of requiredCoverageIds) {
        if (!byId.has(id)) {
            errors.push(
                `Required coverage id is missing from contracts list: ${id}`,
            );
        }
    }

    for (const [id, contract] of byId.entries()) {
        const title = String(contract?.title || "").trim();
        const group = String(contract?.group || defaults?.group || "").trim();
        const sourceUrl = String(
            contract?.sourceUrl || defaults?.sourceUrl || "",
        ).trim();
        const status = String(contract?.status || defaults?.status || "")
            .trim()
            .toUpperCase();
        const milestone = String(
            contract?.milestone || defaults?.milestone || "",
        ).trim();
        const implementationRefs = Array.isArray(contract?.implementationRefs)
            ? contract.implementationRefs
            : Array.isArray(defaults?.implementationRefs)
              ? defaults.implementationRefs
              : [];
        const testRefs = Array.isArray(contract?.testRefs)
            ? contract.testRefs
            : Array.isArray(defaults?.testRefs)
              ? defaults.testRefs
              : [];

        if (!title) errors.push(`[${id}] Missing "title".`);
        if (!group) errors.push(`[${id}] Missing "group".`);
        if (!sourceUrl) {
            errors.push(`[${id}] Missing "sourceUrl".`);
        } else if (!looksLikeUrl(sourceUrl)) {
            errors.push(`[${id}] "sourceUrl" must be a URL: ${sourceUrl}`);
        }
        if (!milestone) {
            errors.push(`[${id}] Missing "milestone".`);
        }
        if (!allowedStatus.has(status)) {
            errors.push(
                `[${id}] Invalid status "${status}". Allowed: ${Array.from(allowedStatus).join(", ")}`,
            );
        }

        validatePathRefs(
            implementationRefs,
            "implementationRefs",
            id,
            errors,
            warnings,
        );
        validatePathRefs(testRefs, "testRefs", id, errors, warnings);

        if (strictPassEvidence && status === "PASS") {
            if (!implementationRefs.length) {
                errors.push(
                    `[${id}] PASS requires at least one implementation reference.`,
                );
            }
            if (!testRefs.length) {
                errors.push(
                    `[${id}] PASS requires at least one test reference.`,
                );
            }
        }

        if (Array.isArray(contract?.dependsOn)) {
            contract.dependsOn.forEach((dep) => {
                const depId = String(dep || "").trim();
                if (!depId) return;
                if (!byId.has(depId)) {
                    errors.push(
                        `[${id}] dependsOn references unknown id: ${depId}`,
                    );
                }
            });
        }
    }

    const statusCounts = contracts.reduce((acc, contract) => {
        const status = String(contract?.status || defaults?.status || "")
            .trim()
            .toUpperCase();
        acc[status] = Number(acc[status] || 0) + 1;
        return acc;
    }, {});

    const report = {
        generatedAt: nowIso(),
        registry: registryRel,
        strictPassEvidence,
        totals: {
            requiredCoverageIds: requiredCoverageIds.length,
            contracts: contracts.length,
        },
        statusCounts,
        errors,
        warnings,
        pass: errors.length === 0,
    };

    const outputDir = path.join(rootDir, outputDirRel);
    fs.mkdirSync(outputDir, { recursive: true });
    const latestPath = path.join(outputDir, "CONTRACT-COVERAGE.latest.json");
    const versionedPath = path.join(
        outputDir,
        `CONTRACT-COVERAGE.${timestampToken()}.json`,
    );
    fs.writeFileSync(latestPath, JSON.stringify(report, null, 2), "utf8");
    fs.writeFileSync(versionedPath, JSON.stringify(report, null, 2), "utf8");

    if (errors.length > 0) {
        console.error("[CONTRACT-COVERAGE] Failed.");
        errors.forEach((entry) => console.error(`  - ${entry}`));
        console.error(
            `[CONTRACT-COVERAGE] Report: ${asPosix(path.relative(rootDir, latestPath))}`,
        );
        process.exit(1);
    }

    console.log(
        `[CONTRACT-COVERAGE] Passed | contracts=${contracts.length} | required=${requiredCoverageIds.length} | PASS=${statusCounts.PASS || 0} | PARTIAL=${statusCounts.PARTIAL || 0} | GAP=${statusCounts.GAP || 0}`,
    );
    if (warnings.length > 0) {
        console.log(
            `[CONTRACT-COVERAGE] Warnings=${warnings.length} (see report).`,
        );
    }
    console.log(
        `[CONTRACT-COVERAGE] Report: ${asPosix(path.relative(rootDir, latestPath))}`,
    );
};

run();
