#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const parseArgs = () => {
    const args = process.argv.slice(2);
    const out = {};
    for (let i = 0; i < args.length; i += 1) {
        const token = String(args[i] || "");
        if (!token.startsWith("--")) continue;
        const key = token.slice(2);
        const value =
            args[i + 1] && !String(args[i + 1]).startsWith("--")
                ? args[i + 1]
                : "true";
        out[key] = value;
        if (value !== "true") i += 1;
    }
    return out;
};

const asNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const nowIso = () => new Date().toISOString();

const timestampToken = () => {
    const iso = nowIso();
    return iso.replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "-");
};

const readJsonFile = (filePath) => {
    if (!filePath || !fs.existsSync(filePath)) return null;
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        return null;
    }
};

const runCommand = (label, command, cwd, env) => {
    console.log(`[parity-baseline] Running ${label}: ${command}`);
    const result = spawnSync(command, {
        cwd,
        env: { ...process.env, ...env },
        shell: true,
        stdio: "inherit",
    });
    const exitCode = Number(result.status ?? 1);
    return { label, command, exitCode, ok: exitCode === 0 };
};

const computeRatio = (summary) => {
    const explicit = Number(summary?.successRatio);
    if (Number.isFinite(explicit)) return explicit;
    const checked = Number(summary?.routesChecked || 0);
    const passed = Number(summary?.routesPassed || 0);
    return checked > 0 ? passed / checked : 0;
};

const run = () => {
    const args = parseArgs();
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const repoRoot = path.resolve(scriptDir, "../..");
    const docsDir = path.resolve(
        repoRoot,
        String(args.outputDir || "Docs/VTDR"),
    );

    const minCoreRouteSuccessRatio = asNumber(args.minCoreRouteSuccessRatio, 1);
    const minBrowserRouteSuccessRatio = asNumber(
        args.minBrowserRouteSuccessRatio,
        1,
    );
    const maxCriticalConsoleErrors = asNumber(args.maxCriticalConsoleErrors, 0);
    const maxPageErrors = asNumber(args.maxPageErrors, 0);

    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "vtdr-parity-baseline-"),
    );
    const contractMetricsFile = path.join(tempDir, "contract-metrics.json");
    const browserMetricsFile = path.join(tempDir, "browser-metrics.json");

    const contractRun = runCommand(
        "contract-gate",
        "npm run test --workspace=@vtdr/api -- --run src/integration/theme-runtime-contract.integration.test.ts",
        repoRoot,
        { VTDR_PARITY_CONTRACT_METRICS_FILE: contractMetricsFile },
    );
    const browserRun = runCommand(
        "browser-gate",
        "npm run test:e2e:preview",
        repoRoot,
        { VTDR_PARITY_BROWSER_METRICS_FILE: browserMetricsFile },
    );

    const contractMetrics = readJsonFile(contractMetricsFile);
    const browserMetrics = readJsonFile(browserMetricsFile);

    const contractSummary = contractMetrics?.summary || {};
    const browserSummary = browserMetrics?.summary || {};

    const coreRouteSuccessRatio = computeRatio(contractSummary);
    const browserRouteSuccessRatio = computeRatio(browserSummary);
    const criticalConsoleErrors = Number(
        browserSummary?.criticalConsoleErrors || 0,
    );
    const pageErrors = Number(browserSummary?.pageErrors || 0);

    const checks = [
        {
            key: "contract-core-route-success-ratio",
            expected: `>= ${minCoreRouteSuccessRatio}`,
            actual: coreRouteSuccessRatio,
            pass: coreRouteSuccessRatio >= minCoreRouteSuccessRatio,
        },
        {
            key: "browser-route-success-ratio",
            expected: `>= ${minBrowserRouteSuccessRatio}`,
            actual: browserRouteSuccessRatio,
            pass: browserRouteSuccessRatio >= minBrowserRouteSuccessRatio,
        },
        {
            key: "critical-console-errors",
            expected: `<= ${maxCriticalConsoleErrors}`,
            actual: criticalConsoleErrors,
            pass: criticalConsoleErrors <= maxCriticalConsoleErrors,
        },
        {
            key: "page-errors",
            expected: `<= ${maxPageErrors}`,
            actual: pageErrors,
            pass: pageErrors <= maxPageErrors,
        },
    ];

    const overallPass =
        contractRun.ok &&
        browserRun.ok &&
        Boolean(contractMetrics) &&
        Boolean(browserMetrics) &&
        checks.every((entry) => entry.pass);

    const report = {
        generatedAt: nowIso(),
        thresholds: {
            minCoreRouteSuccessRatio,
            minBrowserRouteSuccessRatio,
            maxCriticalConsoleErrors,
            maxPageErrors,
        },
        runs: [contractRun, browserRun],
        checks,
        overallPass,
        contract: contractMetrics,
        browser: browserMetrics,
    };

    fs.mkdirSync(docsDir, { recursive: true });
    const timestamp = timestampToken();
    const latestPath = path.join(docsDir, "PARITY-BASELINE.latest.json");
    const versionedPath = path.join(
        docsDir,
        `PARITY-BASELINE.${timestamp}.json`,
    );
    fs.writeFileSync(latestPath, JSON.stringify(report, null, 2), "utf8");
    fs.writeFileSync(versionedPath, JSON.stringify(report, null, 2), "utf8");

    try {
        fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
        // Ignore temp cleanup failures.
    }

    console.log(
        `[parity-baseline] Report (latest): ${path.relative(repoRoot, latestPath)}`,
    );
    console.log(
        `[parity-baseline] Report (versioned): ${path.relative(repoRoot, versionedPath)}`,
    );
    console.log(
        `[parity-baseline] Result: ${overallPass ? "PASS" : "FAIL"} | contract=${coreRouteSuccessRatio.toFixed(4)} | browser=${browserRouteSuccessRatio.toFixed(4)} | console=${criticalConsoleErrors} | pageErrors=${pageErrors}`,
    );

    if (!overallPass) {
        process.exitCode = 1;
    }
};

run();
