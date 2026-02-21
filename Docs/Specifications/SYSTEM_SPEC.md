# VTDR System Specification (As-Is)

Last updated: 2026-02-18  
Cleanup pass: 2026-02-17 (Docs scope reduction)  
Normative source: runtime code in `apps/*` and `packages/*`.

## 1) Purpose

Define the current operational behavior of VTDR as a Store-First runtime platform for theme simulation, validation, and preview.

## 2) System Scope

In scope:

- Virtual store lifecycle management.
- Theme discovery/registration/sync from local themes directory.
- Store-scoped simulator resources.
- Runtime preview rendering.

Out of scope (current implementation):

- Real merchant production integration.
- Background workers/queues.
- Full contract coverage for all Salla surfaces.

## 3) Runtime Components

1. UI Dashboard (`apps/ui`)
2. Unified API (`apps/api`)
3. Engine runtime modules (`packages/engine`)
4. Data repositories + Prisma (`packages/data`)
5. Shared contracts (`packages/contracts`)

## 4) Operational Contracts

- Context contract:
  - Store context is required for simulator/runtime paths.
  - Resolution order is defined in `apps/api/src/services/context-resolver.ts`.
- API route contract:
  - Canonical route list is snapshot-driven: `Docs/VTDR/API-ROUTES.snapshot.json`.
- Data schema contract:
  - Canonical schema state is snapshot-driven: `Docs/VTDR/DATA-SCHEMA.snapshot.json`.

## 5) Main Runtime Flows

### 5.1 Store Management Flow

1. API receives store operation under `/api/stores/*` or `/api/v1/stores/*`.
2. Route delegates to `StoreFactory`/`StoreLogic`.
3. Repository persists/retrieves via Prisma.
4. API returns envelope response.

### 5.2 Simulator Flow

1. Request enters `/api/v1/*` simulator routes.
2. Context middleware resolves and injects store.
3. `SimulatorService` maps request to store-scoped entities (`DataEntity`).
4. API returns simulator envelope with metadata/pagination.

### 5.3 Preview Flow

1. Request enters `/preview/:storeId/:themeId/:version`.
2. Context middleware resolves store.
3. `CompositionEngine` builds runtime context.
4. `RendererService` renders Twig-based HTML.
5. Response is HTML.

## 6) State Ownership Rules

- Store is the primary state owner.
- Runtime content must be scoped by `storeId`.
- Theme settings are persisted in `themeSettingsJson`.
- Branding payload remains separated in `brandingJson`.

## 7) Validation Gates

- Local/CI validation entrypoint: `npm run validate`.
- Validation sequence:
  1. `npm run docs:drift`
  2. `npm run build`
  3. `npm run lint`
  4. `npm run test`

## 8) Known Active Constraints

- API response shapes are mostly unified but not fully normalized on every endpoint.
- No dedicated background processing layer exists.
- Some docs outside core specs may still be advisory/historical.

## 9) Change Control

Any system-level change must include:

1. Runtime code change.
2. Snapshot sync if routes/schema changed (`npm run docs:sync`).
3. Related spec update (`ARCHITECTURE.md`, this file, API/Data specs as applicable).
4. Passing `npm run validate`.
