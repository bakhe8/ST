# VTDR Architecture (As-Is)

Last updated: 2026-02-18  
Source of truth: runtime code in `apps/*` and `packages/*`.

## 1) Runtime Topology
- UI: React + Vite at `http://localhost:3000` (`apps/ui/vite.config.ts`).
- API: Express at `http://localhost:3001` (`apps/api/src/index.ts`).
- Database: SQLite via Prisma schema at `packages/data/prisma/schema.prisma`.
- Theme assets/templates: local filesystem under `packages/themes/*`.

## 2) Real System Boundaries
- `apps/ui`: management dashboard routes and preview shell.
- `apps/api`: ingress, middleware, route mounting, and runtime renderer entry.
- `packages/engine`: business/runtime orchestration (store logic, simulation, composition, rendering integration).
- `packages/data`: repositories and Prisma persistence.
- `packages/contracts`: shared contracts and schemas.

## 3) Request Entry Points
- `GET /api/health`
- `GET /api/debug/test`
- `GET|POST|PUT|PATCH|DELETE /api/*` (sub-routers)
- `GET /preview/:storeId/:themeId/:version`
- `POST /render`

## 4) Context Contract
Context is resolved in this order (`apps/api/src/services/context-resolver.ts`):
1. Header `x-vtdr-store-id`
2. Header `context-store-id`
3. Query `store_id`
4. Route params `:storeId` then `:id`
5. Preview path `/preview/:storeId/...`

Resolved context is injected as:
- `req.storeId`
- `req.store`

## 5) Data Ownership (Store-First)
- Runtime state is owned by `Store`.
- Store is linked to `Theme` + `ThemeVersion`.
- Per-store runtime entities:
  - `DataEntity`
  - `Collection` / `CollectionItem`
  - `DataBinding`
  - `PageComposition`
  - `ComponentState`
  - `Snapshot`
- Theme settings persistence is isolated in `themeSettingsJson` (separate from `brandingJson`).

## 6) Core Flows
- Simulator flow:
  1. Request enters `/api/v1/*`.
  2. Context middleware resolves store.
  3. `SimulatorService` executes read/write via `StoreLogic`.
  4. API returns simulator envelope.
- Preview flow:
  1. Request enters `/preview/:storeId/:themeId/:version`.
  2. Middleware injects store context.
  3. `CompositionEngine.buildContext` builds runtime page context.
  4. `RendererService.renderPage` returns HTML.

## 7) Drift Gate
- Automated drift checker: `tools/doc-drift/doc-drift.mjs`.
- Generated references:
  - `Docs/VTDR/API-ROUTES.snapshot.json`
  - `Docs/VTDR/DATA-SCHEMA.snapshot.json`
- `npm run validate` executes doc/code drift check before build/lint/test.
