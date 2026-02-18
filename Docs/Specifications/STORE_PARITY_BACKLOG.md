# VTDR Store Parity Backlog (Product-First)

Last updated: 2026-02-18  
Owner: VTDR Core Team  
Scope: Close the gap between current virtual stores and practical Salla-like store behavior for theme development.

## Goal
Raise VTDR store realism so theme design/customization decisions are based on realistic store capabilities, data, and state transitions.

## Prioritization Model
- `P0`: Mandatory for MVP parity.
- `P1`: High impact after P0 closure.
- `P2`: Nice-to-have / optimization after functional parity.

## P0 (Must Have)
1. Product domain parity:
   - Unified product shape across API/UI/Preview.
   - Support `images`, `main_image`, `options`, `variants`, `category_ids`.
   - Category references must be consistent (ids + resolved objects).
2. Category domain parity:
   - Support hierarchical categories with stable parent mapping (`parent_id` / `parentId`).
   - Category CRUD reflected immediately in products and preview.
3. Theme settings + component parity:
   - Store-scoped settings and component composition must round-trip.
   - Preview must consume effective store state.
4. Core store simulation parity:
   - Cart behavior stable (`add/update/remove/totals`).
   - Store data seeding must avoid broken external assets.
5. End-to-end slice tests:
   - For each closed P0 slice: `Schema -> API -> UI -> Preview`.

## P1 (After P0)
1. Checkout simulation depth:
   - shipping zones, taxes, payment methods, coupon effects.
2. Content domains:
   - blog/posts, reviews/questions, offers, announcements.
3. Inventory + merchandising behavior:
   - stock rules, out-of-stock states, product sorting/filters.
4. Sync maturity:
   - stronger conflict handling and partial sync reporting.

## P2 (Later)
1. Advanced observability dashboards.
2. Full RBAC matrix.
3. Performance profiling and large-store stress scenarios.

## Execution Method (Vertical Slices)
Each slice is closed only when all are done:
1. Data model + normalization.
2. API endpoints and contracts.
3. UI authoring flow.
4. Preview behavior.
5. Integration tests.

## Current Active Slice
`Slice-02: Theme Visual Parity (Settings + Page Components)`

### Slice-01 Scope
- Product shape unification:
  - `category_ids` + resolved `categories`
  - `main_image`/`thumbnail` derivation from `images`
  - normalized `options`/`variants`
- Category shape unification:
  - bidirectional compatibility for `parent_id` and `parentId`
  - root rendering and parent resolution in UI
- UI updates:
  - Product list filtering and display by normalized category ids.
  - Product editor supports categories/options/variants editing flow.
- Seed updates:
  - remove dependency on external placeholder host.

### Slice-01 Status
- Closed: implemented and validated by integration tests (`apps/api/src/integration/api.integration.test.ts`) on 2026-02-18.

### Slice-01 Closure Notes
- Product payload now normalizes legacy/external placeholder URLs (`via.placeholder.com`) to local runtime placeholder.
- Category delete now cleans product category references and reparents child categories to root.
- Integration test covers category/product round-trip, category deletion side-effects, and preview continuity.

### Slice-01 Exit Criteria
1. Product edit/save round-trip preserves categories/options/variants correctly.
2. Product list filtering by category works for both seeded and synced data.
3. Category tree renders correctly from root and nested nodes.
4. Preview remains functional after product/category updates.
5. Integration tests remain green.

## Slice-02 Scope
- Theme settings persistence must merge updates instead of replacing stored values.
- Page components editor must load/save real `page_compositions` for the selected store.
- Preview must consume `themeSettingsJson` and page composition overrides for home components.
- Store UI should expose page components editing flow as a first-class screen.

### Slice-02 Status
- In progress: visual data sources and page composition rendering implemented in code and validated by integration pipeline (`npm run validate`) on 2026-02-18.

### Slice-02 Progress Notes
- `theme/components` now returns real selectable options for `products/categories/brands` based on store data.
- Page components editor supports multi-select for `items` fields and saves IDs into `page_compositions`.
- Renderer resolves selected IDs to full entities before Twig render (brands/categories/products), with visual fallback content when no explicit selection exists.
- Collection fields in page components now use a structured visual editor (rows + subfields) for `main-links / enhanced-slider / square-banners / testimonials`, replacing raw JSON editing in the primary flow.
- `variable-list` now has a source-aware editor in UI (source + value) and a unified runtime resolver in preview, including collection subfields such as `links.url` and `banners.url`.
- `variable-list` option pickers now support in-editor search/filter to handle large store datasets without degrading authoring speed.
- `variable-list` selection now supports a dedicated modal picker (search + sort + URL preview) to improve usability for high-volume options.
- `page_compositions` now supports per-component visual visibility rules (`visibility.enabled`, `visibility.viewport`) with runtime filtering in preview.
- Preview flow now supports explicit device mode (`viewport=desktop|mobile`) and dashboard preview provides a direct desktop/mobile switch for visual validation.
- Page Components editor now applies field-level `conditions` from theme schema at runtime, so conditional fields appear/disappear immediately based on current form values (including `collection` sub-fields).
- Conditional `static` blocks are now visible in the editor flow, and save-time hidden-field policy is explicit (`preserve` vs `clear`) to control payload shape stability.
- Boolean controls (`switch` / `checkbox`) in Page Components editor now use a unified visual control style with consistent on/off state presentation.
- Textual controls (`text` / `textarea` / `image` / `icon`) now use a unified editor control style with shared label/description behavior and image preview support.
- Selection controls (`dropdown` / multi-select) and numeric controls (`number` / `integer`) now use unified editor controls, including inline range guidance for numeric constraints.
