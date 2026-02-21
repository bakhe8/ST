#!/usr/bin/env node

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

const now = () => {
    if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
    ) {
        return performance.now();
    }
    return Date.now();
};

const average = (values) => {
    if (!values.length) return 0;
    return values.reduce((acc, item) => acc + item, 0) / values.length;
};

const percentile = (values, p) => {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.max(
        0,
        Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1),
    );
    return sorted[index];
};

const round = (value) => Math.round(value * 100) / 100;

const run = async () => {
    const args = parseArgs();
    const baseUrl = String(args.baseUrl || "http://localhost:3001").replace(
        /\/+$/,
        "",
    );
    const storeId = String(
        args.storeId || process.env.VTDR_STORE_ID || "",
    ).trim();
    const themeId = String(
        args.themeId || process.env.VTDR_THEME_ID || "theme-raed-master",
    ).trim();
    const version = String(
        args.version || process.env.VTDR_THEME_VERSION || "1.0.0",
    ).trim();
    const page = String(args.page || "index").trim();
    const viewport = String(args.viewport || "desktop").trim();
    const runs = Math.max(1, Number(args.runs || 20));
    const concurrency = Math.max(1, Number(args.concurrency || 5));

    if (!storeId) {
        console.error(
            "[preview-baseline] Missing --storeId (or VTDR_STORE_ID env).",
        );
        process.exitCode = 1;
        return;
    }

    const url = `${baseUrl}/preview/${storeId}/${themeId}/${version}?page=${encodeURIComponent(page)}&refresh=0&viewport=${encodeURIComponent(viewport)}`;
    const samples = [];
    const serverRenderMs = [];
    let failed = 0;

    const worker = async () => {
        while (samples.length + failed < runs) {
            const idx = samples.length + failed + 1;
            const startedAt = now();
            try {
                const response = await fetch(url, { method: "GET" });
                if (!response.ok) {
                    failed += 1;
                    console.error(
                        `[preview-baseline] Request ${idx} failed with ${response.status}`,
                    );
                    continue;
                }
                await response.text();
                const totalMs = now() - startedAt;
                samples.push(totalMs);
                const headerValue = Number(
                    response.headers.get("x-vtdr-render-total-ms") || "0",
                );
                if (Number.isFinite(headerValue) && headerValue > 0) {
                    serverRenderMs.push(headerValue);
                }
            } catch (error) {
                failed += 1;
                console.error(
                    `[preview-baseline] Request ${idx} failed: ${error instanceof Error ? error.message : String(error)}`,
                );
            }
        }
    };

    const workers = Array.from({ length: Math.min(concurrency, runs) }, () =>
        worker(),
    );
    await Promise.all(workers);

    const report = {
        target: {
            baseUrl,
            storeId,
            themeId,
            version,
            page,
            viewport,
        },
        runsRequested: runs,
        runsSucceeded: samples.length,
        runsFailed: failed,
        clientLatencyMs: {
            avg: round(average(samples)),
            p95: round(percentile(samples, 95)),
            min: round(samples.length ? Math.min(...samples) : 0),
            max: round(samples.length ? Math.max(...samples) : 0),
        },
        serverRenderMs: {
            avg: round(average(serverRenderMs)),
            p95: round(percentile(serverRenderMs, 95)),
        },
    };

    console.log(JSON.stringify(report, null, 2));
    if (!samples.length) {
        process.exitCode = 1;
    }
};

run();
