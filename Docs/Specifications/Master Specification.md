# VTDR Master Specification

Last updated: 2026-02-18
Cleanup pass: 2026-02-17 (Docs scope reduction)

## 1) Specification Hierarchy

This file defines the normative hierarchy for current VTDR documentation.

Priority order (highest to lower):

1. Runtime code (`apps/*`, `packages/*`)
2. `ARCHITECTURE.md`
3. `Docs/Specifications/SYSTEM_SPEC.md`
4. `Docs/Specifications/API_SPEC.md`
5. `Docs/Specifications/DATA_SCHEMA_SPEC.md`
6. Other docs in `Docs/*` (advisory unless explicitly marked normative)

If a conflict exists, higher priority wins.

## 2) Canonical Truth Artifacts

- API routes snapshot: `Docs/VTDR/API-ROUTES.snapshot.json`
- Data schema snapshot: `Docs/VTDR/DATA-SCHEMA.snapshot.json`
- Drift checker: `tools/doc-drift/doc-drift.mjs`

## 3) Mandatory Engineering Gates

Every change targeting runtime behavior must pass:

1. Drift gate (`npm run docs:drift`)
2. Build gate (`npm run build`)
3. Type/lint gate (`npm run lint`)
4. Test gate (`npm run test`)

Unified command:

```powershell
npm run validate
```

CI executes the same command through `.github/workflows/ci.yml`.

## 4) Required Update Matrix

### 4.1 API Route Changes

Required updates:

1. code route files
2. `npm run docs:sync`
3. `Docs/Specifications/API_SPEC.md` if contract group/behavior changed
4. related integration tests

### 4.2 Prisma Schema Changes

Required updates:

1. `packages/data/prisma/schema.prisma`
2. `npm run docs:sync`
3. `Docs/Specifications/DATA_SCHEMA_SPEC.md`
4. repository/service tests affected

### 4.3 System Boundary/Flow Changes

Required updates:

1. runtime wiring code
2. `ARCHITECTURE.md`
3. `Docs/Specifications/SYSTEM_SPEC.md`

## 5) Stability Objective

Current objective is to keep VTDR maintainable by preventing silent drift across:

- UI to API contract
- API to Engine behavior
- Engine to Data schema
- Docs to runtime

## 6) Definition of Done (Documentation + Runtime)

A change is complete only when:

1. implementation passes `npm run validate`
2. required specs are updated in the same change
3. no drift is reported by `docs:drift`
