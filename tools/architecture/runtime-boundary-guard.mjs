#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

const ROUTE_ROOT = 'apps/api/src/routes';
const TARGET_FILES = [
    'apps/api/src/index.ts',
    'apps/ui/src/pages/StorePreview.tsx',
    'apps/ui/src/components/PageComponentsEditor.tsx'
];

const ROUTE_RULES = [
    {
        id: 'no-theme-hardcode-in-routes',
        pattern: /\btheme-raed-master\b/gi,
        message: 'لا يُسمح بربط المسارات بثيم محدد داخل طبقة routes.'
    },
    {
        id: 'no-themes-fs-coupling-in-routes',
        pattern: /packages\/themes|twilight\.json/gi,
        message: 'لا يُسمح بقراءة ملفات الثيم مباشرة داخل routes. استخدم engine/services.'
    }
];

const UI_RULES = [
    {
        id: 'no-theme-hardcode-in-ui-preview',
        pattern: /\btheme-raed-master\b/gi,
        message: 'لا يُسمح بـ hardcode لثيم محدد في طبقة UI preview/editor.'
    }
];

function readFile(relPath) {
    return fs.readFileSync(path.join(rootDir, relPath), 'utf8');
}

function collectRouteFiles(dirRel) {
    const dirAbs = path.join(rootDir, dirRel);
    if (!fs.existsSync(dirAbs)) return [];

    const files = [];
    const walk = (currentAbs) => {
        const entries = fs.readdirSync(currentAbs, { withFileTypes: true });
        for (const entry of entries) {
            const abs = path.join(currentAbs, entry.name);
            if (entry.isDirectory()) {
                walk(abs);
                continue;
            }
            if (!/\.(ts|tsx|js|mjs)$/i.test(entry.name)) continue;
            files.push(path.relative(rootDir, abs).replace(/\\/g, '/'));
        }
    };

    walk(dirAbs);
    return files;
}

function lineAndColumn(text, offset) {
    const before = text.slice(0, offset);
    const lines = before.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return { line, column };
}

function evaluateRules(relPath, content, rules) {
    const violations = [];
    for (const rule of rules) {
        const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const location = lineAndColumn(content, match.index);
            violations.push({
                ruleId: rule.id,
                message: rule.message,
                relPath,
                line: location.line,
                column: location.column,
                snippet: match[0]
            });
        }
    }
    return violations;
}

function run() {
    const routeFiles = collectRouteFiles(ROUTE_ROOT);
    const targetFiles = [...routeFiles, ...TARGET_FILES].filter((relPath) =>
        fs.existsSync(path.join(rootDir, relPath))
    );

    const violations = [];
    for (const relPath of targetFiles) {
        const content = readFile(relPath);
        const isRouteFile = relPath.startsWith(`${ROUTE_ROOT}/`);
        const rules = isRouteFile ? ROUTE_RULES : UI_RULES;
        violations.push(...evaluateRules(relPath, content, rules));
    }

    if (!violations.length) {
        console.log('[RUNTIME-GUARD] Passed: no forbidden runtime coupling detected.');
        process.exit(0);
    }

    console.error('[RUNTIME-GUARD] Failed: runtime boundary violations detected.');
    for (const entry of violations) {
        console.error(
            `  - [${entry.ruleId}] ${entry.relPath}:${entry.line}:${entry.column} :: ${entry.message} :: "${entry.snippet}"`
        );
    }
    process.exit(1);
}

run();
