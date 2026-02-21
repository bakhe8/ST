# VTDR Unified Execution Blueprint (Code-First)

Last updated: 2026-02-18
Cleanup pass: 2026-02-17 (Docs scope reduction)

## 1) Objective

Provide one executable workflow for moving VTDR safely from current state to the next delivery cycles without reintroducing doc/code drift.

## 2) Current Baseline (Completed)

Completed foundation tracks:

1. Context contract stabilization.
2. Preview routing stabilization.
3. CRUD parity for active simulator resources.
4. Theme settings persistence boundary (`themeSettingsJson`).
5. Legacy scenario cleanup on active paths.
6. Integration/unit test gate activation.
7. Documentation drift gate + CI validation pipeline.

## 3) Execution Tracks (Next)

### Track A: Spec Completion (Documentation Layer)

Goal:

- eliminate remaining generic/speculative docs.

Execution:

1. Keep all core specs in `Docs/Specifications` aligned with snapshots and runtime code.
2. Mark non-normative docs as advisory/historical where applicable.

Exit criteria:

- no core spec file contains template-only content.
- all core specs pass consistency review against runtime code.

### Track B: Contract Normalization (API Layer)

Goal:

- finish envelope normalization across remaining non-unified endpoints.

Execution:

1. identify endpoints returning non-standard success/error structures.
2. normalize with shared response helper pattern.
3. update tests for affected endpoints.

Exit criteria:

- active UI-facing endpoints conform to one response contract.

### Track C: Runtime Coverage Expansion (Quality Layer)

Goal:

- increase protection against regression on core flows.

Execution:

1. add integration tests for store lifecycle edge cases.
2. add simulator/resource negative-path tests.
3. add preview failure-mode tests.

Exit criteria:

- test failures directly map to contract breaks, not placeholders.

## 4) Mandatory Workflow Per Change

For any runtime-impacting change:

1. implement code change.
2. run `npm run docs:sync` if routes/schema changed.
3. update affected spec docs.
4. run `npm run validate`.
5. merge only if CI passes.

## 5) Operational Command Set

```powershell
npm run dev
npm run docs:sync
npm run docs:drift
npm run validate
```

## 6) Governance Rule

No new feature work proceeds if one of the following is broken:

1. `docs:drift` fails.
2. core specs are stale relative to route/schema snapshots.
3. integration tests for affected boundaries are missing.
