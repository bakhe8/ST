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
   - announcements.
   - advanced moderation/state flows for blog/posts, reviews/questions, and offers.
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
`Slice-07: Inventory + Merchandising Visual Parity`

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
- Closed: visual data sources and page composition rendering implemented in code and validated by integration pipeline (`npm run validate`) on 2026-02-18.

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
- `variable-list` controls now use one unified editor control (top-level + collection sub-fields), preserving source-aware behavior, static/custom URL handling, and the existing modal picker workflow.

## Slice-03 Scope
- Blog domain parity:
  - `blog/categories` CRUD APIs with normalized payload shape (`id/name/title/slug/url/order`).
  - `blog/articles` CRUD APIs with normalized payload shape (`title/slug/summary/url/image/category_id`).
- Seed realism:
  - auto-seed includes blog categories and articles to make visual linking flows immediately usable.
- UI management:
  - dedicated dashboard screens for blog categories and blog articles.
- Theme authoring impact:
  - `theme/components` variable-list options for `blog_articles` and `blog_categories` must be populated from real store data.
- Tests:
  - integration coverage for blog CRUD and variable-list propagation.

### Slice-03 Status
- Closed: end-to-end implementation shipped and validated by integration pipeline (`npm run validate`) on 2026-02-18.

### Slice-03 Progress Notes
- Added simulator routes under `/api/v1/blog/categories*` and `/api/v1/blog/articles*`.
- Added simulator-service normalization for blog category/article payloads, including URL/slug defaults and category resolution.
- Extended seeding to generate realistic blog categories and articles per store.
- Added dashboard screens:
  - `/store/:storeId/blog/categories`
  - `/store/:storeId/blog/articles`
- Integration tests now assert:
  - blog CRUD behavior
  - population of `variable-list` options for `blog_articles/blog_categories`.

## Slice-04 Scope
- Brands domain parity:
  - `brands` CRUD APIs with normalized payload (`id/name/title/slug/url/logo/banner/order`).
  - Dashboard management screen for brands.
  - Theme component options must reflect brand CRUD changes immediately.
- Offers domain parity:
  - `offers` CRUD APIs with normalized payload (`title/slug/discount_type/discount_value/starts_at/ends_at/is_active`).
  - Dashboard management screen for special offers.
  - Seed must include realistic special offers for immediate store realism.
- Tests:
  - integration coverage for brand CRUD + offer CRUD + brand option propagation into `theme/components`.

### Slice-04 Status
- Closed: end-to-end implementation shipped and validated by integration pipeline (`npm run validate`) on 2026-02-18.

### Slice-04 Progress Notes
- Added simulator routes under:
  - `/api/v1/brands*`
  - `/api/v1/offers*`
- Added simulator-service normalization and persistence flows for brand/offer payloads.
- Extended seeding to generate `specialOffer` entities with active discount windows.
- Added dashboard screens:
  - `/store/:storeId/brands`
  - `/store/:storeId/offers`
- Integration tests now assert:
  - brand CRUD behavior
  - offer CRUD behavior
  - immediate propagation of brand updates/deletion into `theme/components` selectable options.

## Slice-05 Scope
- Navigation menu parity:
  - Replace static mock menu payload with store-scoped persisted menus (`header/footer`).
  - Keep menu shape compatible with theme runtime (`title/url/order/children/products/image/attrs/link_attrs`).
- API contract:
  - `GET /api/v1/menus/:type` (resolved from store data with smart fallback defaults).
  - `PUT /api/v1/menus/:type` for authoring and persistence.
- UI management:
  - dedicated dashboard screen for editing header/footer menu items and nested children.
- Seed realism:
  - auto-seed must provide baseline header/footer menus for immediate preview navigation.
- Tests:
  - integration coverage for menu read/write and nested structure persistence.

### Slice-05 Status
- Closed: first end-to-end implementation shipped and validated by integration pipeline (`npm run validate`) on 2026-02-18.

### Slice-05 Progress Notes
- `SimulatorService.getMenus` now reads store-scoped `menu` entities and falls back to generated defaults based on available categories/pages.
- Added `SimulatorService.updateMenus` to persist normalized menu payload per type (`header` / `footer`).
- Added API endpoint:
  - `PUT /api/v1/menus/:type`
- Extended seeding with baseline menu payloads:
  - `menu/header`
  - `menu/footer`
- Added dashboard screen:
  - `/store/:storeId/menus`
- Integration tests now assert:
  - menu fallback read behavior
  - menu nested write/read round-trip for header/footer.

## Slice-06 Scope
- Reviews parity:
  - `reviews` CRUD APIs with normalized payload shape (`title/content/stars/customer_name/is_published/is_verified/product_id`).
  - Dashboard management screen for product reviews.
- Questions parity:
  - `questions` CRUD APIs with normalized payload shape (`question/answer/customer_name/is_answered/is_published/product_id`).
  - Dashboard management screen for product Q&A.
- Product visual feedback coupling:
  - product `rating` and `comments` must be recomputed from published reviews.
  - product `questions` and `questions_count` must be recomputed from question entities.
- Theme authoring impact:
  - `theme/components` sources must expose `reviews` and `questions` options for variable-list flows.
- Tests:
  - integration coverage for review/question CRUD and feedback metric propagation into products.

### Slice-06 Status
- Closed: end-to-end implementation shipped and validated by integration pipeline (`npm run validate`) on 2026-02-18.

### Slice-06 Progress Notes
- Added simulator routes under:
  - `/api/v1/reviews*`
  - `/api/v1/questions*`
  - `/api/v1/products/:id/reviews`
  - `/api/v1/products/:id/questions`
- Added simulator-service normalization + persistence flows for reviews/questions with store-safe product resolution.
- Added feedback metric recomputation after review/question mutations:
  - `rating.stars`, `rating.count`
  - `comments[]`
  - `questions[]`, `questions_count`
- Extended seeding with realistic review/question entities per store to keep preview behavior populated.
- Added dashboard screens:
  - `/store/:storeId/reviews`
  - `/store/:storeId/questions`
- Integration tests now assert:
  - review CRUD behavior
  - question CRUD behavior
  - product feedback metric recomputation and propagation.

### Slice-06 Exit Criteria
1. Review create/update/delete updates product rating/comments deterministically.
2. Question create/update/delete updates product questions/questions_count deterministically.
3. Review/question CRUD is available via dedicated dashboard screens.
4. `theme/components` includes usable `reviews/questions` data sources.
5. Integration tests remain green under `npm run validate`.
