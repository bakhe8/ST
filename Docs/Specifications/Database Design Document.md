# VTDR Database Design Document (As-Is)

Last updated: 2026-02-18  
Schema source: `packages/data/prisma/schema.prisma`

## 1) Database Engine
- Provider: SQLite
- ORM: Prisma
- Runtime URL: `DATABASE_URL` from root `.env`

## 2) Design Principle
- Store-First tenancy:
  - `Store` is the anchor entity.
  - Runtime content/state records are keyed by `storeId`.
- Theme runtime separation:
  - theme defaults come from theme files.
  - store-specific theme values are persisted in `themeSettingsJson`.

## 3) Core Entity Map

### Theme Domain
- `Theme`
  - metadata + identity for installed themes.
- `ThemeVersion`
  - concrete version details for a theme.
  - unique key: `[themeId, version]`.

### Store Domain
- `Store`
  - store identity, active theme/version, view state, settings json fields.
- `StoreState`
  - runtime projection of active theme/page/viewport/settings.

### Runtime Composition Domain
- `ComponentState`
  - per-component settings/visibility.
  - unique key: `[storeId, componentPath, instanceOrder]`.
- `PageComposition`
  - page-level composition payload.
  - unique key: `[storeId, page]`.
- `DataBinding`
  - binding rules between components and data sources.

### Runtime Content Domain
- `DataEntity`
  - flexible typed content payload for simulator resources.
  - unique key: `[storeId, entityType, entityKey]`.
- `Collection`
  - named logical grouping of entities.
- `CollectionItem`
  - bridge between collection and entities.
  - composite key: `[collectionId, entityId]`.
- `Snapshot`
  - saved runtime snapshots by store.

## 4) Relationship Characteristics
- Most child entities have mandatory `storeId` foreign key to `Store`.
- Theme linkage is explicit from `Store` to `Theme` and `ThemeVersion`.
- Cascade semantics are handled by repository/application flow (not fully delegated to DB constraints).

## 5) Write Path Responsibilities
- API routes orchestrate intent.
- Engine (`StoreLogic`/`SimulatorService`) applies runtime rules.
- Prisma repositories perform DB mutation.

## 6) Runtime Integrity Rules
1. No cross-store mutation without explicit `storeId`.
2. Theme settings write path must target `themeSettingsJson`.
3. Data entity writes should preserve entity identity (`id`/`entityKey`).

## 7) Schema Drift Governance
- Canonical schema fingerprint and model list:
  - `Docs/VTDR/DATA-SCHEMA.snapshot.json`
- Schema drift is checked by:
```powershell
npm run docs:drift
```
- Snapshot refresh command:
```powershell
npm run docs:sync
```
