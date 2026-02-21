# VTDR Documentation Traceability Map

Last updated: 2026-02-19
Scope: Active docs only (code-first, test-backed)

## 1) Mapping

| Document                                               | Role                                               | Code References                                                                                                                                                                                                                   | Test References                                                                                                           | Status |
| ------------------------------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| `Docs/Specifications/API_SPEC.md`                      | Canonical API inventory and behavior               | `apps/api/src/index.ts`, `apps/api/src/routes/runtime.routes.ts`, `apps/api/src/routes/simulator.routes.ts`, `apps/api/src/routes/store.routes.ts`, `apps/api/src/routes/theme.routes.ts`, `apps/api/src/routes/system.routes.ts` | `apps/api/src/integration/api.integration.test.ts`, `apps/api/src/integration/theme-runtime-contract.integration.test.ts` | Active |
| `Docs/Specifications/DATA_SCHEMA_SPEC.md`              | Canonical data model (Store-First)                 | `packages/data/prisma/schema.prisma`, `packages/data/src/prisma-repository.ts`                                                                                                                                                    | `apps/api/src/integration/api.integration.test.ts`, `packages/contracts/src/schemas.test.ts`                              | Active |
| `Docs/Specifications/Database Design Document.md`      | Runtime persistence design                         | `packages/data/prisma/schema.prisma`, `packages/data/src/prisma-repository.ts`                                                                                                                                                    | `apps/api/src/integration/api.integration.test.ts`                                                                        | Active |
| `Docs/Specifications/SYSTEM_SPEC.md`                   | Runtime topology and boundaries                    | `apps/api/src/index.ts`, `packages/engine/index.ts`, `apps/ui/src/App.tsx`                                                                                                                                                        | `apps/api/src/integration/api.integration.test.ts`, `apps/api/src/integration/theme-runtime-contract.integration.test.ts` | Active |
| `Docs/Specifications/Master Specification.md`          | System-level governance and delivery alignment     | `package.json`, `tools/doc-drift/doc-drift.mjs`, `tools/architecture/runtime-boundary-guard.mjs`                                                                                                                                  | `npm run validate` pipeline                                                                                               | Active |
| `Docs/VTDR_Docs/VTDR_Canonical_Runtime_Contract_v1.md` | Runtime contract for preview/simulator             | `apps/api/src/routes/runtime.routes.ts`, `apps/api/public/sdk-bridge.js`, `packages/engine/src/rendering/renderer-service.ts`, `packages/engine/src/rendering/preview-render-orchestrator.ts`                                     | `apps/api/src/integration/theme-runtime-contract.integration.test.ts`                                                     | Active |
| `Docs/DEV.md`                                          | Developer runbook (actual commands/ports/guards)   | `package.json`, `apps/api/src/index.ts`, `apps/ui/vite.config.ts`                                                                                                                                                                 | `npm run validate`, manual dev run                                                                                        | Active |
| `Docs/VTDR_Docs/VTDR_Restructure_Execution_Roadmap.md` | Architecture execution phases and closure criteria | `packages/engine/src/rendering/*`, `apps/api/src/routes/*`, `tools/perf/preview-baseline.mjs`                                                                                                                                     | `apps/api/src/integration/api.integration.test.ts`, `apps/api/src/integration/theme-runtime-contract.integration.test.ts` | Active |
| `Docs/VTDR_Docs/VTDR_Architecture_Decision_Log.md`     | ADR history and accepted architecture decisions    | `apps/api/src/index.ts`, `packages/engine/src/providers/*`, `packages/engine/src/rendering/*`                                                                                                                                     | `npm run validate` + unit/integration suites                                                                              | Active |
| `INSTRUCTIONS_RESTRUCTURE_PLAN.md`                     | Operational execution log by slices/phases         | Monorepo runtime files touched per execution day                                                                                                                                                                                  | `npm run validate` checkpoints                                                                                            | Active |

## 2) Enforcement Rules

1. Any change in API routes must update:
   - `Docs/VTDR/API-ROUTES.snapshot.json` via `npm run docs:sync`
   - `Docs/Specifications/API_SPEC.md` when group/contract semantics change
2. Any change in Prisma schema must update:
   - `Docs/VTDR/DATA-SCHEMA.snapshot.json` via `npm run docs:sync`
   - `Docs/Specifications/DATA_SCHEMA_SPEC.md` if model semantics changed
3. Active-doc traceability gate must pass:
   - `npm run docs:traceability`
4. A documentation update is accepted only if `npm run validate` passes.

## 3) Non-Active Docs Policy

1. Non-active or historical docs remain in `archive/*`.
2. Active docs must stay in `Docs/*` and be traceable to code/tests.
3. If traceability is missing for a doc, mark it `Audit/Historical` or archive it.
