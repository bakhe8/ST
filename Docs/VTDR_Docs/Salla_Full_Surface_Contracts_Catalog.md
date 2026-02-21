# Salla Full Surface Contracts Catalog (VTDR)

تاريخ التحديث: 2026-02-21  
الحالة: Active  
الهدف: تثبيت أن نطاق المطابقة لا يقتصر على `Update Product Option`، بل يشمل كامل سطح سلة الخاص بالثيمات والمتاجر.

## 1) Source of Truth (Official)

1. Theme docs index: `https://docs.salla.dev/422558m0`
2. Product option update example: `https://docs.salla.dev/5394196e0`
3. Partners themes surface: `https://salla.partners/themes`
4. Development stores guide: `https://salla.dev/tutorial/arabic-showcase-your-work-with-development-stores/`
5. Help center article: `https://help.salla.sa/article/544057905`

## 2) Full Surface Catalog (beyond Product Option)

| Surface               | Sub-surface                                 | Canonical Source                           | VTDR Mapping                                             | Status  |
| --------------------- | ------------------------------------------- | ------------------------------------------ | -------------------------------------------------------- | ------- |
| Theme Lifecycle       | Create/Develop/Setup/Publish                | `docs.salla.dev` + `salla.partners/themes` | Dashboard + Theme routes                                 | PARTIAL |
| Requirements & Review | UI/UX + Technical + Metadata + Pre-Launch   | `docs.salla.dev`                           | Theme validation/reporting layers                        | PARTIAL |
| Theme Structure       | Directory structure + `twilight.json`       | `docs.salla.dev`                           | Theme loader/registry + validator                        | PARTIAL |
| Twig Runtime          | Layouts + master + flavored twig            | `docs.salla.dev`                           | Renderer/Twig runtime                                    | PASS    |
| Global Variables      | Store/Page/User/Product/etc                 | `docs.salla.dev`                           | Composition/preview context                              | PARTIAL |
| Hooks                 | Runtime hooks contract                      | `docs.salla.dev`                           | Hook service + twig hook tag                             | PARTIAL |
| Localizations         | locale dictionaries + fallback              | `docs.salla.dev`                           | Renderer i18n + translations map                         | PARTIAL |
| Storefront Pages      | home/products/category/brands/blog/cart/... | `docs.salla.dev`                           | Preview routes + context resolver                        | PARTIAL |
| Customer Pages        | profile/orders/wishlist/notifications       | `docs.salla.dev`                           | Customer preview branches + simulator APIs               | PARTIAL |
| Components: Home      | sliders/banners/links/features/brands       | `docs.salla.dev`                           | Theme component runtime + data source resolver           | PARTIAL |
| Components: Product   | essentials/options/similar/offer            | `docs.salla.dev`                           | Product runtime + option contract + related/offer source | PARTIAL |
| Components: Common    | header/footer/comments                      | `docs.salla.dev`                           | Menu/footer/reviews/questions runtime                    | PARTIAL |
| API Surface           | `/api/v1/*` parity behavior                 | `docs.salla.dev`                           | Simulator routes + service                               | PARTIAL |
| Dev Store Ops         | behavior in development stores              | `salla.dev` + `help.salla.sa`              | VTDR preview/simulator workflow                          | PARTIAL |

## 3) What is already done (outside Product Option)

1. Source-driven page context for `/products` and `/blog` in runtime preview.
2. Category/blog source resolution by route + query (`source/source_type/source_value`).
3. Semantic parity tests for preview routes (contract + browser gates).
4. Extended seeding/backfill for core preview entities.
5. Translation fallback to reduce raw key leakage in preview.

## 4) What remains mandatory for full parity

1. Complete global variables contract against official theme docs (page-by-page).
2. Complete component capability contract (home/product/common) with diagnostics mode.
3. Deep API behavior parity (filters, pagination semantics, edge-state handling).
4. Theme lifecycle/review workflow parity in dashboard.
5. Multi-theme matrix (not one theme) as release gate.

## 5) Execution rule

لا يتم اعتماد أي إغلاق إلا إذا اجتاز:

1. Contract test
2. API integration test
3. Browser parity test
4. Traceable update in parity matrix
