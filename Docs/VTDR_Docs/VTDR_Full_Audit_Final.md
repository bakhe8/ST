# VTDR – التقرير الشامل النهائي للتدقيق الإدراكي

> **الإصدار**: 2.0 — نسخة موحّدة ومُحدَّثة
> **التاريخ**: 2026-02-21
> **المنهجية**: تدقيق مباشر من الكود + تحقق بالقراءة الفعلية لكل ملف مُشار إليه
> **المصادر**: قراءة مباشرة للكود (Claude) + مراجعة Codex بمراجع السطر
> **ملاحظة**: كل نقطة محكومة بدليل كودي مُوثَّق، لا بتخمين أو توثيق سابق

---

## الفهرس

1. [التقرير الأول: الفهم التشغيلي العميق](#١-الفهم-التشغيلي-العميق)
2. [التقرير الثاني: التدقيق المعرفي للنظام](#٢-التدقيق-المعرفي-للنظام)
3. [التقرير الثالث: خارطة الإجراءات المُحدَّثة](#٣-خارطة-الإجراءات-المحدثة)

---

---

# ١. الفهم التشغيلي العميق

---

## A1. تعريف VTDR كنظام Runtime

### الطبيعة الفعلية للنظام

VTDR هو **الثلاثة معاً في آنٍ واحد**:

| الطبقة                      | الوظيفة الفعلية                                                                  |
| --------------------------- | -------------------------------------------------------------------------------- |
| **Runtime Platform**        | يُشغّل ثيمات Twig ويُنتج HTML حقيقياً قابلاً للعرض في المتصفح                    |
| **Development Environment** | يوفر UI لإدارة بيانات المتجر الافتراضي وإعدادات الثيم                            |
| **Simulator**               | يُحاكي Salla API بالكامل (products/cart/orders/menus/...) بدون اتصال بمتجر حقيقي |

### أين يبدأ Runtime؟

Runtime يبدأ عند استدعاء `GET /preview/:storeId/:themeId/:version`:

1. `contextMiddleware` يحل `storeId` ويتحقق من وجود المتجر في DB
2. `CompositionEngine.buildContext()` يجمع Store + Theme + DataEntities → `RuntimeContext`
3. `RendererService.renderPage()` يُمرر `RuntimeContext` إلى Twig ويُنتج HTML

### ما الذي يُفترض أن يطابق سلة؟

- **بنية RuntimeContext**: تُطابق هيكل Salla Twig context (store، products، categories، hooks، translations)
- **Twig filters/functions**: `|currency`، `|trans`، `|asset`، `salla_url()`، `is_page()`، `{% hook %}`، `{% salla_component %}`
- **هيكل API responses**: يُطابق Salla API v1 format (`{ success, data, pagination }`)

### ما هو تقريب أو مختلف (الحالة الفعلية من الكود)

| العنصر                   | الحالة الفعلية — مُحقَّق من الكود                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `store.url`              | مضبوط على `previewBasePath` = `/preview/:storeId/:theme/:version` — ليس localhost (`renderer-service.ts:881`) |
| `store.api`              | مضبوط على `/api/v1` (نسبي) — ليس host كامل (`renderer-service.ts:880`)                                        |
| `store.logo/avatar/icon` | مضبوطة على `/images/placeholder.png` — ليس Salla CDN (`renderer-service.ts:882`)                              |
| `store.slogan`           | مثبّت على `سوقك في جيبك` (`renderer-service.ts:885`)                                                          |
| `store.username`         | مثبّت على `store_vtdr` (`renderer-service.ts:886`)                                                            |
| `store.contacts`         | مثبّت على أرقام وهمية (`renderer-service.ts:887`)                                                             |
| الصور                    | `/images/placeholder.png` مع fallback عبر `LocalThemeRuntimeAdapter`                                          |
| Cart                     | مُخزَّن في `DataEntity(cart/default)` — دائم عبر الجلسات (`simulator.service.ts:2171`)                        |
| Salla SDK JavaScript     | يُحقن `twilight.min.js` و`sdk-bridge.js` في كل معاينة (`renderer-service.ts:1025-1027`)                       |
| Authentication           | mock فقط — لا JWT حقيقي                                                                                       |
| Payment                  | غير موجود                                                                                                     |
| `old()` function         | يُعيد `''` دائماً — مقصود في سياق المحاكاة                                                                    |
| `SchemaService`          | يعتمد على `temp_twilight_ext/data/` خارج monorepo                                                             |
| واجهة المستخدم (UI)      | تستخدم `VITE_API_URL` أو `${window.location.origin}/api` — ليس hardcoded على localhost                        |

---

## A2. خريطة نقاط الدخول

### A. نقاط دخول HTTP (API)

| المسار                           | الطريقة | الوظيفة                  | المُعالج                         |
| -------------------------------- | ------- | ------------------------ | -------------------------------- |
| `GET /api/health`                | GET     | فحص حالة النظام          | مباشر في index.ts                |
| `GET /api/debug/test`            | GET     | اختبار الاتصال           | مباشر في index.ts                |
| `GET /api/system/*`              | GET     | معلومات النظام + metrics | `system.routes.ts` (3 endpoints) |
| `GET /api/themes`                | GET     | قائمة الثيمات            | `theme.routes.ts`                |
| `POST /api/themes/discover`      | POST    | اكتشاف ثيمات محلية       | `theme.routes.ts`                |
| `POST /api/themes/register`      | POST    | تسجيل ثيم                | `theme.routes.ts`                |
| `POST /api/themes/sync`          | POST    | مزامنة جميع الثيمات      | `theme.routes.ts`                |
| `GET /api/stores`                | GET     | قائمة المتاجر            | `store.routes.ts`                |
| `POST /api/stores`               | POST    | إنشاء متجر جديد          | `store.routes.ts`                |
| `GET /api/stores/:id`            | GET     | بيانات متجر              | `store.routes.ts`                |
| `PATCH /api/stores/:id`          | PATCH   | تحديث متجر               | `store.routes.ts`                |
| `DELETE /api/stores/:id`         | DELETE  | حذف متجر                 | `store.routes.ts`                |
| `POST /api/stores/:id/clone`     | POST    | استنساخ متجر             | `store.routes.ts`                |
| `POST /api/stores/:id/promote`   | POST    | ترقية إلى master         | `store.routes.ts`                |
| `POST /api/stores/:id/inherit`   | POST    | ربط بمتجر أب             | `store.routes.ts`                |
| `PATCH /api/stores/:id/settings` | PATCH   | تحديث إعدادات            | `store.routes.ts`                |
| `POST /api/stores/:id/seed`      | POST    | بذر بيانات demo          | `store.routes.ts`                |
| `POST /api/stores/:id/sync`      | POST    | مزامنة من سلة حقيقي      | `store.routes.ts`                |
| `DELETE /api/stores/:id/data`    | DELETE  | مسح بيانات المتجر        | `store.routes.ts`                |

### B. نقاط دخول Simulator (تحت `/api/v1/`)

جميعها تحت `contextMiddleware`:

**Cart**: GET/POST/PATCH/DELETE `/api/v1/cart`, `/api/v1/cart/items/:itemId`
**Products**: CRUD `/api/v1/products`, `/api/v1/products/:id`
**Brands**: CRUD `/api/v1/brands`, `/api/v1/brands/:id`
**Categories**: CRUD `/api/v1/categories`, `/api/v1/categories/:id`
**Offers**: CRUD `/api/v1/offers`, `/api/v1/offers/:id`
**Reviews**: CRUD `/api/v1/reviews`, `/api/v1/products/:id/reviews`
**Questions**: CRUD `/api/v1/questions`, `/api/v1/products/:id/questions`
**Blog**: CRUD `/api/v1/blog/articles`, `/api/v1/blog/categories`
**Static Pages**: CRUD `/api/v1/static-pages`
**Menus**: GET/PUT `/api/v1/menus/:type`
**Theme Settings**: GET/PUT `/api/v1/theme/settings`, GET `/api/v1/theme/components`
**Auth (Mock)**: POST `/api/v1/auth/login` → `SimulatorAuthOrchestrator.dispatchMockLogin()`

### C. نقاط دخول Rendering

| المسار                                                    | الوظيفة                      |
| --------------------------------------------------------- | ---------------------------- |
| `GET /preview/:storeId/:themeId/:version?page=&viewport=` | رندر HTML كامل للمعاينة      |
| `POST /render`                                            | إرجاع RuntimeContext كـ JSON |
| `GET /themes/*`                                           | خدمة ملفات الثيم الساكنة     |

### D. نقاط دخول UI (React)

| المسار                                     | الصفحة                              |
| ------------------------------------------ | ----------------------------------- |
| `/`                                        | SystemHome                          |
| `/store/:storeId`                          | StoreDashboard                      |
| `/store/:storeId/products`                 | StoreProducts                       |
| `/store/:storeId/products/:productId/edit` | EditProduct                         |
| `/store/:storeId/brands`                   | StoreBrands                         |
| `/store/:storeId/offers`                   | StoreOffers                         |
| `/store/:storeId/reviews`                  | StoreReviews                        |
| `/store/:storeId/questions`                | StoreQuestions                      |
| `/store/:storeId/categories`               | StoreCategories                     |
| `/store/:storeId/static-pages`             | StoreStaticPages                    |
| `/store/:storeId/menus`                    | StoreMenus                          |
| `/store/:storeId/blog/categories`          | StoreBlogCategories                 |
| `/store/:storeId/blog/articles`            | StoreBlogArticles                   |
| `/store/:storeId/settings`                 | StoreSettingsPanel                  |
| `/store/:storeId/theme`                    | ThemeSettingsPanel                  |
| `/store/:storeId/theme-components`         | ThemeComponentsPanel (`App.tsx:54`) |
| `/store/:storeId/preview`                  | StorePreview                        |

### E. نقاط دخول CLI/Scripts

| الأمر                              | الوظيفة                                          |
| ---------------------------------- | ------------------------------------------------ |
| `npm run data:harden:check`        | فحص صحة بيانات المتجر                            |
| `npm run data:harden`              | تصحيح بيانات المتجر                              |
| `npm run docs:sync`                | مزامنة الوثائق                                   |
| `npm run docs:drift`               | فحص انحراف الوثائق                               |
| `npm run docs:traceability`        | تتبع إمكانية التتبع (`package.json:20`)          |
| `npm run guard:runtime-boundaries` | حارس حدود Runtime (`package.json:22`)            |
| `npm run test:e2e:preview`         | اختبارات Playwright للمعاينة (`package.json:28`) |
| `npm run studio`                   | Prisma Studio                                    |

---

## A3. خريطة المكونات

```
┌─────────────────────────────────────────────────────────────────┐
│                         apps/ui (React)                          │
│  SystemHome → StoreProducts/Brands/Categories/... → StorePreview │
│  يتواصل مع API عبر VITE_API_URL أو window.location.origin/api  │
│  (ديناميكي — ليس hardcoded على localhost:3001)                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP (عبر Vite proxy في dev)
┌──────────────────────────▼──────────────────────────────────────┐
│                      apps/api (Express)                          │
│  index.ts: نقطة التهيئة الوحيدة                                 │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │store.routes │ │simulator.rts │ │runtime.rts  │ │theme.rts │ │
│  └──────┬──────┘ └──────┬───────┘ └──────┬──────┘ └────┬─────┘ │
│         │               │                │              │        │
│  ┌──────▼───────────────▼────────────────▼──────────────▼─────┐ │
│  │         contextMiddleware → ContextResolver                  │ │
│  │  يحل storeId ويتحقق من وجود المتجر → 404 إذا لم يُوجد     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │   SimulatorAuthOrchestrator → WebhookService (stub)         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ imports
┌──────────────────────────▼──────────────────────────────────────┐
│                    packages/engine                               │
│  engine/core:                                                    │
│    CompositionEngine → يبني RuntimeContext (18+ DB queries)     │
│    StoreLogic → CRUD + inheritance chain                        │
│    StoreFactory → إنشاء/استنساخ/حذف                            │
│    ContentManager → (مُنشأ لكن غير مُستدعى)                    │
│    LocalizationService → static flatten فقط                    │
│    SchemaService → يقرأ من temp_twilight_ext (خارج monorepo)   │
│                                                                  │
│  engine/rendering:                                               │
│    ThemeLoader → يقرأ twilight.json                             │
│    ThemeRegistry → يسجّل الثيمات في DB                         │
│    RendererService → Twig engine + custom filters/tags           │
│    HomeComponentsResolver → منطق مكونات الصفحة الرئيسية        │
│    PreviewRenderOrchestrator → pipeline كامل مع metrics         │
│                                                                  │
│  engine/providers:                                               │
│    SimulatorService → CRUD كامل لكل كيانات Salla               │
│    SeederService → توليد بيانات demo                            │
│    SynchronizationService → جلب بيانات من سلة حقيقي            │
│    SimulatorAuthOrchestrator → mock login + webhook dispatch    │
│                                                                  │
│  engine/webhooks:                                                │
│    WebhookService → متصل عبر SimulatorAuthOrchestrator         │
│                     لكن getWebhooks() يُعيد [] دائماً           │
│    HookService → in-memory hooks (body:end فقط)                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ imports
┌──────────────────────────▼──────────────────────────────────────┐
│                    packages/data                                  │
│  PrismaClient (SQLite)                                           │
│  PrismaStoreRepository → يجلب Store مع componentStates +       │
│                          pageCompositions + themeVersion         │
│  PrismaDataEntityRepository → Universal JSON blob storage       │
│  PrismaThemeRepository                                           │
│  PrismaCollectionRepository → (غير مستخدم من routes)           │
│  PrismaDataBindingRepository → (غير مستخدم من routes)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ imports
┌──────────────────────────▼──────────────────────────────────────┐
│                  packages/contracts                               │
│  runtime.ts: RuntimeContext, StoreState, SallaProduct, ...      │
│  dal.contract.ts: Repository interfaces                         │
│  src/schemas.ts: BrandingSchema, StoreSettingsSchema (Zod)      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                  packages/themes                                  │
│  theme-raed-master/: ثيم Twig واحد حالياً                      │
│  twilight.json + src/views/ + src/locales/ + public/            │
└─────────────────────────────────────────────────────────────────┘
```

---

## A4. تدفق البيانات

### تدفق المعاينة الكاملة

```
HTTP GET /preview/:storeId/:themeId/:version?page=home
    │
    ▼
contextMiddleware → ContextResolver.resolveStore(storeId)
    → إذا لم يُوجد المتجر → 404
    → req.store = store, req.storeId = storeId
    │
    ▼
CompositionEngine.buildContext(storeId, pageId)
    │
    ├─ storeRepo.getById(storeId) → Store + componentStates + pageCompositions + themeVersion
    ├─ themeRegistry.getTheme(effectiveThemeId) → Theme + ThemeVersion (contractJson)
    │
    ├─ getDataEntities(storeId, 'product')
    ├─ getDataEntities(storeId, 'category')
    ├─ getDataEntities(storeId, 'brand')
    ├─ getDataEntities(storeId, 'page')
    ├─ getDataEntities(storeId, 'blog_article')     ← data فعلية
    ├─ getDataEntities(storeId, 'blog_articles')    ← دائماً فارغة (BUG B1-02)
    ├─ getDataEntities(storeId, 'blog_category')    ← data فعلية
    ├─ getDataEntities(storeId, 'blog_categories')  ← دائماً فارغة (BUG B1-02)
    ├─ getDataEntities(storeId, 'store') → storeData
    ├─ getDataEntities(storeId, 'order')
    ├─ getDataEntities(storeId, 'landing')
    ├─ getDataEntities(storeId, 'export')
    ├─ getDataEntities(storeId, 'optionTemplate')
    ├─ getDataEntities(storeId, 'specialOffer')
    ├─ getDataEntities(storeId, 'affiliate')
    ├─ getDataEntities(storeId, 'coupon')
    ├─ getDataEntities(storeId, 'loyalty')
    │
    ├─ mergeSettings(schema.settings, storeSettings + themeSettings)
    ├─ resolveComponents(schema, store.componentStates)
    │   └─ يعمل الآن لكن componentStates غالباً فارغة (لا آلية كتابة)
    │
    └─ → RuntimeContext
    │
    ▼
RendererService.renderPage(context, themeFolder)
    │
    ├─ prepareRenderContext() → يُثبّت store.url/api/slogan/username/logo
    ├─ يقرأ locale file → يُدمج مع context.translations
    ├─ [home page] HomeComponentsResolver.resolve() → context['home'] array
    │   يقرأ page_compositions من context.settings (مُخزَّن في themeSettingsJson)
    │
    ├─ يقرأ pages/{pageName}.twig
    ├─ يُشغّل AsyncLocalStorage (translations, themeFolder, viewsPath, context)
    ├─ Twig.render(renderContext)
    │   ├─ |time_ago → يحسب فارقاً زمنياً حقيقياً ✅
    │   ├─ |map() → يعمل للمصفوفات، لكن hack خاص للـ products.product_ids_mock_str
    │   ├─ |trans → يبحث في AsyncLocalStorage translations
    │   ├─ |asset → /themes/{folder}/public/{value}
    │   ├─ link() → previewBasePath/{val}
    │   ├─ old() → '' دائماً (مقصود)
    │   ├─ {% hook name %} → hookService.resolve(name)
    │   └─ {% salla_component path %} → يقرأ component ويُرندر
    │
    ├─ يستبدل salla.sa URLs بـ previewBasePath
    ├─ يُضيف localStorage.clear() + sessionStorage.clear()
    ├─ يُحقن twilight.min.js + sdk-bridge.js
    └─ → HTML string
    │
    ▼
HTTP Response 200 text/html
```

---

## A5. منطق المحاكاة والرندر

### SimulatorService

- **Cart**: يُخزَّن في `DataEntity(cart/default)` — دائم عبر الجلسات والـ restarts
- **Wishlist/Checkout**: نفس النمط عبر DataEntity
- **Menus**: إذا لم تُوجد في DB → `buildDefaultMenu()` من categories + pages
- **Pagination**: مُنفَّذة لـ products/orders/notifications/blog articles عبر `buildPaginatedResponse`؛ غير مُنفَّذة لبعض الموارد الأخرى
- **Error Boundary**: يُعيد HTML خطأ واضح عند فشل Twig + fallback إلى `page-single` في `preview-runtime-service.ts:56`

### Twig Cache

قابل للتفعيل عبر متغير البيئة:

```
VTDR_TWIG_CACHE=1
```

يقرأه `renderer-service.ts:56` — الافتراضي off.

---

## A6. مصادر الحقيقة

| الكيان                             | مصدر الحقيقة الفعلي                              |
| ---------------------------------- | ------------------------------------------------ |
| Store metadata                     | جدول `Store` في SQLite                           |
| DataEntities (products/brands/...) | جدول `DataEntity` (payloadJson)                  |
| Cart/Wishlist/Checkout             | `DataEntity(cart\|wishlist\|checkout, default)`  |
| Theme files                        | نظام الملفات (`packages/themes/`)                |
| Page compositions                  | `Store.themeSettingsJson` (JSON مُضمَّن)         |
| Component states                   | جدول `ComponentState` (مُجلَب لكن لا يُكتب إليه) |
| Salla API schema                   | `temp_twilight_ext/data/` (خارج monorepo)        |

---

## A7. مناطق الغموض المحسومة وغير المحسومة

| الغموض                        | الحالة                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| Cart Persistence              | ✅ **محسوم** — DataEntity/cart/default                                               |
| StoreState vs Store           | ⚠️ **مفتوح** — StoreState في schema لكن لا كود يستخدمه                               |
| ComponentState (قراءة/كتابة)  | ⚠️ **مفتوح** — يُجلب الآن لكن لا آلية كتابة                                          |
| PageComposition جدول          | ⚠️ **مفتوح** — موجود في schema، يُجلب، لكن RendererService يقرأ من themeSettingsJson |
| blog_article vs blog_articles | ✅ **محسوم** — bug موثّق في B1-02                                                    |
| temp_twilight_ext             | ⚠️ **مفتوح** — dependency خفية غير موثّقة                                            |

---

---

# ٢. التدقيق المعرفي للنظام

> كل نقطة مُوثَّقة بالملف والسطر والتأثير الفعلي. الحالة مُحدَّثة بعد تحقق مباشر من الكود.

---

## B1) الأخطاء التشغيلية

### B1-01: `resolveComponents()` — ✅ إصلاح جزئي، مشكلة متبقية

**الملف**: `packages/data/src/prisma-repository.ts:26-36`

```typescript
// FIX P0-1: include componentStates + pageCompositions
public async getById(id: string, tx?: any) {
    return client.store.findUnique({
        where: { id },
        include: {
            themeVersion: true,
            componentStates: true,   // ← مُضاف
            pageCompositions: true   // ← مُضاف
        }
    });
}
```

**الحالة**: جلب `componentStates` صحيح الآن. لكن لا يوجد أي route أو service يكتب إلى `ComponentState` table — المصفوفة فارغة دائماً في الممارسة الفعلية.

**التأثير المتبقي**: `resolveComponents()` تعمل تقنياً لكن تُعيد `[]` دائماً لغياب البيانات.

---

### B1-02: ازدواجية في جلب blog entities (articles + categories)

**الملف**: `packages/engine/src/core/composition-engine.ts:71-78`

```typescript
const blogArticles = [
  ...(await this.simulationLogic.getDataEntities(storeId, "blog_article")),
  ...(await this.simulationLogic.getDataEntities(storeId, "blog_articles")), // دائماً فارغة
];
const blogCategories = [
  ...(await this.simulationLogic.getDataEntities(storeId, "blog_category")),
  ...(await this.simulationLogic.getDataEntities(storeId, "blog_categories")), // دائماً فارغة
];
```

**المشكلة**: `SeederService` يُخزّن بـ `'blog_article'` و`'blog_category'` (مفرد) فقط. الجمع (`blog_articles`, `blog_categories`) يُعيد مصفوفات فارغة دائماً — 2 استعلام DB مهدَرَين في كل طلب preview.

**التأثير**: 4 استعلامات بدل 2 لجلب المدونة — نصفها لا يُعيد شيئاً.

---

### B1-03: Cart Persistence — ✅ تم الحل

**الحالة الفعلية**: Cart يُخزَّن في `DataEntity(cart/default)` عبر `persistCartState()` و`getOrCreateCart()` في `simulator.service.ts:2165-2176`. دائم عبر الجلسات.

---

### B1-04: `store.description` مُكرَّر

**الملف**: `packages/engine/src/core/composition-engine.ts:122`

```typescript
description: storeData.description || storeData.description,
```

**المشكلة**: نفس المصدر مكرر — لا fallback حقيقي.

**التأثير**: لا تأثير وظيفي لكنه يُشير إلى كود مُهمَل.

---

### B1-05: `|time_ago` filter — ✅ تم الحل

**الملف**: `packages/engine/src/rendering/renderer-service.ts:134-150`

Filter يحسب الفارق الزمني الحقيقي بدقة (لحظات، دقائق، ساعات، أيام، شهور، سنوات).

---

### B1-06: `old()` — stub مقصود | `link()` — يعمل جزئياً

**الملف**: `packages/engine/src/rendering/renderer-service.ts:192-224`

- **`old()`**: يُعيد `''` دائماً — مقصود في سياق المحاكاة (لا session state).
- **`link()`**: يستخدم `store.url` من context، لكن `store.url` مضبوط على `previewBasePath` (مسار نسبي لمحاكاة preview وليس domain حقيقي).

```typescript
(Twig as any).extendFunction("link", (val: string) => {
  const baseUrl = (store?.context?.store as any)?.url || "";
  const p = String(val || "").replace(/^\/+/, "");
  return baseUrl ? `${baseUrl}/${p}` : `/${p}`;
});
```

**التأثير**: `link()` يُولّد URLs تحت مسار preview — صحيح لبيئة المعاينة.

---

### B1-07: `SchemaService` يعتمد على مسار خارجي غير مُدار

**الملف**: `packages/engine/src/core/schema-service.ts:18`

```typescript
this.dataDir = path.join(process.cwd(), "temp_twilight_ext", "data");
```

**المشكلة**: `temp_twilight_ext/data/` غير موجود في monorepo. يُعيد empty defaults بصمت إذا لم يُنشأ يدوياً.

**التأثير**: ميزة schema mapping معطّلة بالكامل في بيئات fresh.

---

### B1-08: `WebhookService` — متصل معمارياً، أعمى وظيفياً

**الملفات**: `simulator-auth-orchestrator.ts` + `index.ts:119-120` + `simulator.routes.ts:190-193`

```typescript
// الربط المعماري صحيح:
const webhookService = new WebhookService();
const simulatorAuthOrchestrator = new SimulatorAuthOrchestrator(storeLogic, webhookService);
// POST /api/v1/auth/login → dispatchMockLogin() → webhookService.dispatchEvent()

// لكن داخل StoreLogic:
public async getWebhooks(storeId: string): Promise<any[]> {
    // Webhooks logic will be moved to Store model or a dedicated table if needed
    return [];  // ← دائماً فارغ
}
```

**التأثير**: الهيكل المعماري سليم. الميزة غير فعّالة لأن `getWebhooks()` stub.

---

### B1-09: `SallaValidator` — category runtime فارغة

**الملف**: `packages/engine/src/validators/salla-validator.ts:52`

Category `runtime` مُعرَّفة في النوع لكن لا توجد قواعد مُنفَّذة. `readiness` يحتوي قاعدة ثابتة `pass`.

**التأثير**: تقرير التحقق لا يفحص runtime behavior.

---

### B1-10: `contextMiddleware` — ✅ تم الحل

**الملف**: `apps/api/src/middlewares/context.middleware.ts:28-29`

```typescript
const store = await resolver.resolveStore(storeId);
if (!store) return res.status(404).json({ error: "Store not found" });
```

`contextMiddleware` يتحقق من وجود المتجر ويُعيد 404 إذا لم يُوجد.

---

## B2) Dead Code / Legacy Artifacts

### B2-01: `StoreState` — جدول DB بلا استخدام

**الملف**: `packages/data/prisma/schema.prisma:72-83`

موجود في schema. لا repository. لا كود يقرأ منه أو يكتب إليه.

**الحكم**: Dead schema.

---

### B2-02: `ComponentState` — يُجلب لكن لا يُكتب إليه

**الملف**: `packages/data/prisma/schema.prisma:85-97`

يُجلب الآن عبر `PrismaStoreRepository.getById()` (بعد إصلاح FIX P0-1). لكن لا يوجد أي route أو service يكتب إليه.

**الحكم**: Schema حي لكن non-writable — feature skeleton غير مكتمل.

---

### B2-03: `PageComposition` — يُجلب لكن RendererService لا يستخدمه

**الملف**: `packages/data/prisma/schema.prisma:99-108`

يُجلب الآن عبر `getById()`. لكن `HomeComponentsResolver` يقرأ page compositions من `context.settings.page_compositions` (مُشتقّ من `Store.themeSettingsJson`) وليس من `store.pageCompositions`.

**الحكم**: مصدران للحقيقة — جدول DB (مُجلَب لكن غير مقروء) + themeSettingsJson (المستخدم فعلاً).

---

### B2-04: `Snapshot` — جدول DB بلا استخدام

**الملف**: `packages/data/prisma/schema.prisma:156-163`

لا repository. لا كود يلمسه.

**الحكم**: Dead schema.

---

### B2-05: `ContentManager` — مُنشأ ومُمرَّر، غير مُستدعى

**الملف**: `packages/engine/src/core/content-manager.ts`

مُمرَّر إلى `CompositionEngine` لكن `buildContext()` لا يستدعيه أبداً — يستدعي `StoreLogic` مباشرة.

**الحكم**: Dead dependency injection.

---

### B2-06: `Collection/CollectionItem/DataBinding` — infrastructure بلا routes

**الملف**: `packages/data/prisma/schema.prisma:123-154`

3 جداول + 2 repositories + ContentManager methods. لا route يصل إليها.

**الحكم**: Dead infrastructure — مُنفَّذة بالكامل لكن غير موصولة.

---

### B2-07: `WebhookService` — موصول لكن غير فعّال

مُستخدَم عبر `SimulatorAuthOrchestrator` → `POST /api/v1/auth/login`. لكن `getWebhooks()` يُعيد `[]` دائماً.

**الحكم**: ليس dead — موصول معمارياً. فعّاليته صفر بسبب stub داخلي.

---

### B2-08: `LocalizationService` — instance بلا استخدام

`CompositionEngine` يستخدم `LocalizationService.flatten()` (static) فقط. `RendererService` له ترجمته الداخلية المستقلة.

**الحكم**: Instance غير مُستخدَم.

---

### B2-09: `archive/` — وثائق قديمة مؤرشفة

3 مجلدات من وثائق قديمة + ملف zip.

**الحكم**: آمن للحذف بعد مراجعة.

---

### B2-10: `system.routes.ts` — 3 endpoints (ليس 2)

يحتوي الآن 3 endpoints بما فيها `/api/system/preview/metrics` (ديناميكي).

**الحكم**: يُعيد بعض القيم hardcoded، لكن metrics endpoint له قيمة فعلية.

---

## B3) Orphaned Modules / Files

| الملف                                                   | الحالة الفعلية                                          |
| ------------------------------------------------------- | ------------------------------------------------------- |
| `packages/contracts/content.ts`                         | يُستورد في content-manager.ts فقط (dead بشكل غير مباشر) |
| `packages/contracts/component.ts`                       | يُستخدم في composition-engine وrenderer — مُبرَّر       |
| `packages/contracts/src/salla.generated.ts`             | types فقط، لا runtime validation                        |
| `apps/api/src/providers/local-theme-runtime-adapter.ts` | مُستخدَم فعلاً — تنفّذ `IThemeRuntimeAdapter`           |
| `packages/engine/seed-store.js`                         | script قديم في جذر packages/engine، لم يُفحص            |
| `apps/api/audit-db.ts` و`check-store.ts`                | scripts تشخيصية يدوية — لا قيمة في الإنتاج              |

---

## B4) التكرار (Duplication)

### B4-01: منطق Normalization مُكرَّر

`slugify()`، `sanitizeImageUrl()`، `generateEntityId()` — موجودة في `simulator.service.ts` و`seeder-service.ts`.

**التأثير**: تعديل normalization يتطلب تغيير ملفين.

---

### B4-02: `pickLocalizedText()` مُكرَّرة

اختيار النص (ar أولاً ثم en) مُنفَّذ في `SimulatorService` وضمنياً في `ThemeLoader`.

---

### B4-03: `blog_article/articles` و`blog_category/categories` — ازدواجية

موثَّق في B1-02. 3+ أماكن تتعامل مع النوعين بشكل غير موحَّد.

---

### B4-04: `wrapResponse()` — مُستخدَمة بشكل صحيح

تصميم مقصود لمحاكاة Salla API format. الدالة مُشتركة داخل SimulatorService.

---

## B5) التعارضات المعمارية

### B5-01: مصدران للحقيقة لـ Page Compositions

جدول `PageComposition` (يُجلب لكن غير مستخدم في الرندر) + `Store.themeSettingsJson` (المستخدم فعلاً). تعارض محتمل إذا أُضيف كود يقرأ من الجدول.

---

### B5-02: `StoreLogic` يُستدعى مباشرة — تجاوز `ContentManager`

`SimulatorService` و`CompositionEngine` يتجاوزان `ContentManager` ويستدعيان `StoreLogic` مباشرة. يُشير إلى تغيير معماري لم يكتمل.

---

### B5-03: نظامان للترجمة

`LocalizationService` instance (غير مُستخدَم) + `RendererService` internal localization (المستخدم). لا توحيد.

---

### B5-04: `HookService` — in-memory بلا persistence

يُخزّن hooks في `Map`. لا route لتسجيل hooks. `body:end` فقط يُضاف من `CompositionEngine`.

---

### B5-05: `IThemeRuntimeAdapter` — مُستخدَمة فعلاً (تصحيح)

الواجهة الفعلية هي `IThemeRuntimeAdapter` (وليس `IThemeFileProvider` كما وُثِّق سابقاً). تُستخدم في `SimulatorService` و`RendererService` لـ `getThemeSettings/getThemeComponents/getThemeSchema`.

---

## B6) النواقص التصميمية

| الرقم | النقص                                      | الحالة الفعلية                                                             | التأثير                     |
| ----- | ------------------------------------------ | -------------------------------------------------------------------------- | --------------------------- |
| B6-01 | Error Boundary في Rendering Pipeline       | **جزئي** — HTML خطأ + fallback إلى page-single (`renderer-service.ts:860`) | تحسين مطلوب للـ UX          |
| B6-02 | لا Validation لـ DataEntity payload        | **مفتوح** — أي JSON يُقبل                                                  | مخاطر بيانات فاسدة          |
| B6-03 | لا Rate Limiting أو Auth على `/api/v1/*`   | **مفتوح**                                                                  | endpoints مفتوحة            |
| B6-04 | SynchronizationService بدون Authentication | **مفتوح** — قيد خارجي                                                      | يعمل مع APIs عامة فقط       |
| B6-05 | Pagination ناقصة                           | **جزئي** — مُطبَّقة لـ products/orders/notifications/blog articles فقط     | موارد أخرى تُعاد دفعة كاملة |
| B6-06 | `temp_twilight_ext` — dependency خفية      | **مفتوح** — لا توثيق، لا script                                            | ميزة schema mapping معطّلة  |
| B6-07 | ~~Cart cleanup عند تعدد المتاجر~~          | **محلول** — Cart مرتبط بـ storeId في DataEntity                            | لا توجد مشكلة               |

---

## B7) المخاطر المستقبلية

| الرقم | الخطر                                  | الحالة                                   | الخطورة                        |
| ----- | -------------------------------------- | ---------------------------------------- | ------------------------------ |
| B7-01 | SQLite لا يدعم concurrent writes       | مفتوح                                    | scale محدود                    |
| B7-02 | Twig caching معطّل افتراضياً           | **قابل للتفعيل** عبر `VTDR_TWIG_CACHE=1` | متوسط — يكفي env var           |
| B7-03 | `AsyncLocalStorage` كـ Context Carrier | مفتوح                                    | تصميم مقصود لكن صعب الاختبار   |
| B7-04 | `themeSettingsJson` كـ Blob JSON       | مفتوح                                    | صعوبة الاستعلام والـ migration |
| B7-05 | `SeederService` بيانات شبه عشوائية     | مفتوح                                    | لا reproducibility كاملة       |
| B7-06 | `SynchronizationService` بلا rollback  | مفتوح                                    | خطر فقدان بيانات               |

---

## ملخص التدقيق — الحالة المُحدَّثة

### إحصائيات

| الفئة               | العدد الأصلي | المُصلَح     | المتبقي |
| ------------------- | ------------ | ------------ | ------- |
| B1: أخطاء تشغيلية   | 10           | 4 ✅         | 6       |
| B2: Dead Code       | 10           | 1 جزئي       | 9       |
| B3: Orphaned        | 6            | 1 تصحيح      | 5       |
| B4: Duplication     | 4            | 0            | 4       |
| B5: تعارضات معمارية | 5            | 1 تصحيح      | 4       |
| B6: نواقص تصميمية   | 7            | 1 ✅، 1 جزئي | 5       |
| B7: مخاطر مستقبلية  | 6            | 1 جزئي       | 5       |

### أعلى 5 مشكلات (بعد التحديث)

| الترتيب | المشكلة                                                   | التأثير                              |
| ------- | --------------------------------------------------------- | ------------------------------------ |
| 1       | **B1-02**: ازدواجية blog entities (articles + categories) | 2 استعلام DB مهدَر في كل طلب preview |
| 2       | **B5-01**: مصدران للحقيقة لـ Page Compositions            | تعارض بيانات محتمل عند أي توسعة      |
| 3       | **B2-02**: ComponentState — لا آلية كتابة                 | feature skeleton غير مكتمل           |
| 4       | **B1-07**: SchemaService يعتمد على temp_twilight_ext      | ميزة schema mapping معطّلة           |
| 5       | **B7-06**: SynchronizationService بلا rollback            | خطر فقدان بيانات                     |

### الكيانات الميتة الفعلية (بعد التحديث)

```
جداول DB غير مُستخدمة : StoreState, Snapshot
جداول مُجلَبة لكن غير مستخدمة وظيفياً : ComponentState (لا كتابة), PageComposition (لا قراءة منه)
Repositories غير مُستخدمة: PrismaCollectionRepository, PrismaDataBindingRepository
Classes غير مُستخدمة  : ContentManager (كـ dependency)
Service متصل لكن غير فعّال: WebhookService (getWebhooks stub)
```

### الكيانات المُنفَّذة جزئياً

```
SimulatorAuthOrchestrator : يصل إلى WebhookService لكن dispatch أعمى
HookService               : in-memory فقط، لا route للتسجيل
LocalizationService       : instance غير مُستخدَم، static method فقط
SallaValidator            : category 'runtime' فارغة
Pagination                : مطبّقة لبعض الموارد فقط
Error Boundary            : جزئي — يُعيد HTML خطأ + fallback إلى page-single
```

---

---

# ٣. خارطة الإجراءات المُحدَّثة

> الحالة مُحدَّثة بعد التحقق المباشر من الكود.

---

## المرحلة P0 — إصلاحات فورية

### P0-01: إصلاح componentStates — ✅ مُنجَز

تم الإصلاح في `packages/data/src/prisma-repository.ts` بإضافة `componentStates: true` في `include`. **المشكلة المتبقية**: لا آلية كتابة → انظر P1-02 الجديد.

---

### P0-02: توحيد blog entity types — ⚠️ مفتوح

**المشكلة**: B1-02
**الملفات**: `composition-engine.ts:71-78`، `seeder-service.ts`، `simulator.service.ts`
**الخطوة**: احذف الجلب المزدوج من CompositionEngine. اختر `blog_article` و`blog_category` (مفرد) كأنواع رسمية وطبّق في كل مكان.
**الجهد**: 30 دقيقة | **التأثير**: يُوقف 2 استعلام DB مهدَر في كل طلب preview

---

### P0-03: إصلاح store.description المكرر — ⚠️ مفتوح

**المشكلة**: B1-04
**الملف**: `packages/engine/src/core/composition-engine.ts:122`
**الخطوة**: `storeData.description || store.title`
**الجهد**: 2 دقيقة

---

### P0-04: توثيق temp_twilight_ext — ⚠️ مفتوح

**المشكلة**: B1-07 + B6-06
**الخطوة**: أضف `tools/setup-schema-ext.sh` أو README يوضّح طريقة الحصول على `temp_twilight_ext`
**الجهد**: 1 ساعة | **التأثير**: يُزيل dependency خفية

---

### P0-05: التحقق من وجود المتجر في contextMiddleware — ✅ مُنجَز

مُنفَّذ عبر `resolver.resolveStore(storeId)` + `if (!store)` في `context.middleware.ts:28-29`.

---

## المرحلة P1 — تنظيف معماري

### P1-01: حذف الجداول الميتة من Prisma Schema

**الجداول للحذف**: `StoreState`، `Snapshot`
**ملاحظة**: `ComponentState` و`PageComposition` يحتاجان قراراً معمارياً أولاً (P1-02/P1-03).
**الجهد**: 1 ساعة

---

### P1-02: إضافة آلية كتابة لـ ComponentState أو إلغاؤه

**الخيار أ** (أسرع): احذف `ComponentState` من schema وأزل `componentStates: true` من include.
**الخيار ب** (أصح): أضف route لحفظ component state عبر UI عند تغيير ترتيب المكونات.
**الجهد**: أ = 30 دقيقة | ب = 4 ساعات

---

### P1-03: حلّ تعارض PageComposition

**الخيار أ**: احذف جدول `PageComposition` — الاحتفاظ بـ `themeSettingsJson`.
**الخيار ب**: حوّل `RendererService` ليقرأ من `store.pageCompositions` بدل `themeSettingsJson`.
**الجهد**: أ = 1 ساعة | ب = 3 ساعات

---

### P1-04: حذف ContentManager أو تفعيله

**الخيار أ**: احذف من `index.ts` وأزل dependency من `CompositionEngine`.
**الخيار ب**: حوّل `SimulatorService` و`CompositionEngine` ليستخدما `ContentManager`.
**الجهد**: أ = 20 دقيقة | ب = 3 ساعات

---

### P1-05: حذف Collection/DataBinding infrastructure

**الملفات**: `schema.prisma`، `prisma-repository.ts`، `content-manager.ts`، `dal.contract.ts`
**الجهد**: 2 ساعة

---

### P1-06: تفعيل WebhookService أو إيقافه

**الخيار أ**: أضف جدول `StoreWebhook` وطبّق `getWebhooks()` بشكل حقيقي.
**الخيار ب**: احذف `WebhookService` و`SimulatorAuthOrchestrator` إذا لا تُخطط للـ webhooks.
**الجهد**: أ = 4 ساعات | ب = 20 دقيقة

---

### P1-07: توحيد نظام الترجمة

احذف `LocalizationService` instance من `CompositionEngine` واستخدم static method مباشرة.
**الجهد**: 45 دقيقة

---

### P1-08: استخراج utilities مشتركة

**الملف الجديد**: `packages/engine/src/utils/normalizers.ts`
**الدوال**: `slugify()`، `sanitizeImageUrl()`، `generateEntityId()`، `pickLocalizedText()`
**الجهد**: 1 ساعة

---

### P1-09: إضافة Validation لـ DataEntity payload

**الملف**: `packages/data/src/prisma-repository.ts`
**الخطوة**: Zod validation قبل `JSON.stringify(payload)` في `create()` و`upsertByEntityKey()`
**الجهد**: 2 ساعة

---

### P1-10: تنظيف archive/ وscripts التشخيصية

احذف `archive/` بعد مراجعة. انقل `audit-db.ts` و`check-store.ts` إلى `tools/`.
**الجهد**: 30 دقيقة

---

## المرحلة P2 — تحسينات مستقبلية

### P2-01: استبدال SQLite بـ PostgreSQL

**الجهد**: 4 ساعات | **التأثير**: concurrent writes + scaling

---

### P2-02: ضبط سياسة Twig caching

`VTDR_TWIG_CACHE=1` موجود بالفعل. المتبقي: سياسة invalidation عند تغيير الثيم.
**الجهد**: 2 ساعة

---

### P2-03: إضافة Rollback في SynchronizationService

**الخطوة**: `prisma.$transaction()` لتغليف `clearDataEntities()` + عمليات الإنشاء.
**الجهد**: 3 ساعات

---

### P2-04: استكمال Pagination لبقية الموارد

Pagination موجودة لـ products/orders/notifications/blog. المتبقي: brands/categories/offers/...
**الجهد**: 2 ساعة

---

### P2-05: تفعيل SallaValidator category runtime

أضف قواعد تفحص وجود Twig templates وصحة twilight.json.
**الجهد**: 3 ساعات

---

### P2-06: إضافة Auth على Simulator endpoints

API key middleware أو JWT validation على `/api/v1/*`.
**الجهد**: 3 ساعات

---

## ملخص خطة العمل

| المرحلة      | البنود                     | الجهد الإجمالي | الحالة  |
| ------------ | -------------------------- | -------------- | ------- |
| P0 — فوري    | 5 بنود (2 مُنجَز، 3 مفتوح) | ~2 ساعات       | جارٍ    |
| P1 — تنظيف   | 10 بنود                    | ~15 ساعة       | لم يبدأ |
| P2 — مستقبلي | 6 بنود                     | ~18 ساعة       | لم يبدأ |

### ترتيب التنفيذ المقترح لـ P0 المتبقية

```
P0-03 (2 دقيقة) → P0-02 (30 دقيقة) → P0-04 (1 ساعة)
```

---

_نهاية التقرير الشامل النهائي — VTDR Full Audit Final v2.0 — 2026-02-21_
