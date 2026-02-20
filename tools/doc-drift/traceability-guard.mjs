#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

const TRACEABILITY_MAP_REL = 'Docs/VTDR_Docs/VTDR_Documentation_Traceability_Map.md';
const REQUIRED_ACTIVE_DOCS = [
    'Docs/Specifications/API_SPEC.md',
    'Docs/Specifications/DATA_SCHEMA_SPEC.md',
    'Docs/Specifications/Database Design Document.md',
    'Docs/Specifications/SYSTEM_SPEC.md',
    'Docs/Specifications/Master Specification.md',
    'Docs/VTDR_Docs/VTDR_Canonical_Runtime_Contract_v1.md',
    'Docs/DEV.md',
    'Docs/VTDR_Docs/VTDR_Restructure_Execution_Roadmap.md',
    'Docs/VTDR_Docs/VTDR_Architecture_Decision_Log.md',
    'INSTRUCTIONS_RESTRUCTURE_PLAN.md'
];

const mapAbs = path.join(rootDir, TRACEABILITY_MAP_REL);
if (!fs.existsSync(mapAbs)) {
    console.error(`[DOC-TRACE] Missing traceability map: ${TRACEABILITY_MAP_REL}`);
    process.exit(1);
}

const mapText = fs.readFileSync(mapAbs, 'utf8');
const rowRegex =
    /^\|\s*`([^`]+)`\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*$/gm;

const rows = [];
let match;
while ((match = rowRegex.exec(mapText)) !== null) {
    rows.push({
        docPath: String(match[1] || '').trim(),
        role: String(match[2] || '').trim(),
        codeRefs: String(match[3] || '').trim(),
        testRefs: String(match[4] || '').trim(),
        status: String(match[5] || '').trim()
    });
}

const failures = [];
if (!rows.length) {
    failures.push('No traceability rows found in mapping table.');
}

const activeRows = rows.filter((row) => row.status.toLowerCase() === 'active');
const seenActive = new Set();
for (const row of activeRows) {
    if (seenActive.has(row.docPath)) {
        failures.push(`Duplicate active mapping entry: ${row.docPath}`);
        continue;
    }
    seenActive.add(row.docPath);

    const docAbs = path.join(rootDir, row.docPath);
    if (!fs.existsSync(docAbs)) {
        failures.push(`Mapped active doc does not exist: ${row.docPath}`);
    }
    if (!row.role || row.role === '-') {
        failures.push(`Missing role for active doc: ${row.docPath}`);
    }
    if (!row.codeRefs || row.codeRefs === '-') {
        failures.push(`Missing code references for active doc: ${row.docPath}`);
    }
    if (!row.testRefs || row.testRefs === '-') {
        failures.push(`Missing test references for active doc: ${row.docPath}`);
    }
}

for (const required of REQUIRED_ACTIVE_DOCS) {
    if (!seenActive.has(required)) {
        failures.push(`Required active doc is not mapped: ${required}`);
    }
}

if (failures.length) {
    console.error('[DOC-TRACE] Traceability check failed.');
    for (const item of failures) {
        console.error(`  - ${item}`);
    }
    process.exit(1);
}

console.log(`[DOC-TRACE] Passed (${activeRows.length} active docs mapped).`);

