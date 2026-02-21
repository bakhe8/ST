# VTDR – التقرير الشامل للتدقيق الإدراكي

> **الوصف**: هذا الملف يجمع التقارير الثلاثة الكاملة الصادرة عن جلسة التدقيق الإدراكي الشامل لمنظومة VTDR.
> **التاريخ**: 2026-02-20
> **المنهجية**: لا يُصدر أي حكم أو توصية قبل اكتمال الفهم التشغيلي الكامل.

---

## الفهرس

1. [التقرير الأول: الفهم التشغيلي العميق](#التقرير-الأول-الفهم-التشغيلي-العميق)
2. [التقرير الثاني: التدقيق المعرفي للنظام](#التقرير-الثاني-التدقيق-المعرفي-للنظام)
3. [التقرير الثالث: خارطة الإجراءات](#التقرير-الثالث-خارطة-الإجراءات)

---

---

# التقرير الأول: الفهم التشغيلي العميق

## المرحلة الأولى: الفهم التشغيلي العميق

---

## 1. تعريف VTDR كنظام Runtime

### الطبيعة الفعلية للنظام

VTDR ليس واحداً من الثلاثة، بل هو **الثلاثة معاً في آنٍ واحد**:

| الطبقة                      | الوظيفة الفعلية                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------- |
| **Runtime Platform**        | يُشغّل ثيمات Twig ويُنتج HTML حقيقياً قابلاً للعرض في المتصفح                          |
| **Development Environment** | يوفر UI لإدارة بيانات المتجر الافتراضي وإعدادات الثيم                                  |
| **Simulator**               | يُحاكي Salla API بالكامل (products/cart/orders/menus/...) بدون الاتصال بالمتجر الحقيقي |

### أين يبدأ Runtime؟

Runtime يبدأ عند استدعاء `GET /preview/:storeId/:themeId/:version`:

1. `contextMiddleware` يحل `storeId` من الطلب
2. `CompositionEngine.buildContext()` يجمع Store + Theme + DataEntities → `RuntimeContext`
3. `RendererService.renderPage()` يُمرر `RuntimeContext` إلى Twig ويُنتج HTML

### أين تنتهي المحاكاة؟

المحاكاة تنتهي عند حدود **الـ HTML المُنتج**. ما بعد ذلك (JavaScript في المتصفح، Salla SDK الحقيقي، الدفع، السلة الفعلية) خارج نطاق VTDR.

### ما الذي يُفترض أن يطابق سلة؟

- **بنية RuntimeContext**: تُطابق هيكل Salla Twig context (store، products، categories، hooks، translations)
- **Twig filters/functions**: `|currency`، `|trans`، `|asset`، `salla_url()`، `is_page()`، `{% hook %}`، `{% salla_component %}`
- **هيكل API responses**: يُطابق Salla API v1 format (`{ success, data, pagination }`)

### ما هو مجرد تقريب؟

- **الصور**: كلها تُعاد توجيهها إلى `/themes/theme-raed-master/public/images/placeholder.png`
- **store.url**: مثبّت على `http://localhost:3001` بدلاً من domain المتجر الحقيقي
- **store.api**: مثبّت على `http://localhost:3001/api/v1`
- **store.logo/avatar/icon**: مثبّتة على Salla CDN logo
- **store.slogan**: مثبّت على `سوقك في جيبك`
- **store.username**: مثبّت على `store_vtdr`
- **الترجمات**: تُقرأ من ملفات الثيم المحلية، وليس من Salla API
- **SchemaService**: يقرأ metadata من `temp_twilight_ext/data` (مسار خارجي غير مُدار داخل monorepo)

> **توضيح (Codex - 2026-02-20):**
>
> - هذه الفقرة تحتاج تحديثًا جزئيًا بحسب الكود الحالي.
> - `store.url` لم يعد مثبتًا على `http://localhost:3001`؛ يتم ضبطه على `previewBasePath` مثل `/preview/:storeId/:theme/:version` داخل `packages/engine/src/rendering/renderer-service.ts:794` و`packages/engine/src/rendering/renderer-service.ts:881`.
> - `store.api` مضبوط حاليًا على مسار نسبي `/api/v1` وليس host كامل، داخل `packages/engine/src/rendering/renderer-service.ts:880`.
> - `store.logo/avatar/icon` حاليًا تُضبط على `/images/placeholder.png` وليس Salla CDN، داخل `packages/engine/src/rendering/renderer-service.ts:872` و`packages/engine/src/rendering/renderer-service.ts:882`.
> - مسار placeholder لم يعد خاصًا بثيم `theme-raed-master` فقط؛ يوجد Resolver محايد مع fallback في `apps/api/src/providers/local-theme-runtime-adapter.ts:6` و`apps/api/src/providers/local-theme-runtime-adapter.ts:43`.

---

## 2. خريطة نقاط الدخول

### A. نقاط دخول HTTP (API)

| المسار                           | الطريقة | الوظيفة             | المُعالج           |
| -------------------------------- | ------- | ------------------- | ------------------ |
| `GET /api/health`                | GET     | فحص حالة النظام     | مباشر في index.ts  |
| `GET /api/debug/test`            | GET     | اختبار الاتصال      | مباشر في index.ts  |
| `GET /api/system/*`              | GET     | معلومات النظام      | `system.routes.ts` |
| `GET /api/themes`                | GET     | قائمة الثيمات       | `theme.routes.ts`  |
| `POST /api/themes/discover`      | POST    | اكتشاف ثيمات محلية  | `theme.routes.ts`  |
| `POST /api/themes/register`      | POST    | تسجيل ثيم           | `theme.routes.ts`  |
| `POST /api/themes/sync`          | POST    | مزامنة جميع الثيمات | `theme.routes.ts`  |
| `GET /api/stores`                | GET     | قائمة المتاجر       | `store.routes.ts`  |
| `POST /api/stores`               | POST    | إنشاء متجر جديد     | `store.routes.ts`  |
| `GET /api/stores/:id`            | GET     | بيانات متجر         | `store.routes.ts`  |
| `PATCH /api/stores/:id`          | PATCH   | تحديث متجر          | `store.routes.ts`  |
| `DELETE /api/stores/:id`         | DELETE  | حذف متجر            | `store.routes.ts`  |
| `POST /api/stores/:id/clone`     | POST    | استنساخ متجر        | `store.routes.ts`  |
| `POST /api/stores/:id/promote`   | POST    | ترقية إلى master    | `store.routes.ts`  |
| `POST /api/stores/:id/inherit`   | POST    | ربط بمتجر أب        | `store.routes.ts`  |
| `PATCH /api/stores/:id/settings` | PATCH   | تحديث إعدادات       | `store.routes.ts`  |
| `POST /api/stores/:id/seed`      | POST    | بذر بيانات demo     | `store.routes.ts`  |
| `POST /api/stores/:id/sync`      | POST    | مزامنة من سلة حقيقي | `store.routes.ts`  |
| `DELETE /api/stores/:id/data`    | DELETE  | مسح بيانات المتجر   | `store.routes.ts`  |

### B. نقاط دخول Simulator (تحت `/api/v1/`)

جميعها تحت `contextMiddleware` وتستخدم `SimulatorService`:

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
**Auth (Mock)**: POST `/api/v1/auth/login`

### C. نقاط دخول Rendering

| المسار                                                    | الوظيفة                      |
| --------------------------------------------------------- | ---------------------------- |
| `GET /preview/:storeId/:themeId/:version?page=&viewport=` | رندر HTML كامل للمعاينة      |
| `POST /render`                                            | إرجاع RuntimeContext كـ JSON |
| `GET /themes/*`                                           | خدمة ملفات الثيم الساكنة     |

### D. نقاط دخول UI (React)

| المسار                                     | الصفحة                     |
| ------------------------------------------ | -------------------------- |
| `/`                                        | SystemHome - قائمة المتاجر |
| `/store/:storeId`                          | StoreDashboard             |
| `/store/:storeId/products`                 | StoreProducts              |
| `/store/:storeId/products/:productId/edit` | EditProduct                |
| `/store/:storeId/brands`                   | StoreBrands                |
| `/store/:storeId/offers`                   | StoreOffers                |
| `/store/:storeId/reviews`                  | StoreReviews               |
| `/store/:storeId/questions`                | StoreQuestions             |
| `/store/:storeId/categories`               | StoreCategories            |
| `/store/:storeId/static-pages`             | StoreStaticPages           |
| `/store/:storeId/menus`                    | StoreMenus                 |
| `/store/:storeId/blog/categories`          | StoreBlogCategories        |
| `/store/:storeId/blog/articles`            | StoreBlogArticles          |
| `/store/:storeId/settings`                 | StoreSettingsPanel         |
| `/store/:storeId/theme`                    | ThemeSettingsPanel         |
| `/store/:storeId/preview`                  | StorePreview               |

> **توضيح (Codex - 2026-02-20):** يوجد مسار إضافي فعلي في التطبيق غير مدرج هنا: `/store/:storeId/theme-components` داخل `apps/ui/src/App.tsx:54`.

### E. نقاط دخول CLI/Scripts

| الأمر                       | الوظيفة               |
| --------------------------- | --------------------- |
| `npm run data:harden:check` | فحص صحة بيانات المتجر |
| `npm run data:harden`       | تصحيح بيانات المتجر   |
| `npm run docs:sync`         | مزامنة الوثائق        |
| `npm run docs:drift`        | فحص انحراف الوثائق    |
| `npm run studio`            | Prisma Studio         |

> **توضيح (Codex - 2026-02-20):** توجد أوامر إضافية مرتبطة بالحَوْكمة والجودة غير مذكورة هنا مثل `docs:traceability` و`guard:runtime-boundaries` و`test:e2e:preview` داخل `package.json:18` إلى `package.json:31`.

---

## 3. خريطة المكونات

```
┌─────────────────────────────────────────────────────────────────┐
│                         apps/ui (React)                          │
│  SystemHome → StoreProducts/Brands/Categories/... → StorePreview │
│  يتواصل مع API عبر fetch() مباشرة على localhost:3001            │
└──────────────────────────┬──────────────────────────────────────┘

> **توضيح (Codex - 2026-02-20):** الاتصال لم يعد hardcoded على `localhost:3001`؛ الواجهة تستخدم `VITE_API_URL` أو `${window.location.origin}/api` ديناميكيًا في `apps/ui/src/services/api.ts:4`.
                           │ HTTP
┌──────────────────────────▼──────────────────────────────────────┐
│                      apps/api (Express)                          │
│  index.ts: نقطة التهيئة الوحيدة                                 │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │store.routes │ │simulator.rts │ │runtime.rts  │ │theme.rts │ │
│  └──────┬──────┘ └──────┬───────┘ └──────┬──────┘ └────┬─────┘ │
│         │               │                │              │        │
│  ┌──────▼───────────────▼────────────────▼──────────────▼─────┐ │
│  │              contextMiddleware (ContextResolver)             │ │
│  │  يحل storeId من URL params → يجلب Store من DB              │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ imports
┌──────────────────────────▼──────────────────────────────────────┐
│                    packages/engine                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    engine/core                           │    │
│  │  CompositionEngine: يبني RuntimeContext                 │    │
│  │  StoreLogic: CRUD + inheritance chain                   │    │
│  │  StoreFactory: إنشاء/استنساخ/حذف المتاجر               │    │
│  │  ContentManager: Collections + DataBindings             │    │
│  │  LocalizationService: flatten translations              │    │
│  │  SchemaService: يقرأ Salla metadata من temp_twilight_ext│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  engine/rendering                        │    │
│  │  ThemeLoader: يقرأ twilight.json من packages/themes     │    │
│  │  ThemeRegistry: يسجّل الثيمات في DB                    │    │
│  │  RendererService: Twig engine + custom filters/tags     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  engine/providers                        │    │
│  │  SimulatorService: CRUD كامل لكل كيانات Salla           │    │
│  │  SeederService: توليد بيانات demo عشوائية               │    │
│  │  SynchronizationService: جلب بيانات من سلة حقيقي       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  engine/webhooks                         │    │
│  │  WebhookService: إرسال أحداث HTTP                       │    │
│  │  HookService: إدارة Twig hooks (body:end, etc.)         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   engine/infra                           │    │
│  │  IFileSystem: واجهة نظام الملفات                        │    │
│  │  LocalFileSystem: تنفيذ حقيقي بـ fs                    │    │
│  │  IThemeFileProvider: واجهة قراءة ملفات الثيم            │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ imports
┌──────────────────────────▼──────────────────────────────────────┐
│                    packages/data                                  │
│  PrismaClient (SQLite)                                           │
│  PrismaStoreRepository                                           │
│  PrismaDataEntityRepository                                      │
│  PrismaThemeRepository                                           │
│  PrismaCollectionRepository                                      │
│  PrismaDataBindingRepository                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ imports
┌──────────────────────────▼──────────────────────────────────────┐
│                  packages/contracts                               │
│  runtime.ts: RuntimeContext, StoreState, SallaProduct, ...      │
│  dal.contract.ts: IStoreRepository, IDataEntityRepository, ...  │
│  theme.ts: ThemeMetadata, TwilightSchema                        │
│  component.ts: ComponentInstance                                 │
│  src/schemas.ts: BrandingSchema, StoreSettingsSchema (Zod)      │
│  src/salla.generated.ts: Salla OpenAPI types                    │
└─────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                  packages/themes                                  │
│  theme-raed-master/: ثيم Twig واحد حالياً                      │
│  twilight.json: schema + components + settings                  │
│  src/views/pages/*.twig: قوالب الصفحات                         │
│  src/views/components/*.twig: مكونات قابلة للتضمين             │
│  src/locales/*.json: ترجمات                                     │
│  public/: assets ساكنة                                          │
└─────────────────────────────────────────────────────────────────┘
```

### مصادر الحقيقة

| الكيان                             | مصدر الحقيقة الفعلي                          |
| ---------------------------------- | -------------------------------------------- |
| Store metadata                     | جدول `Store` في SQLite                       |
| DataEntities (products/brands/...) | جدول `DataEntity` (payloadJson)              |
| Theme files                        | نظام الملفات (`packages/themes/`)            |
| Theme registration                 | جدول `Theme` + `ThemeVersion`                |
| Page compositions                  | `themeSettingsJson` في `Store` (JSON مُضمّن) |
| Component states                   | جدول `ComponentState`                        |
| Salla API schema                   | `temp_twilight_ext/data/` (خارج monorepo)    |

---

## 4. تدفق البيانات

### تدفق المعاينة الكاملة

```
HTTP GET /preview/:storeId/:themeId/:version?page=home
    │
    ▼
contextMiddleware
    → storeRepo.getById(storeId) → Store record من SQLite
    → req.store = store
    │
    ▼
CompositionEngine.buildContext(storeId, pageId)
    │
    ├─ storeRepo.getById(storeId) → Store (themeId, themeVersionId, settingsJson, themeSettingsJson, brandingJson)
    │
    ├─ themeRegistry.getTheme(store.themeId) → Theme + ThemeVersion (contractJson = twilight.json)
    │
    ├─ storeLogic.getDataEntities(storeId, 'product') → DataEntity[] → payloadJson[]
    ├─ storeLogic.getDataEntities(storeId, 'category') → DataEntity[]
    ├─ storeLogic.getDataEntities(storeId, 'brand') → DataEntity[]
    ├─ storeLogic.getDataEntities(storeId, 'page') → DataEntity[]
    ├─ storeLogic.getDataEntities(storeId, 'blog_article') → DataEntity[]
    ├─ storeLogic.getDataEntities(storeId, 'blog_categories') → DataEntity[]
    ├─ storeLogic.getDataEntities(storeId, 'store') → DataEntity[0] (store info)
    ├─ storeLogic.getDataEntities(storeId, 'order') → DataEntity[]
    ├─ storeLogic.getDataEntities(storeId, 'specialOffer') → DataEntity[]
    ├─ storeLogic.getDataEntities(storeId, 'coupon') → DataEntity[]
    ├─ storeLogic.getDataEntities(storeId, 'loyalty') → DataEntity[0]
    │
    ├─ mergeSettings(schema.settings, storeSettings + themeSettings) → effectiveSettings
    ├─ resolveComponents(schema, componentStates) → ComponentInstance[]
    │
    └─ → RuntimeContext {storeId, theme, store, page, settings, translations, products, ...}
    │
    ▼
RendererService.renderPage(context, themeFolder)
    │
    ├─ يقرأ locale file: themes/{folder}/src/locales/{lang}.json → يُدمج مع context.translations
    │
    ├─ [إذا home page]: يقرأ twilight.json → يُحوّل components → context['home'] array
    │   ├─ يُطبّق savedCompositions من settings.page_compositions.home
    │   ├─ يُحوّل fields → data (localized text، variable-list، dropdown-list)
    │   └─ يُحسب viewport visibility
    │
    ├─ يقرأ pages/{pageName}.twig
    ├─ يُعالج includes/extends (path normalization)
    ├─ يُسجّل AsyncLocalStorage (translations، themeFolder، viewsPath، context)
    │
    ├─ Twig.render(renderContext)
    │   ├─ |currency, |money → يقرأ من AsyncLocalStorage
    │   ├─ |trans → يبحث في translations
    │   ├─ |asset → /themes/{folder}/public/{value}
    │   ├─ {% hook name %} → hookService.resolve(name)
    │   └─ {% salla_component path %} → يقرأ components/{path}.twig ويُرندر
    │
    ├─ يستبدل store URLs بـ localhost:3001
    ├─ يُضيف localStorage.clear() script
    └─ → HTML string
    │
    ▼
HTTP Response 200 text/html
```

### تدفق بيانات Simulator

```
HTTP GET /api/v1/products
    │
    ▼
contextMiddleware → req.storeId
    │
    ▼
SimulatorService.getProducts(storeId)
    │
    ├─ storeLogic.getDataEntities(storeId, 'product')
    │   └─ dataEntityRepo.getByStoreAndType(storeId, 'product')
    │       └─ SELECT * FROM DataEntity WHERE storeId=? AND entityType='product'
    │           └─ JSON.parse(payloadJson) لكل صف
    │
    ├─ normalizeProductPayload() لكل منتج
    │   ├─ normalizeProductImages()
    │   ├─ normalizeProductCategories()
    │   ├─ normalizePriceValue()
    │   ├─ normalizeProductOptions()
    │   └─ normalizeProductVariants()
    │
    └─ wrapResponse(data) → { success, data, pagination, metadata }
    │
    ▼
HTTP Response 200 JSON
```

### تدفق Inheritance

```
storeLogic.getDataEntities(storeId, type)
    │
    ├─ [إذا store.parentStoreId موجود]:
    │   ├─ getDataEntities(parentStoreId, type) [recursive]
    │   ├─ getByStoreAndType(storeId, type) [local]
    │   └─ merge: local يُلغي parent بـ entityKey
    │
    └─ [إذا لا يوجد parent]:
        └─ getByStoreAndType(storeId, type) مباشرة
```

---

## 5. منطق المحاكاة والرندر

### منطق المحاكاة (SimulatorService)

**المبدأ**: SimulatorService يعمل كـ Salla API proxy كامل. كل endpoint يُعيد بيانات بنفس هيكل Salla API الحقيقي.

**مصدر البيانات**: SQLite عبر `DataEntity` table. كل كيان (product، brand، category، ...) مخزّن كـ JSON في `payloadJson`.

**Normalization Pipeline**: قبل إرجاع أي بيانات، تمر عبر normalize functions تضمن:

- توحيد هيكل الأسعار (`{ amount, currency }`)
- توحيد الصور (استبدال placeholder URLs)
- توحيد النصوص متعددة اللغات (ar أولاً، ثم en)
- توليد IDs للكيانات التي تفتقر إليها

**Cart**: مُخزّن في memory (Map) داخل SimulatorService. يُفقد عند إعادة تشغيل الخادم.

**Menus**: إذا لم تُوجد في DB، يُنشئ `buildDefaultMenu()` قائمة افتراضية من categories + pages.

### منطق الرندر (RendererService)

**المحرك**: Twig.js (Node.js implementation)، `cache: false` دائماً.

**AsyncLocalStorage**: يُستخدم لتمرير context إلى Twig filters/functions دون تمريره كـ parameter. هذا ضروري لأن Twig filters لا تقبل context خارجياً.

**معالجة Home Page**: منطق خاص ومعقد:

1. يقرأ `twilight.json` مباشرة من نظام الملفات
2. يُصفّي components التي تبدأ بـ `home.`
3. إذا وُجدت `savedCompositions` في `settings.page_compositions.home`، يُطبّقها
4. يُحوّل fields إلى data مع normalization كامل
5. يُحسب viewport visibility (desktop/mobile)
6. يُضيف `context['home']` array

**معالجة `|map()` filter**: يستبدل `products|map(...)|join(...)` بـ `products.product_ids_mock_str` لأن Twig.js لا يدعم هذا النمط بشكل كامل.

**معالجة `{% component %}`**: يُحوّل إلى `{% salla_component %}` لتجنب تعارض مع Twig built-ins.

**Path Resolution**: يُحوّل `{% extends "layouts.base" %}` إلى `{% extends "layouts/base.twig" %}` تلقائياً.

---

## 6. حدود التطابق مع الواقع

### ما يتطابق فعلاً

| العنصر                | مستوى التطابق                                        |
| --------------------- | ---------------------------------------------------- |
| هيكل RuntimeContext   | عالٍ - يُطابق Salla Twig context                     |
| Twig filters الأساسية | متوسط - مُنفّذة يدوياً                               |
| هيكل API responses    | عالٍ - يُطابق Salla API v1 format                    |
| بنية twilight.json    | عالٍ - يُقرأ ويُفسَّر بنفس الطريقة                   |
| هيكل theme folders    | عالٍ - `src/views/pages/`, `src/locales/`, `public/` |

### ما هو تقريب أو مختلف

| العنصر               | الانحراف                                                         |
| -------------------- | ---------------------------------------------------------------- | --------------------------- |
| `store.url`          | مثبّت على localhost بدلاً من domain حقيقي                        |
| `store.logo/avatar`  | مثبّت على Salla CDN logo                                         |
| `store.api`          | مثبّت على localhost:3001                                         |
| الصور                | كلها placeholder.png                                             |
| Cart                 | في memory فقط، يُفقد عند restart                                 |
| Salla SDK JavaScript | غير مُنفَّذ - يُضاف فقط `window.vtdr_context = { bridge: true }` |
| Authentication       | mock فقط - لا يوجد JWT حقيقي                                     |
| Payment              | غير موجود                                                        |
| Webhooks             | يُرسل HTTP لكن لا يوجد verification                              |
| `                    | time_ago` filter                                                 | يُعيد دائماً `منذ وقت قصير` |
| `old()` function     | يُعيد دائماً `''`                                                |
| `link()` function    | يُعيد `/${val}` فقط                                              |
| SchemaService        | يعتمد على `temp_twilight_ext/data/` خارج monorepo                |

> **توضيح (Codex - 2026-02-20):**
>
> - هذا الجدول يحتوي عناصر متقادمة جزئيًا:
> - `Cart في memory فقط` لم تعد صحيحة؛ السلة تُحفظ في `DataEntity(cart, default)` عبر `upsertDataEntity` داخل `packages/engine/src/providers/simulator.service.ts:2165` و`packages/engine/src/providers/simulator.service.ts:2171`.
> - `Salla SDK JavaScript غير مُنفّذ` لم تعد دقيقة بالكامل؛ runtime يحقن `twilight.min.js` و`sdk-bridge.js` داخل `packages/engine/src/rendering/renderer-service.ts:1025` و`packages/engine/src/rendering/renderer-service.ts:1027`.
> - `|time_ago` و`link()` هنا متناقضان مع قسم B1 اللاحق؛ التنفيذ الحالي يدعم حسابًا فعليًا لـ`time_ago` ويستخدم `store.url` كنقطة أساس داخل `packages/engine/src/rendering/renderer-service.ts:127` و`packages/engine/src/rendering/renderer-service.ts:190`.

---

## 7. مناطق الغموض وما يلزم لتأكيدها

### غموض 1: Cart Persistence

**الملاحظة**: Cart مُخزّن في Map داخل SimulatorService.
**الغموض**: هل هذا مقصود أم نقص في التنفيذ؟
**ما يلزم**: فحص ما إذا كان هناك DataEntity من نوع `cart` في DB.

> **توضيح (Codex - 2026-02-20):** هذه النقطة محسومة حاليًا وليست غموضًا: Cart/Wishlist/Checkout Session تحفظ في `DataEntity` على مستوى المتجر، وليس Map مؤقت، راجع `packages/engine/src/providers/simulator.service.ts:2176` و`packages/engine/src/providers/simulator.service.ts:2226` و`packages/engine/src/providers/simulator.service.ts:2763`.

### غموض 2: StoreState vs Store

**الملاحظة**: يوجد نموذجان في DB: `Store` و`StoreState`. `StoreState` يحتوي على `settingsJson` أيضاً.
**الغموض**: أيهما مصدر الحقيقة لـ settings؟ الكود يقرأ من `Store` فقط.
**ما يلزم**: فحص ما إذا كان `StoreState` يُستخدم فعلاً في أي مكان.

### غموض 3: ComponentState vs page_compositions

**الملاحظة**: يوجد جدول `ComponentState` في DB، لكن الرندر يقرأ `page_compositions` من `themeSettingsJson`.
**الغموض**: هل `ComponentState` مستخدم فعلاً؟ أم أنه legacy من نسخة سابقة؟
**ما يلزم**: فحص ما إذا كان `ComponentState` يُكتب إليه أو يُقرأ منه في أي مكان.

### غموض 4: PageComposition جدول

**الملاحظة**: يوجد جدول `PageComposition` في DB، لكن الرندر يقرأ `page_compositions` من `Store.themeSettingsJson`.
**الغموض**: هل الجدول مستخدم؟
**ما يلزم**: فحص الـ repositories.

### غموض 5: DataBinding و Collection

**الملاحظة**: يوجد `ICollectionRepository` و`IDataBindingRepository` في contracts، ومُهيَّأن في index.ts.
**الغموض**: هل يُستخدمان فعلاً في أي مسار؟
**ما يلزم**: فحص ما إذا كان هناك routes تستخدمهما.

### غموض 6: Snapshot جدول

**الملاحظة**: يوجد جدول `Snapshot` في schema.prisma.
**الغموض**: لا يوجد SnapshotRepository أو SnapshotService في الكود.
**ما يلزم**: تأكيد أنه dead schema.

### غموض 7: temp_twilight_ext

**الملاحظة**: `SchemaService` يقرأ من `process.cwd()/temp_twilight_ext/data/`.
**الغموض**: هذا المسار غير موجود في monorepo. هل يُنشأ يدوياً؟
**ما يلزم**: فحص ما إذا كان يُنشأ بـ script أو يُوجد مسبقاً.

### غموض 8: blog_article vs blog_articles

**الملاحظة**: `getDataEntities` يُستدعى بـ `'blog_article'` و`'blog_articles'` معاً في كل من `CompositionEngine` و`SimulatorService`.
**الغموض**: هل هذا تعامل مع legacy entity types؟ أم خطأ في التسمية؟
**ما يلزم**: فحص ما يُخزَّن فعلاً في DB.

### غموض 9: Salla OpenAPI Integration

**الملاحظة**: يوجد `salla.openapi.json` في contracts وملف `salla.generated.ts`.
**الغموض**: هل هذا يُستخدم للـ type checking فقط؟ أم هناك runtime validation؟
**ما يلزم**: فحص كيف يُستخدم `Salla` namespace في الكود.

---

## ملحق: Coverage Matrix

| الملف                                                        | حُفص؟ | ملاحظة          |
| ------------------------------------------------------------ | ----- | --------------- |
| `apps/api/src/index.ts`                                      | ✅    | كامل            |
| `apps/api/src/routes/runtime.routes.ts`                      | ✅    | كامل            |
| `apps/api/src/routes/simulator.routes.ts`                    | ✅    | كامل            |
| `apps/api/src/routes/store.routes.ts`                        | ✅    | كامل            |
| `apps/api/src/routes/theme.routes.ts`                        | ✅    | كامل            |
| `apps/api/src/routes/system.routes.ts`                       | ⚠️    | بنية فقط        |
| `apps/api/src/middlewares/context.middleware.ts`             | ⚠️    | بنية فقط        |
| `apps/api/src/services/context-resolver.ts`                  | ⚠️    | بنية فقط        |
| `apps/api/src/providers/local-theme-file-provider.ts`        | ⚠️    | بنية فقط        |
| `apps/api/src/utils/bootstrap.ts`                            | ⚠️    | بنية فقط        |
| `apps/api/src/utils/api-response.ts`                         | ⚠️    | بنية فقط        |
| `apps/api/audit-db.ts`                                       | ⚠️    | لم يُفحص        |
| `apps/api/check-store.ts`                                    | ⚠️    | لم يُفحص        |
| `apps/ui/src/App.tsx`                                        | ✅    | كامل            |
| `apps/ui/src/pages/*.tsx` (15 ملف)                           | ⚠️    | بنية فقط        |
| `apps/ui/src/components/*.tsx`                               | ⚠️    | لم تُفحص        |
| `apps/ui/src/layouts/*.tsx`                                  | ⚠️    | لم تُفحص        |
| `apps/ui/src/services/*.ts`                                  | ⚠️    | لم تُفحص        |
| `packages/engine/src/core/composition-engine.ts`             | ✅    | كامل            |
| `packages/engine/src/core/store-logic.ts`                    | ✅    | كامل            |
| `packages/engine/src/core/store-factory.ts`                  | ✅    | كامل            |
| `packages/engine/src/core/schema-service.ts`                 | ✅    | كامل            |
| `packages/engine/src/core/content-manager.ts`                | ⚠️    | بنية فقط        |
| `packages/engine/src/core/localization-service.ts`           | ⚠️    | بنية فقط        |
| `packages/engine/src/core/store-logic.test.ts`               | ⚠️    | لم يُفحص        |
| `packages/engine/src/rendering/renderer-service.ts`          | ✅    | كامل (875 سطر)  |
| `packages/engine/src/rendering/theme-loader.ts`              | ✅    | كامل            |
| `packages/engine/src/rendering/theme-registry.ts`            | ⚠️    | بنية فقط        |
| `packages/engine/src/providers/simulator.service.ts`         | ✅    | كامل (1755 سطر) |
| `packages/engine/src/providers/seeder-service.ts`            | ✅    | كامل            |
| `packages/engine/src/providers/synchronization-service.ts`   | ✅    | كامل            |
| `packages/engine/src/infra/file-system.interface.ts`         | ✅    | كامل            |
| `packages/engine/src/infra/local-file-system.ts`             | ⚠️    | بنية فقط        |
| `packages/engine/src/infra/theme-file-provider.interface.ts` | ⚠️    | بنية فقط        |
| `packages/engine/src/webhooks/hook-service.ts`               | ⚠️    | بنية فقط        |
| `packages/engine/src/webhooks/webhook-service.ts`            | ⚠️    | بنية فقط        |
| `packages/engine/src/validators/salla-validator.ts`          | ⚠️    | لم يُفحص        |
| `packages/engine/index.ts`                                   | ✅    | كامل            |
| `packages/engine/seed-store.js`                              | ⚠️    | لم يُفحص        |
| `packages/contracts/runtime.ts`                              | ✅    | كامل            |
| `packages/contracts/dal.contract.ts`                         | ✅    | كامل            |
| `packages/contracts/theme.ts`                                | ⚠️    | بنية فقط        |
| `packages/contracts/component.ts`                            | ⚠️    | بنية فقط        |
| `packages/contracts/content.ts`                              | ⚠️    | بنية فقط        |
| `packages/contracts/index.ts`                                | ✅    | كامل            |
| `packages/contracts/src/schemas.ts`                          | ✅    | كامل            |
| `packages/contracts/src/salla.generated.ts`                  | ⚠️    | بنية فقط        |
| `packages/contracts/src/schemas.test.ts`                     | ⚠️    | لم يُفحص        |
| `packages/contracts/salla.openapi.json`                      | ⚠️    | لم يُفحص        |
| `packages/data/prisma/schema.prisma`                         | ✅    | كامل            |
| `packages/data/src/prisma-repository.ts`                     | ⚠️    | بنية فقط        |
| `packages/data/src/index.ts`                                 | ⚠️    | بنية فقط        |
| `packages/themes/theme-raed-master/`                         | ⚠️    | بنية فقط        |
| `tools/data-hardening/`                                      | ⚠️    | لم يُفحص        |
| `tools/doc-drift/`                                           | ⚠️    | لم يُفحص        |
| `archive/`                                                   | ⚠️    | لم يُفحص        |
| `Docs/`                                                      | ⚠️    | لم يُفحص        |
| `turbo.json`                                                 | ✅    | كامل            |
| `package.json`                                               | ✅    | كامل            |
| `tsconfig.base.json`                                         | ⚠️    | بنية فقط        |
| `.env`                                                       | ⚠️    | بنية فقط        |
| `vitest.config.ts`                                           | ⚠️    | بنية فقط        |
| `ARCHITECTURE.md`                                            | ⚠️    | لم يُفحص        |
| `INSTRUCTIONS_RESTRUCTURE_PLAN.md`                           | ⚠️    | لم يُفحص        |

---

---

# التقرير الثاني: التدقيق المعرفي للنظام

## المرحلة الثانية: التدقيق المعرفي

> **المنهجية**: هذا التقرير مبني على الفهم التشغيلي الموثَّق في التقرير الأول. كل مشكلة مُوثَّقة بالملف والسطر والتأثير الفعلي.

---

## B1) الأخطاء التشغيلية

### B1-01: `resolveComponents()` يستدعي `store.componentStates` — ~~دائماً فارغ~~

> **✅ تم الإصلاح** — تحقق مباشر من الكود في `packages/data/src/prisma-repository.ts:26-36`

```typescript
// FIX P0-1: include componentStates + pageCompositions so CompositionEngine.resolveComponents works correctly
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

**الوضع الحالي**: `componentStates` يُجلب الآن بشكل صحيح. `resolveComponents()` تعمل إذا وُجدت بيانات في `ComponentState` table. المشكلة الباقية: لا يوجد أي route أو service يكتب إلى `ComponentState` table، فالمصفوفة ستكون فارغة دائماً في الممارسة الفعلية.

**التأثير المتبقي**: الجلب صحيح، لكن الميزة لا تزال غير فعّالة لغياب آلية الكتابة.

---

### B1-02: ازدواجية في جلب blog entities — أوسع مما وُثِّق

**الملف**: `packages/engine/src/core/composition-engine.ts:71-78`

```typescript
const blogArticles = [
  ...(await this.simulationLogic.getDataEntities(storeId, "blog_article")),
  ...(await this.simulationLogic.getDataEntities(storeId, "blog_articles")), // ← زائد
];
const blogCategories = [
  ...(await this.simulationLogic.getDataEntities(storeId, "blog_category")),
  ...(await this.simulationLogic.getDataEntities(storeId, "blog_categories")), // ← زائد أيضاً
];
```

**المشكلة**: التقرير الأصلي ذكر ازدواجية `blog_article/blog_articles` فقط. التحقق من الكود كشف أن `blog_category/blog_categories` تعاني من نفس المشكلة. `SeederService` يُخزّن بـ `'blog_article'` و`'blog_category'` (مفرد) فقط. لذا `blog_articles` و`blog_categories` (جمع) ستُعيد دائماً مصفوفات فارغة — أي 2 استعلام DB إضافيَّين مهدَرَين في كل طلب preview.

**التأثير**: 4 استعلامات DB بدل 2 لجلب المقالات والتصنيفات — نصفها لا يُعيد شيئاً.

---

### B1-03: Cart يُفقد عند إعادة تشغيل الخادم

**الملف**: `packages/engine/src/providers/simulator.service.ts`

**المشكلة**: Cart مُخزّن في `Map` داخل `SimulatorService` instance. لا يُستمر في DB. عند إعادة تشغيل `apps/api`، يُفقد Cart بالكامل.

**التأثير**: أي اختبار يعتمد على Cart عبر جلسات متعددة سيفشل.

> **توضيح (Codex - 2026-02-20):** هذه المعلومة لم تعد صحيحة في الكود الحالي. السلة أصبحت persisted في `DataEntity` (`cart/default`) عبر `persistCartState()` و`getOrCreateCart()` داخل `packages/engine/src/providers/simulator.service.ts:2165` و`packages/engine/src/providers/simulator.service.ts:2176`.

---

### B1-04: `store.description` مُكرّر في composition-engine

**الملف**: `packages/engine/src/core/composition-engine.ts:107`

```typescript
description: storeData.description || storeData.description,
```

**المشكلة**: نفس المصدر مكرر — لا يوجد fallback حقيقي.

**التأثير**: لا تأثير وظيفي، لكنه يُشير إلى كود مُهمَل.

---

### B1-05: `|time_ago` filter ~~يُعيد دائماً نص ثابت~~

> **✅ تم الإصلاح** — تحقق مباشر من الكود في `packages/engine/src/rendering/renderer-service.ts:134-150`

```typescript
Twig.extendFilter("time_ago", (val: any) => {
  if (!val) return "";
  const date = val instanceof Date ? val : new Date(String(val));
  if (isNaN(date.getTime())) return String(val);
  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "منذ لحظات";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `منذ ${diffDays} يوم`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `منذ ${diffMonths} شهر`;
  const diffYears = Math.floor(diffMonths / 12);
  return `منذ ${diffYears} سنة`;
});
```

**الوضع الحالي**: Filter مُنفَّذ بشكل صحيح يحسب الفارق الزمني. تم الإصلاح قبل إجراء التدقيق.

---

### B1-06: `old()` — تنفيذ وهمي | `link()` — مُنقَّح جزئياً

**الملف**: `packages/engine/src/rendering/renderer-service.ts:192-224`

**المشكلة (مُحدَّثة بعد تحقق من الكود)**:

- `old()`: لا يزال يُعيد `''` دائماً — مُصمَّم لعدم الحفظ في سياق المحاكاة.

```typescript
// old() returns previously submitted form value — in simulator context always returns empty string
(Twig as any).extendFunction("old", (_key: string) => "");
```

- `link()`: تحسّن عن ما وُثِّق — يستخدم `store.url` من context، لكن `store.url` مُثبَّت على `previewBasePath` (مسار نسبي وليس domain حقيقي).

```typescript
(Twig as any).extendFunction("link", (val: string) => {
  const store = this.storage.getStore();
  const baseUrl = (store?.context?.store as any)?.url || "";
  const p = String(val || "").replace(/^\/+/, "");
  return baseUrl ? `${baseUrl}/${p}` : `/${p}`;
});
```

**التأثير**: `old()` لا يحفظ قيم النماذج (مقصود). `link()` يُولّد URLs نسبية تحت مسار preview وليس URLs حقيقية للمتجر.

---

### B1-07: `SchemaService` يعتمد على مسار خارجي غير مُدار

**الملف**: `packages/engine/src/core/schema-service.ts:18`

```typescript
this.dataDir = path.join(process.cwd(), "temp_twilight_ext", "data");
```

**المشكلة**: `temp_twilight_ext/data/` غير موجود في monorepo. إذا لم يُنشأ يدوياً، يُعيد `SchemaService` empty defaults بصمت.

**التأثير**: `SimulatorService.mapToSchema()` يُعيد البيانات كما هي دون mapping — ميزة schema mapping معطّلة.

---

### B1-08: `WebhookService` — متصل بـ route لكن فعلياً أعمى

**الملف**: `packages/engine/src/providers/simulator-auth-orchestrator.ts` + `apps/api/src/index.ts:119-120`

**التصحيح بعد تحقق من الكود**:

التقرير الأصلي ادّعى أن `WebhookService` لا يُستدعى من أي route. هذا **غير دقيق**. الواقع:

```typescript
// index.ts:119-120
const webhookService = new WebhookService();
const simulatorAuthOrchestrator = new SimulatorAuthOrchestrator(
  storeLogic,
  webhookService,
);

// simulator.routes.ts:190-193
router.post("/auth/login", async (req, res) => {
  await simulatorAuthOrchestrator.dispatchMockLogin(
    req.storeId,
    req.body || {},
  );
  return ok(res, null, 200, { message: "Mock login code sent" });
});
```

`WebhookService` متصل فعلاً عبر `SimulatorAuthOrchestrator` → `POST /api/v1/auth/login`.

**المشكلة الفعلية**: حلقة الـ dispatch معطّلة من الداخل:

```typescript
// store-logic.ts:182-186
public async getWebhooks(storeId: string): Promise<any[]> {
    const store = await this.storeRepo.getById(storeId, tx);
    // Webhooks logic will be moved to Store model or a dedicated table if needed
    return [];  // ← يُعيد [] دائماً
}
```

`dispatchMockLogin()` تجلب الـ webhooks عبر `getWebhooks()` الذي يُعيد `[]` دائماً → `webhookService.dispatchEvent()` لا يُرسل لأي endpoint.

**التأثير**: الربط المعماري موجود وصحيح. الميزة معطّلة من الداخل بسبب `getWebhooks()` الـ stub.

---

### B1-09: `SallaValidator` يفحص فقط `structure` و`contracts` — لا `runtime`

**الملف**: `packages/engine/src/validators/salla-validator.ts:52`

**المشكلة**: Category `runtime` مُعرَّف في `ValidationRule` لكن لا توجد قواعد من هذه الفئة مُنفَّذة. Category `readiness` يحتوي على قاعدة واحدة ثابتة دائماً `pass`.

**التأثير**: تقرير التحقق ناقص — لا يفحص runtime behavior.

---

### B1-10: `contextMiddleware` لا يتحقق من وجود المتجر

**الملف**: `apps/api/src/routes/simulator.routes.ts`

**المشكلة**: `req.storeId` يُعيّن من URL parameter دون التحقق من وجود المتجر في DB. إذا أُرسل `storeId` غير موجود، تُعيد `getDataEntities()` مصفوفة فارغة بدلاً من خطأ 404.

**التأثير**: Simulator يعمل بصمت مع متاجر غير موجودة.

> **توضيح (Codex - 2026-02-20):** هذه النقطة أصبحت غير دقيقة. `contextMiddleware` يتحقق فعليًا من وجود المتجر ويعيد خطأ عند عدم وجوده عبر `resolver.resolveStore(storeId)` في `apps/api/src/middlewares/context.middleware.ts:28` وشرط `if (!store)` في `apps/api/src/middlewares/context.middleware.ts:29`.

---

## B2) Dead Code / Legacy Artifacts

### B2-01: `StoreState` — جدول DB بلا استخدام

**الملف**: `packages/data/prisma/schema.prisma:72-83`

جدول مُعرَّف في schema ومُولَّد في Prisma client. لا يوجد repository يُنفّذه. لا يوجد أي كود يقرأ منه أو يكتب إليه.

**الحكم**: Dead schema.

---

### B2-02: `ComponentState` — جدول DB بلا استخدام فعلي

**الملف**: `packages/data/prisma/schema.prisma:85-97`

جدول مُعرَّف. لا يوجد repository. `CompositionEngine` يحاول قراءته لكن الجلب لا يُضمّنه (B1-01). الجدول موجود لكن لا يُكتب إليه ولا يُقرأ منه فعلياً.

**الحكم**: Dead schema + broken reference.

> **توضيح (Codex - 2026-02-20):** وصف `broken reference` هنا متقادم جزئيًا. جلب `componentStates` و`pageCompositions` أصبح مضافًا في `PrismaStoreRepository.getById()` داخل `packages/data/src/prisma-repository.ts:25` إلى `packages/data/src/prisma-repository.ts:33`. المتبقي فعلاً هو غياب مسار كتابة واضح إلى `ComponentState`.

---

### B2-03: `PageComposition` — جدول DB بلا استخدام

**الملف**: `packages/data/prisma/schema.prisma:99-108`

جدول مُعرَّف. لا يوجد repository. `RendererService` يقرأ page compositions من `Store.themeSettingsJson` (JSON مُضمَّن) وليس من هذا الجدول.

**الحكم**: Dead schema — تكرار مع `themeSettingsJson`.

---

### B2-04: `Snapshot` — جدول DB بلا استخدام

**الملف**: `packages/data/prisma/schema.prisma:156-163`

جدول مُعرَّف. لا يوجد repository. لا يوجد أي كود يقرأ منه أو يكتب إليه.

**الحكم**: Dead schema.

---

### B2-05: `ContentManager` — class بلا استخدام من routes

**الملف**: `packages/engine/src/core/content-manager.ts`

`ContentManager` مُنشأ في `index.ts` ومُمرَّر إلى `CompositionEngine`. لكن `CompositionEngine` لا يستدعيه أبداً — يستدعي `StoreLogic` مباشرة. لا يوجد route يستدعي `ContentManager`.

**الحكم**: Dead class — مُنشأ ومُمرَّر لكن لا يُستخدم.

---

### B2-06: `Collection` و`CollectionItem` و`DataBinding` — infrastructure بلا استخدام

**الملف**: `packages/data/prisma/schema.prisma:123-154`

3 جداول + 2 repositories (`PrismaCollectionRepository`، `PrismaDataBindingRepository`) + `ContentManager.createCollection()` + `ContentManager.bindData()`. لا يوجد route يستدعي أياً منها.

**الحكم**: Dead infrastructure — مُنفَّذ بالكامل لكن لا يُستخدم.

---

### B2-07: `WebhookService` — ~~service بلا استدعاء~~

> **⚠️ تصحيح** — بعد التحقق من الكود تبيّن أن التقييم الأصلي كان خاطئاً.

`WebhookService` مُستخدَم فعلاً عبر `SimulatorAuthOrchestrator` (راجع B1-08). ليس Dead service بل **service متصل لكن بلا تأثير فعلي** بسبب `getWebhooks()` الـ stub.

**الحكم المُعدَّل**: Service مُوصَّل معمارياً، لكن ميزة dispatch معطّلة من الداخل.

---

### B2-08: `LocalizationService` — instance غير مُستخدم

**الملف**: `packages/engine/src/core/localization-service.ts`

`CompositionEngine` يستخدم فقط `LocalizationService.flatten()` (static method) — لا يستخدم instance methods. `RendererService` يُنفّذ ترجمته الخاصة مستقلة.

**الحكم**: Instance غير مُستخدم — فقط static method تُستدعى مباشرة.

---

### B2-09: `archive/` — وثائق محذوفة مؤرشفة

3 مجلدات من وثائق قديمة تم حذفها من `Docs/` وأرشفتها + ملف zip.

**الحكم**: يمكن حذفها بعد التأكد من عدم الحاجة إليها.

---

### B2-10: `system.routes.ts` — 2 endpoints بلا قيمة

يُعيد قيماً ثابتة hardcoded. لا يقرأ من DB أو config.

**الحكم**: Stub — قيمة محدودة.

> **توضيح (Codex - 2026-02-20):** الملف يحتوي الآن 3 endpoints وليس 2، وبينها endpoint قياسات ديناميكي للمعاينة `/api/system/preview/metrics` في `apps/api/src/routes/system.routes.ts:23`، لذا التوصيف هنا يحتاج تحديثًا.

---

## B3) Orphaned Modules / Files

| الملف                                                 | الحالة                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `packages/contracts/content.ts`                       | مُصدَّر من index.ts، يُستورد في content-manager.ts فقط       |
| `packages/contracts/component.ts`                     | مُصدَّر من index.ts، يُستخدم في composition-engine وrenderer |
| `packages/contracts/src/salla.generated.ts`           | types فقط، لا runtime validation                             |
| `apps/api/src/providers/local-theme-file-provider.ts` | مُنشأ في index.ts، لم يُفحص استخدامه الفعلي                  |
| `packages/engine/seed-store.js`                       | ملف .js في جذر packages/engine، قد يكون script قديم          |
| `apps/api/audit-db.ts` و`check-store.ts`              | scripts تشخيصية يدوية في جذر apps/api                        |

> **توضيح (Codex - 2026-02-20):** اسم الملف في الصف الأول لم يعد مطابقًا للبنية الحالية؛ الموجود فعليًا هو `apps/api/src/providers/local-theme-runtime-adapter.ts` وليس `local-theme-file-provider.ts`.

---

## B4) التكرار (Duplication)

### B4-01: منطق Normalization مُكرَّر

**الملفات**: `simulator.service.ts` و`seeder-service.ts`

- `slugify()` مُنفَّذة في كلا الملفين بنفس المنطق
- `sanitizeImageUrl()` / `DEFAULT_LOCAL_IMAGE` — نفس الـ placeholder
- `generateEntityId()` / `randomString()` — نفس الغرض

**التأثير**: تغيير منطق الـ normalization يتطلب تعديل ملفين.

---

### B4-02: `pickLocalizedText()` مُكرَّرة

دالة اختيار النص (ar أولاً، ثم en) مُنفَّذة في `SimulatorService` ونفس المنطق موجود ضمنياً في `ThemeLoader.extractMetadata()`.

---

### B4-03: `blog_article` vs `blog_articles` — ازدواجية في entity types

3 أماكن تتعامل مع نوعي `blog_article` و`blog_articles` بشكل مختلف. لا يوجد توحيد.

---

### B4-04: `wrapResponse()` — هيكل response مُكرَّر

`wrapResponse()` تُنشئ نفس هيكل `{ success, data, pagination, metadata }` في كل endpoint. هذا تصميم مقصود لمحاكاة Salla API format، لكن الدالة نفسها يمكن مشاركتها.

---

## B5) التعارضات المعمارية

### B5-01: مصدران للحقيقة لـ Page Compositions

جدول `PageComposition` في DB (لا يُستخدم) + `Store.themeSettingsJson` (يُستخدم فعلياً). أي كود مستقبلي يقرأ من الجدول سيجد بيانات مختلفة عما يقرأه `RendererService`.

---

### B5-02: `StoreLogic` يُستدعى مباشرة — تجاوز `ContentManager`

`ContentManager` صُمِّم ليكون الواجهة الوحيدة لـ data entities. لكن `SimulatorService` و`CompositionEngine` يستدعيان `StoreLogic` مباشرة، متجاوزَين `ContentManager`. يُشير إلى تغيير معماري لم يكتمل.

---

### B5-03: نظامان للترجمة موجودان

`LocalizationService` (instance غير مُستخدم) + `RendererService` internal localization (مُستخدم فعلياً). لا يوجد نظام ترجمة موحّد.

---

### B5-04: `HookService` — in-memory بلا persistence ولا routes

`HookService` يُخزّن hooks في `Map`. لا يوجد route لتسجيل hooks. `hookService.getAll()` دائماً يُعيد `{}` باستثناء `body:end` الذي يُضيفه `CompositionEngine` مباشرة.

---

### B5-05: `IThemeFileProvider` — interface بلا استخدام واضح

`SimulatorService` يستقبل `IThemeFileProvider` في constructor. لم يُفحص استخدامه الفعلي في الـ 1755 سطر.

> **توضيح (Codex - 2026-02-20):** هذا البند يحتاج تحديث تسمية ودقة: الواجهة المستخدمة حاليًا هي `IThemeRuntimeAdapter` (وليس `IThemeFileProvider`) وهي مستخدمة فعليًا في `SimulatorService` و`RendererService` (مثل `getThemeSettings/getThemeComponents/getThemeSchema`) في `packages/engine/src/providers/simulator.service.ts:4198` و`packages/engine/src/rendering/renderer-service.ts:45`.

---

## B6) النواقص التصميمية

| الرقم | النقص                                                    | التأثير                              |
| ----- | -------------------------------------------------------- | ------------------------------------ |
| B6-01 | لا يوجد Error Boundary في Rendering Pipeline             | HTML جزئي أو فارغ عند فشل Twig       |
| B6-02 | لا يوجد Validation لـ DataEntity payload                 | أي JSON يُقبل بدون schema validation |
| B6-03 | لا يوجد Rate Limiting أو Auth على Simulator endpoints    | `/api/v1/*` مفتوحة بالكامل           |
| B6-04 | `SynchronizationService` يجلب بيانات بدون Authentication | يعمل فقط مع Salla APIs العامة        |
| B6-05 | لا يوجد Pagination فعلي في Simulator responses           | جميع البيانات تُعاد دفعة واحدة       |
| B6-06 | `temp_twilight_ext` — dependency خارجية غير مُدارة       | لا script لإنشائها، لا توثيق         |
| B6-07 | Cart لا يدعم cleanup عند تعدد المتاجر                    | تراكم Cart في memory                 |

> **توضيح (Codex - 2026-02-20):**
>
> - `B6-01` يحتاج تحديث: يوجد fallback واضح عند فشل الرندر (`Renderer Error`) + fallback إلى `page-single` في `packages/engine/src/rendering/renderer-service.ts:860` و`packages/engine/src/rendering/preview-runtime-service.ts:56`.
> - `B6-05` لم يعد دقيقًا كليًا: pagination مطبقة فعليًا لعدة موارد (`products/orders/notifications/blog articles`) عبر `buildPaginatedResponse` داخل `packages/engine/src/providers/simulator.service.ts:3282` و`packages/engine/src/providers/simulator.service.ts:3536`.
> - `B6-07` لم يعد صحيحًا: السلة ليست memory map؛ مرتبطة بـ`storeId` ومخزنة كـ`DataEntity` داخل `packages/engine/src/providers/simulator.service.ts:2171`.

---

## B7) المخاطر المستقبلية

| الرقم | الخطر                                                   | الخطورة                           |
| ----- | ------------------------------------------------------- | --------------------------------- |
| B7-01 | SQLite لا يدعم concurrent writes                        | لا يمكن scale horizontally        |
| B7-02 | Twig.js `cache: false` — أداء                           | تدهور عند زيادة الثيمات           |
| B7-03 | `AsyncLocalStorage` كـ Context Carrier                  | صعوبة اختبار filters بشكل معزول   |
| B7-04 | `themeSettingsJson` كـ Blob JSON                        | صعوبة الاستعلام والـ migration    |
| B7-05 | `SeederService` يُولّد بيانات عشوائية                   | لا reproducibility في الاختبارات  |
| B7-06 | `SynchronizationService` يحذف قبل المزامنة بلا rollback | خطر فقدان بيانات عند فشل المزامنة |

> **توضيح (Codex - 2026-02-20):** بند `B7-02` يحتاج تنقيح؛ Twig caching ليس معطلاً قسريًا، بل قابل للتفعيل عبر متغير البيئة `VTDR_TWIG_CACHE=1` في `packages/engine/src/rendering/renderer-service.ts:56`.

---

## ملخص التدقيق

### إحصائيات

| الفئة                | العدد  | الخطورة       |
| -------------------- | ------ | ------------- |
| B1: أخطاء تشغيلية    | 10     | متوسطة-عالية  |
| B2: Dead Code        | 10     | منخفضة-متوسطة |
| B3: Orphaned Modules | 6      | منخفضة        |
| B4: Duplication      | 4      | منخفضة        |
| B5: تعارضات معمارية  | 5      | عالية         |
| B6: نواقص تصميمية    | 7      | متوسطة-عالية  |
| B7: مخاطر مستقبلية   | 6      | متوسطة        |
| **المجموع**          | **48** |               |

### أعلى 5 مشكلات بالأولوية

| الترتيب | المشكلة                                          | التأثير                    |
| ------- | ------------------------------------------------ | -------------------------- |
| 1       | **B1-01**: `componentStates` دائماً فارغ         | ميزة كاملة معطّلة          |
| 2       | **B5-01**: مصدران للحقيقة لـ Page Compositions   | تعارض بيانات محتمل         |
| 3       | **B5-02**: `ContentManager` متجاوَز              | معمارية غير متسقة          |
| 4       | **B1-07**: `SchemaService` يعتمد على مسار خارجي  | ميزة schema mapping معطّلة |
| 5       | **B7-06**: `SynchronizationService` بلا rollback | خطر فقدان بيانات           |

> **توضيح (Codex - 2026-02-20):** هذا الترتيب يحتاج تحديث دوري؛ بعض البنود هنا تغيّرت حالتها فعليًا (مثل `B1-01` لم يعد "broken reference" بعد إصلاح include، و`B1-03`/`B1-10` تغيرت كما وُضح أعلاه).

### الكيانات الميتة (Dead Infrastructure)

```
جداول DB غير مُستخدمة : StoreState, ComponentState, PageComposition, Snapshot
Repositories غير مُستخدمة: PrismaCollectionRepository, PrismaDataBindingRepository
Classes غير مُستخدمة  : ContentManager (كـ dependency), WebhookService
```

> **توضيح (Codex - 2026-02-20):** `WebhookService` ليس غير مستخدم بالكامل؛ هو موصول عبر `SimulatorAuthOrchestrator` من route `POST /api/v1/auth/login`، لكن dispatch الفعلي محدود لأن `getWebhooks()` يعيد قائمة فارغة دائمًا في `packages/engine/src/core/store-logic.ts:185`.

### الكيانات المُنفَّذة جزئياً

```
HookService         : مُنفَّذ لكن لا يوجد route لتسجيل hooks
LocalizationService : instance غير مُستخدم، فقط static method
SallaValidator      : category 'runtime' فارغة
```

---

---

# التقرير الثالث: خارطة الإجراءات

> **المصدر**: مبني على نتائج التقرير الثاني (48 مشكلة).
> **المبدأ**: الأولوية للإصلاحات التي تُعيد تشغيل ميزات معطّلة، ثم التنظيف المعماري، ثم التحسينات المستقبلية.

---

## المرحلة P0 - إصلاحات فورية (ميزات معطّلة)

> هذه المشكلات تُعطّل ميزات موجودة في الكود لكنها لا تعمل. إصلاحها لا يتطلب تغييراً معمارياً.

### P0-01: إصلاح componentStates في PrismaStoreRepository

**المشكلة**: B1-01 - page.components دائماً فارغ
**الملف**: `packages/data/src/prisma-repository.ts:27-31`
**الخطوة**: أضف `componentStates: true` في `include` عند `getById()`
**الجهد**: 5 دقائق | **التأثير**: يُعيد تشغيل `resolveComponents()` بالكامل

---

### P0-02: توحيد blog_article entity type

**المشكلة**: B1-02 + B4-03 - ازدواجية في جلب المقالات
**الملفات**: `composition-engine.ts`، `seeder-service.ts`، `simulator.service.ts`
**الخطوة**: اختر نوعاً واحداً (`blog_article`) وطبّقه في الثلاثة. احذف الجلب المزدوج من CompositionEngine.
**الجهد**: 30 دقيقة | **التأثير**: يمنع تكرار المقالات في RuntimeContext

---

### P0-03: إصلاح store.description المكرر

**المشكلة**: B1-04
**الملف**: `packages/engine/src/core/composition-engine.ts:107`
**الخطوة**: استبدل `storeData.description || storeData.description` بـ `storeData.description || store.title`
**الجهد**: 2 دقيقة | **التأثير**: إصلاح fallback حقيقي

---

### P0-04: إصلاح |time_ago filter

**المشكلة**: B1-05
**الملف**: `packages/engine/src/rendering/renderer-service.ts`
**الخطوة**: استبدل القيمة الثابتة بحساب فعلي للفارق الزمني.
**الجهد**: 20 دقيقة | **التأثير**: يُعيد تشغيل filter الزمن في جميع templates

---

### P0-05: إصلاح contextMiddleware - التحقق من وجود المتجر

**المشكلة**: B1-10
**الملف**: `apps/api/src/routes/simulator.routes.ts`
**الخطوة**: أضف `storeRepo.getById(storeId)` في middleware وأعد 404 إذا لم يُوجد.
**الجهد**: 15 دقيقة | **التأثير**: يمنع الطلبات الصامتة على متاجر غير موجودة

> **توضيح (Codex - 2026-02-20):** `P0-05` منفذ فعليًا في الوضع الحالي عبر `resolver.resolveStore(storeId)` وفحص `if (!store)` داخل `apps/api/src/middlewares/context.middleware.ts:28` و`apps/api/src/middlewares/context.middleware.ts:29`.

---

### P0-06: توثيق temp_twilight_ext أو استبداله

**المشكلة**: B1-07 + B6-06
**الملف**: `packages/engine/src/core/schema-service.ts`
**الخطوة**: أضف script `tools/setup-schema-ext.sh` أو README.md يشرح كيفية الحصول على `temp_twilight_ext`
**الجهد**: 1 ساعة | **التأثير**: يُزيل الـ dependency الخفية

---

## المرحلة P1 - تنظيف معماري

> إزالة الكود الميت وتوحيد المعمارية. لا يُضيف ميزات جديدة لكن يُقلّل التعقيد.

### P1-01: حذف الجداول الميتة من Prisma Schema

**المشكلة**: B2-01, B2-02, B2-03, B2-04
**الملف**: `packages/data/prisma/schema.prisma`
**الجداول للحذف**: StoreState، PageComposition، Snapshot
**ملاحظة**: ComponentState يجب إبقاؤه بعد إصلاح P0-01.
**الجهد**: 2 ساعة (schema + migration + generated client)
**التأثير**: تبسيط schema من 11 إلى 8 نماذج

---

### P1-02: حذف ContentManager أو تفعيله

**المشكلة**: B2-05 + B5-02
**الملف**: `packages/engine/src/core/content-manager.ts`
**الخيار A** (أسرع): احذف ContentManager من index.ts وأزل dependency من CompositionEngine.
**الخيار B** (أفضل معمارياً): حوّل SimulatorService وCompositionEngine ليستخدما ContentManager بدلاً من StoreLogic مباشرة.
**الجهد**: A = 30 دقيقة | B = 3 ساعات

---

### P1-03: حذف Collection وCollectionItem وDataBinding infrastructure

**المشكلة**: B2-06
**الملفات**: `schema.prisma`، `prisma-repository.ts`، `content-manager.ts`، `dal.contract.ts`
**الخطوة**: احذف الجداول الثلاثة + repositories + interfaces + methods في ContentManager.
**الجهد**: 2 ساعة | **التأثير**: تبسيط كبير في data layer

---

### P1-04: حذف WebhookService أو ربطه بـ route

**المشكلة**: B1-08 + B2-07
**الخيار A**: احذف WebhookService إذا لم تكن Webhooks في الخطة.
**الخيار B**: أضف route `POST /store/:storeId/webhooks/dispatch` يستدعيه.
**الجهد**: A = 15 دقيقة | B = 1 ساعة

---

### P1-05: توحيد نظام الترجمة

**المشكلة**: B5-03
**الملفات**: `localization-service.ts`، `renderer-service.ts`
**الخطوة**: اختر نظاماً واحداً. إذا كان RendererService هو المُستخدم، احذف LocalizationService instance من CompositionEngine واستخدم static method مباشرة.
**الجهد**: 1 ساعة

---

### P1-06: استخراج utilities مشتركة

**المشكلة**: B4-01 + B4-02
**الملف الجديد**: `packages/engine/src/utils/normalizers.ts`
**الدوال**: `slugify()`، `sanitizeImageUrl()`، `generateEntityId()`، `pickLocalizedText()`
**الجهد**: 1 ساعة | **التأثير**: مصدر واحد للـ normalization logic

---

### P1-07: إضافة Error Boundary في Rendering Pipeline

**المشكلة**: B6-01
**الملف**: `packages/engine/src/rendering/renderer-service.ts`
**الخطوة**: عند فشل Twig، أعد HTML يحتوي على رسالة خطأ واضحة بدلاً من HTML فارغ.
**الجهد**: 30 دقيقة

> **توضيح (Codex - 2026-02-20):** يوجد تنفيذ جزئي قائم بالفعل: `renderer-service` يعيد HTML خطأ واضحًا عند failure، ويوجد fallback إضافي في preview runtime إلى `page-single`، راجع `packages/engine/src/rendering/renderer-service.ts:860` و`packages/engine/src/rendering/preview-runtime-service.ts:56`.

---

### P1-08: إضافة Validation لـ DataEntity payload

**المشكلة**: B6-02
**الملف**: `packages/data/src/prisma-repository.ts`
**الخطوة**: أضف Zod schema validation قبل `JSON.stringify(payload)` في `create()` و`upsertByEntityKey()`.
**الجهد**: 2 ساعة

---

### P1-09: تنظيف archive/ وscripts التشخيصية

**المشكلة**: B2-09 + B3-06
**الخطوة**: احذف `archive/` بعد مراجعة محتواه. انقل `audit-db.ts` و`check-store.ts` إلى `tools/` أو احذفهما.
**الجهد**: 30 دقيقة

---

## المرحلة P2 - تحسينات مستقبلية

> تحسينات تتطلب قرارات معمارية أكبر أو وقتاً أطول.

### P2-01: استبدال SQLite بـ PostgreSQL

**المشكلة**: B7-01
**الخطوة**: غيّر `provider = "sqlite"` إلى `provider = "postgresql"` في `schema.prisma` + migration.
**الجهد**: 4 ساعات | **التأثير**: يُتيح concurrent writes وscaling

---

### P2-02: تفعيل Twig caching

**المشكلة**: B7-02
**الملف**: `packages/engine/src/rendering/renderer-service.ts`
**الخطوة**: فعّل `cache: true` في Twig وأضف cache invalidation عند تغيير الثيم.
**الجهد**: 2 ساعة | **التأثير**: تحسين أداء ملحوظ

> **توضيح (Codex - 2026-02-20):** التفعيل موجود جزئيًا عبر `VTDR_TWIG_CACHE=1` (toggle بالبيئة) في `packages/engine/src/rendering/renderer-service.ts:56`. المتبقي هو سياسة invalidation وتحكم تشغيلي أدق.

---

### P2-03: إضافة Rollback في SynchronizationService

**المشكلة**: B7-06
**الملف**: `packages/engine/src/providers/synchronization-service.ts`
**الخطوة**: استخدم `prisma.$transaction()` لتغليف `clearDataEntities()` + جميع عمليات الإنشاء.
**الجهد**: 3 ساعات | **التأثير**: يمنع فقدان البيانات عند فشل المزامنة

---

### P2-04: إضافة Cart persistence في DB

**المشكلة**: B1-03
**الخطوة**: أضف جدول `Cart` في Prisma schema واستبدل `Map` في SimulatorService.
**الجهد**: 4 ساعات

> **توضيح (Codex - 2026-02-20):** هذا البند يحتاج إعادة صياغة؛ cart persistence موجودة حاليًا بالفعل لكن عبر `DataEntity (cart/default)` وليس جدول Prisma مستقل، داخل `packages/engine/src/providers/simulator.service.ts:2171`.

---

### P2-05: إضافة Pagination فعلي في Simulator

**المشكلة**: B6-05
**الملف**: `packages/engine/src/providers/simulator.service.ts`
**الخطوة**: أضف `page` و`per_page` query parameters وطبّق slice على البيانات.
**الجهد**: 2 ساعة

> **توضيح (Codex - 2026-02-20):** مطبقة جزئيًا بالفعل لعدة endpoints (`products`, `orders`, `notifications`, `blog articles`) عبر `pickQueryInt` و`buildPaginatedResponse`؛ يلزم فقط استكمال التغطية لبقية الموارد غير المpaginated.

---

### P2-06: تفعيل SallaValidator category runtime

**المشكلة**: B1-09
**الملف**: `packages/engine/src/validators/salla-validator.ts`
**الخطوة**: أضف قواعد تفحص وجود Twig templates للصفحات المطلوبة وصحة `twilight.json` settings.
**الجهد**: 3 ساعات

---

### P2-07: إضافة Auth على Simulator endpoints

**المشكلة**: B6-03
**الملف**: `apps/api/src/routes/simulator.routes.ts`
**الخطوة**: أضف API key middleware أو JWT validation على `/api/v1/*`.
**الجهد**: 3 ساعات

---

## ملخص خطة العمل

| المرحلة      | المشكلات | الجهد الإجمالي | الأثر                          |
| ------------ | -------- | -------------- | ------------------------------ |
| P0 - فوري    | 6 مشكلات | ~3 ساعات       | إعادة تشغيل ميزات معطّلة       |
| P1 - تنظيف   | 9 مشكلات | ~12 ساعة       | تبسيط المعمارية وتقليل التعقيد |
| P2 - مستقبلي | 7 مشكلات | ~21 ساعة       | تحسين الأداء والموثوقية        |

### ترتيب التنفيذ المقترح داخل P0

```
P0-03 (2 دقيقة) → P0-01 (5 دقائق) → P0-05 (15 دقيقة) → P0-04 (20 دقيقة) → P0-02 (30 دقيقة) → P0-06 (1 ساعة)
```

### المشكلات المتبقية غير المُعالَجة

المشكلات التالية موثّقة لكن لا تحتاج إجراءً فورياً:

- B3-01 إلى B3-05 - ملفات تحتاج فحصاً إضافياً
- B6-04 - Salla Sync بدون Auth (قيد خارجي)
- B7-03 - AsyncLocalStorage (تصميم مقصود)
- B7-04 - themeSettingsJson كـ Blob (تغيير كبير)
- B7-05 - Seeder عشوائي (يمكن إضافة seed ثابت لاحقاً)

---

_نهاية التقرير الشامل — VTDR Full Audit Combined — 2026-02-20_
