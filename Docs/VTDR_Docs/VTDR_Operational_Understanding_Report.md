# VTDR – Operational Understanding Report

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

### E. نقاط دخول CLI/Scripts

| الأمر                       | الوظيفة               |
| --------------------------- | --------------------- |
| `npm run data:harden:check` | فحص صحة بيانات المتجر |
| `npm run data:harden`       | تصحيح بيانات المتجر   |
| `npm run docs:sync`         | مزامنة الوثائق        |
| `npm run docs:drift`        | فحص انحراف الوثائق    |
| `npm run studio`            | Prisma Studio         |

---

## 3. خريطة المكونات

```
┌─────────────────────────────────────────────────────────────────┐
│                         apps/ui (React)                          │
│  SystemHome → StoreProducts/Brands/Categories/... → StorePreview │
│  يتواصل مع API عبر fetch() مباشرة على localhost:3001            │
└──────────────────────────┬──────────────────────────────────────┘
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

---

## 7. مناطق الغموض وما يلزم لتأكيدها

### غموض 1: Cart Persistence

**الملاحظة**: Cart مُخزّن في Map داخل SimulatorService.  
**الغموض**: هل هذا مقصود أم نقص في التنفيذ؟  
**ما يلزم**: فحص ما إذا كان هناك DataEntity من نوع `cart` في DB.

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
