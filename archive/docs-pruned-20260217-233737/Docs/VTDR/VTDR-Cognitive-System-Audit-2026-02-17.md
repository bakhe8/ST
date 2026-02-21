# VTDR — تقرير التدقيق المعرفي للنظام (الوضع الحالي)

تاريخ التنفيذ: 17 فبراير 2026  
نطاق الحقيقة: الكود والتشغيل الفعلي فقط (وليس الوثائق)

## 1) تقرير الفهم التشغيلي

### 1.1 الجرد التشغيلي الكامل (جرد المستودع)

- جرد الملفات خارج `node_modules`: `962` ملف (يتضمن `.turbo`) حسب `Docs/INVENTORY-ALL-FILES-INCL-TURBO.csv`.
- جرد التحليل التشغيلي (مع استبعاد كاش `.turbo`): `632` ملف حسب `Docs/COVERAGE-STATS.json`.
- التوزيع التنفيذي الرئيس:
  - `apps`: واجهة وإي بي آي.
  - `packages`: العقود، البيانات، المحرك، والثيم.
  - `Docs`: وثائق حالية.
  - `archive`: أرشيف وثائق قديم.
  - `.turbo`: مخرجات وكاش تشغيل.

### 1.2 الوصف الحقيقي للمعمارية As-Is

المشروع **Monorepo** يعمل بنمط **Modular Monolith** مع حدود حزم اسمية، لكن بحدود تنفيذية غير محكمة بالكامل:

- طبقة UI: React + Vite (`apps/ui/src/main.tsx:1`, `apps/ui/src/App.tsx:17`).
- طبقة API: Express مجمّع لكل الطبقات (`apps/api/src/index.ts:63`, `apps/api/src/index.ts:136`).
- طبقة Engine: تكوين السياق، المحاكاة، الرندر، الويبهوكس (`packages/engine/index.ts:1`).
- طبقة Data: Prisma repositories (`packages/data/src/prisma-repository.ts:4`).
- طبقة Contracts: أنواع/عقود مشتركة (`packages/contracts/index.ts:1`).
- طبقة Theme Files: `packages/themes/theme-raed-master/*`.

الحدود الفعلية ليست صلبة للأسباب التالية:

- API يحقن عميل Prisma من `@prisma/client` مباشرة (`apps/api/src/index.ts:2`) بدل الالتزام بعميل `@vtdr/data`.
- وجود آثار Store-First وScenario معًا في أجزاء مختلفة (مصدر مقابل artifacts/bridge).

### 1.3 خريطة نقاط الدخول

#### أ) نقاط دخول أوامر التطوير والبناء

- الجذر: `npm run dev|build|test|lint|studio|clean` (`package.json:9`).
- API: `npm --workspace apps/api run dev|build|start|serve:mock` (`apps/api/package.json:7`).
- UI: `npm --workspace apps/ui run dev|build|lint` (`apps/ui/package.json:7`).

#### ب) نقاط دخول HTTP (واجهة API والمسار التشغيلي)

- Health:
  - `GET /api/health` (`apps/api/src/index.ts:119`)
  - `GET /api/debug/test` (`apps/api/src/index.ts:120`)
- System:
  - `GET /api/system/info` (`apps/api/src/routes/system.routes.ts:6`)
  - `GET /api/system/status` (`apps/api/src/routes/system.routes.ts:14`)
- Themes:
  - `GET /api/themes/` (`apps/api/src/routes/theme.routes.ts:13`)
  - `POST /api/themes/discover|register|sync` (`apps/api/src/routes/theme.routes.ts:18`, `apps/api/src/routes/theme.routes.ts:42`, `apps/api/src/routes/theme.routes.ts:55`)
- Simulator (`/api/v1/*` بعد context middleware):
  - `GET products|products/:id|categories|categories/:id|static-pages|menus/:type|theme/settings`
  - `PUT theme/settings`
  - `POST auth/login`
    (`apps/api/src/routes/simulator.routes.ts:13` إلى `apps/api/src/routes/simulator.routes.ts:56`)
- Stores:
  - `GET|POST /api/stores`
  - `GET|POST|PATCH|DELETE /api/stores/:id...`
  - نفس الراوتر مركّب أيضًا على `/api/v1/stores`
    (`apps/api/src/index.ts:141`, `apps/api/src/index.ts:142`, `apps/api/src/routes/store.routes.ts:15`)
- Runtime Renderer:
  - `GET /preview/:storeId/:themeId/:version`
  - `POST /render`
    (`apps/api/src/routes/runtime.routes.ts:13`, `apps/api/src/routes/runtime.routes.ts:39`)

#### ج) نقاط دخول مسارات الواجهة

- نظام عام: `/` (`apps/ui/src/App.tsx:20`).
- متجر: `/store/:storeId/*` مع `products/categories/static-pages/settings/theme/preview` (`apps/ui/src/App.tsx:26`).

#### د) نقاط دخول تشغيل الثيم

- تعريف الثيم: `twilight.json` (`packages/themes/theme-raed-master/twilight.json:1`).
- القالب الرئيسي: `src/views/layouts/master.twig` (`packages/themes/theme-raed-master/src/views/layouts/master.twig:52`).
- مدخل الصفحة الرئيسية: `src/views/pages/index.twig` (`packages/themes/theme-raed-master/src/views/pages/index.twig:8`).
- webpack entries للـ JS/CSS (`packages/themes/theme-raed-master/webpack.config.js:11`).

### 1.4 خريطة المكونات (المسؤوليات والاعتمادات)

| المكوّن                 | المسؤولية                                       | يعتمد على                                     | يستدعيه                  |
| ----------------------- | ----------------------------------------------- | --------------------------------------------- | ------------------------ |
| `apps/api/src/index.ts` | تركيب النظام (DI + routes)                      | Engine + Data + Middleware                    | أمر تشغيل API            |
| `context.middleware`    | حل والتحقق من سياق المتجر                       | `ContextResolver`                             | `/api/v1/*` و`/` runtime |
| `ContextResolver`       | استخراج `storeId` من header/query/path والتحقق  | `StoreLogic`                                  | Middleware               |
| `store.routes`          | CRUD وتشغيل seed/sync/promote/inherit           | `StoreFactory`, `StoreLogic`, providers       | API Router               |
| `simulator.routes`      | محاكاة API لنماذج Salla                         | `SimulatorService`                            | `/api/v1`                |
| `runtime.routes`        | معاينة ورندر الثيم                              | `CompositionEngine`, `RendererService`        | `/preview`               |
| `CompositionEngine`     | بناء `RuntimeContext` من Store+Theme+Data       | `StoreRepo`, `ThemeRegistry`, `StoreLogic`    | runtime routes           |
| `RendererService`       | تنفيذ Twig + hooks + bridge                     | Theme files + `SchemaService`                 | runtime routes           |
| `SimulatorService`      | واجهات products/categories/pages/theme-settings | `StoreLogic`, `SchemaService`, theme provider | simulator routes         |
| `StoreFactory`          | إنشاء/نسخ/حذف متجر + auto seed/sync             | repos + providers                             | store routes             |
| `StoreLogic`            | تحديث إعدادات/branding وقراءة entities          | `StoreRepo`, `DataEntityRepo`                 | عدة خدمات                |
| `Prisma*Repository`     | تنفيذ DAL على SQLite                            | Prisma client                                 | engine/api services      |

### 1.5 تدفق البيانات (رسومات نصية)

#### التدفق-أ: قراءة المنتجات (الواجهة -> API -> المحرك -> قاعدة البيانات)

`StoreProducts.tsx`  
→ `GET /api/v1/products` مع header context (`apps/ui/src/pages/StoreProducts.tsx:38`)  
→ `context.middleware` (`apps/api/src/index.ts:138`)  
→ `simulator.routes.get('/products')` (`apps/api/src/routes/simulator.routes.ts:13`)  
→ `SimulatorService.getProducts` (`packages/engine/src/providers/simulator.service.ts:47`)  
→ `StoreLogic.getDataEntities` (`packages/engine/src/core/store-logic.ts:40`)  
→ `PrismaDataEntityRepository.getByStoreAndType` (`packages/data/src/prisma-repository.ts:90`)  
→ استجابة Envelope simulator.

#### التدفق-ب: معاينة الصفحة (الواجهة -> المسار التشغيلي -> التركيب -> الرندر)

`StorePreview.tsx` يبني `/preview/...` (`apps/ui/src/pages/StorePreview.tsx:18`)  
→ `context.middleware` على المسار الجذري (`apps/api/src/index.ts:152`)  
→ `runtime.routes /preview` (`apps/api/src/routes/runtime.routes.ts:13`)  
→ `engine.buildContext` (`packages/engine/src/core/composition-engine.ts:30`)  
→ `renderer.renderPage` (`packages/engine/src/rendering/renderer-service.ts:262`)  
→ Twig + `sdk-bridge.js` injection (`packages/engine/src/rendering/renderer-service.ts:477`).

#### التدفق-ج: حفظ إعدادات الثيم

`ThemeSettingsPanel` يرسل `PUT /api/v1/theme/settings` (`apps/ui/src/components/ThemeSettingsPanel.tsx:74`)  
→ `simulator.routes.put('/theme/settings')` (`apps/api/src/routes/simulator.routes.ts:51`)  
→ `SimulatorService.updateThemeSettings` (`packages/engine/src/providers/simulator.service.ts:142`)  
→ `StoreLogic.updateBranding` (`packages/engine/src/core/store-logic.ts:25`)  
→ `BrandingSchema.parse` صارم (`packages/contracts/src/schemas.ts:6`).

#### التدفق-د: اكتشاف/تسجيل الثيمات المحلية

`POST /api/themes/discover|register|sync`  
→ `ThemeLoader.scanThemes/loadTwilightSchema` (`packages/engine/src/rendering/theme-loader.ts:11`, `packages/engine/src/rendering/theme-loader.ts:33`)  
→ `ThemeRegistry.syncTheme` (`packages/engine/src/rendering/theme-registry.ts:14`)  
→ `PrismaThemeRepository.upsert/addVersion` (`packages/data/src/prisma-repository.ts:130`, `packages/data/src/prisma-repository.ts:158`).

### 1.6 قواعد التشغيل المستخلصة

1. أي مسار تحت `/api/v1` يمر على `contextMiddleware` أولاً (`apps/api/src/index.ts:138`).
2. حل سياق المتجر يتم بالأولوية: `x-vtdr-store-id` ثم `context-store-id` ثم `store_id` query ثم `/preview/:storeId` (`apps/api/src/services/context-resolver.ts:15`).
3. الرندر يعتمد على `themeId/themeVersionId` الموجودين في store state (`packages/engine/src/core/composition-engine.ts:36`).
4. fallback للصفحة الرئيسية بين `home.twig` و`index.twig` (`packages/engine/src/rendering/renderer-service.ts:270`).
5. إعدادات الثيم تُقرأ من `twilight.json` وتُحفظ حاليًا داخل `brandingJson` (`packages/engine/src/providers/simulator.service.ts:113`, `packages/engine/src/providers/simulator.service.ts:144`).

### 1.7 السلوك التشغيلي الفعلي (أدلة تشغيلية)

على تشغيل API بتاريخ **2026-02-17**:

- `GET /api/health` → `200 OK`.
- `GET /api/system/status` → `200 OK`.
- `GET /api/stores` → `500` برسالة Prisma:  
  `The column main.Store.fakerSeed does not exist`.
- `GET /api/v1/stores` بدون context → `400`  
  `Store context missing. Use x-vtdr-store-id header.`
- `GET /api/v1/products` مع `x-vtdr-store-id` صالح → `400`  
  `Invalid store context: <store-id>`.
- `GET /preview/<valid-store>/theme-raed-master/1.0.0?page=index` → `400`  
  `Invalid store context`.

### 1.8 الغموضات الحالية وما يلزم لتأكيدها

1. العميل المعتمد نهائيًا لـ Prisma: `@prisma/client` أم `@vtdr/data`؟  
   مطلوب: قرار معماري صريح + regenerate موحد.
2. مصدر الحقيقة لمخطط البيانات: `packages/data/prisma/schema.prisma` أم artifact generated قديم؟  
   مطلوب: تثبيت pipeline توليد/هجرة موحد.
3. الهدف التشغيلي لـ `/api/v1/stores`: هل يجب أن يكون context-less؟  
   مطلوب: Contract API رسمي.
4. هل `PageComponentsEditor` جزء من المسار المنتج أم أثر تجريبي؟  
   مطلوب: قرار إبقاء/إزالة.
5. سياسة CRUD للموارد (`categories/static-pages/products`) في نسخة VTDR الحالية:  
   مطلوب: إعلان نطاق MVP مقابل Full parity.

---

## 2) تقرير التدقيق المعرفي للنظام

### 2.1 الرسوم الإلزامية

#### أ) رسم النداءات

- `CG-01`: `GET /api/v1/products` -> `context.middleware` -> `ContextResolver.validateContext` -> `StoreLogic.getStore` -> `PrismaStoreRepository.getById` -> `SimulatorService.getProducts` -> `StoreLogic.getDataEntities` -> `PrismaDataEntityRepository.getByStoreAndType`.
- `CG-02`: `GET /preview/:storeId/:themeId/:version` -> `context.middleware` -> `runtime.routes` -> `CompositionEngine.buildContext` -> `ThemeRegistry.getTheme` + `StoreLogic.getDataEntities` -> `RendererService.renderPage` -> Twig output.
- `CG-03`: `PUT /api/v1/theme/settings` -> `SimulatorService.updateThemeSettings` -> `StoreLogic.updateBranding` -> `BrandingSchema.parse` -> `storeRepo.update`.
- `CG-04`: `POST /api/themes/sync` -> `ThemeLoader.scanThemes` -> `ThemeRegistry.syncTheme` -> `PrismaThemeRepository.upsert/addVersion`.

#### ب) رسم الاعتمادات

- `DG-UI` -> `DG-API` عبر `fetch(apiUrl(...))` (`apps/ui/src/services/api.ts:4`).
- `DG-API` -> `DG-ENGINE` (`apps/api/src/index.ts:14`).
- `DG-API` -> `DG-DATA` (`apps/api/src/index.ts:33`).
- `DG-ENGINE` -> `DG-CONTRACTS` (`packages/engine/src/core/composition-engine.ts:1`).
- `DG-DATA` -> `DG-CONTRACTS` (`packages/data/src/prisma-repository.ts:2`).
- `DG-API` -> `DG-PRISMA-APP` (`@prisma/client`) (`apps/api/src/index.ts:2`).
- `DG-DATA` -> `DG-PRISMA-DATA` (`packages/data/src/generated-client`) (`packages/data/src/prisma-repository.ts:1`).
- `DG-ENGINE` -> `DG-THEME-FS` (`packages/engine/src/rendering/renderer-service.ts:263`).

#### ج) رسم حساسية البيانات

- `SG-01`: `Store.brandingJson/settingsJson` (إعدادات وتخصيص).
- `SG-02`: `DataEntity.payloadJson` (منتجات/طلبات/بيانات متجر).
- `SG-03`: `Theme twilight.json` (schema + default settings + components).
- `SG-04`: Webhook secrets/signatures (`packages/engine/src/webhooks/webhook-service.ts:33`).
- `SG-05`: External sync inputs (`storeUrl` + remote API responses) (`packages/engine/src/providers/synchronization-service.ts:12`).

### 2.2 النتائج

#### B1) أخطاء الكود

##### CE-01 (حرج)

- **Observation**: انقسام عقد Prisma بين API وData يؤدي لفشل استعلامات المتاجر.
- **Evidence**: `apps/api/src/index.ts:2` يستخدم `@prisma/client`، بينما repos مبنية على `packages/data/src/generated-client` (`packages/data/src/prisma-repository.ts:1`). عميل `@prisma/client` يتوقع `fakerSeed` (`node_modules/.prisma/client/schema.prisma:55`)، بينما schema الفعلي لا يحوي الحقل (`packages/data/prisma/schema.prisma:43`). Runtime: `/api/stores` أعاد `500` مع `fakerSeed does not exist`.
- **Interpretation**: هناك عقدان متباينان لنفس جدول `Store` داخل نفس المسار التنفيذي.
- **Risk**: تعطل أساسي لكل عمليات قراءة/تحقق السياق؛ فشل end-to-end من أول شاشة.
- **Recommendation**: توحيد عميل Prisma في API على عميل `@vtdr/data` فقط، ثم إعادة توليد العميل وتنفيذ فحص drift تلقائي قبل الإقلاع.
- **Graph Link**: `CG-01`, `DG-API`, `DG-PRISMA-APP`, `DG-PRISMA-DATA`, `SG-01`.

##### CE-02 (حرج)

- **Observation**: مسارات `stores` تحت `/api/v1/stores` تمر إجباريًا عبر context middleware.
- **Evidence**: تركيب `apiRouter.use('/v1', contextMiddleware, ...)` قبل `apiRouter.use('/v1/stores', storeRoutes)` (`apps/api/src/index.ts:138`, `apps/api/src/index.ts:142`). Runtime: `GET /api/v1/stores` -> `400 Store context missing`.
- **Interpretation**: خطأ تركيب routing أدى لتقييد endpoint يفترض أن يكون context-less (list/create).
- **Risk**: UI home لا يستطيع تحميل/إنشاء المتاجر عبر `/v1/stores`.
- **Recommendation**: فصل simulator تحت namespace مستقل أو استثناء `stores` من middleware.
- **Graph Link**: `CG-01`, `DG-API`.

##### CE-03 (عالٍ)

- **Observation**: middleware يضع `req.storeId` فقط، بينما runtime/store routes تعتمد `req.store`.
- **Evidence**: `(req as any).storeId = storeId` فقط (`apps/api/src/middlewares/context.middleware.ts:35`). في المقابل `runtime.routes` يستخدم `req.store` (`apps/api/src/routes/runtime.routes.ts:19`) و`store.routes` يعيد `req.store` (`apps/api/src/routes/store.routes.ts:29`).
- **Interpretation**: فجوة عقد request object بين middleware والراوترات.
- **Risk**: أعطال 404/قيمة فارغة حتى مع سياق صحيح.
- **Recommendation**: إما إرفاق `req.store` داخل middleware، أو منع الاعتماد على `req.store` نهائيًا.
- **Graph Link**: `CG-02`, `DG-API`.

##### CE-04 (عالٍ)

- **Observation**: مسار المعاينة في UI لا يتوافق مع Proxy التطوير.
- **Evidence**: UI base `.../api` (`apps/ui/src/services/api.ts:5`)، ثم `StorePreview` يزيل `/api` ويبني `/preview/...` (`apps/ui/src/pages/StorePreview.tsx:17`)، بينما Vite يوكّل `/api` فقط (`apps/ui/vite.config.ts:11`).
- **Interpretation**: مسار preview يخرج من قنطرة proxy المتوقعة.
- **Risk**: iframe preview يفشل حسب بيئة التشغيل/المنفذ.
- **Recommendation**: توحيد مسار preview عبر proxy صريح أو تمريره عبر `/api`.
- **Graph Link**: `CG-02`, `DG-UI`, `DG-API`.

##### CE-05 (عالٍ)

- **Observation**: UI ينفذ عمليات كتابة (`POST/PUT/DELETE`) لموارد لا يوفّر API لها CRUD مطابق.
- **Evidence**: UI: `StoreCategories` و`StoreStaticPages` و`EditProduct` تستخدم write operations (`apps/ui/src/pages/StoreCategories.tsx:47`, `apps/ui/src/pages/StoreStaticPages.tsx:39`, `apps/ui/src/pages/EditProduct.tsx:129`). API simulator يوفّر قراءة لهذه الموارد فقط (`apps/api/src/routes/simulator.routes.ts:13` إلى `apps/api/src/routes/simulator.routes.ts:40`).
- **Interpretation**: عقد API/UI غير متزامن فعليًا.
- **Risk**: فشل صامت أو أخطاء 404/400 مع سلوك واجهة مضلل.
- **Recommendation**: إما إغلاق مسارات الكتابة في UI أو إكمال CRUD backend رسميًا.
- **Graph Link**: `CG-01`, `DG-UI`, `DG-API`, `SG-02`.

##### CE-06 (عالٍ)

- **Observation**: حفظ إعدادات الثيم يمر عبر `brandingJson` الصارم.
- **Evidence**: `updateThemeSettings` -> `updateBranding` (`packages/engine/src/providers/simulator.service.ts:142`), و`BrandingSchema` `strict()` (`packages/contracts/src/schemas.ts:20`) بينما مفاتيح `twilight.json` عامة ومتغيرة (`packages/themes/theme-raed-master/twilight.json:89`).
- **Interpretation**: قناة حفظ غير متوافقة دلاليًا مع طبيعة إعدادات الثيم.
- **Risk**: رفض حفظ إعدادات صحيحة وظيفيًا لأنها ليست Branding.
- **Recommendation**: فصل `themeSettingsJson` عن `brandingJson` بمخطط وتعاقد مستقلين.
- **Graph Link**: `CG-03`, `DG-ENGINE`, `SG-01`, `SG-03`.

#### B2) الكود الميت

##### DC-01 (متوسط)

- **Observation**: سكربت seed قديم يستدعي مستودعات لم تعد موجودة.
- **Evidence**: `packages/engine/seed-store.js` يستخدم `PrismaScenarioRepository` (`packages/engine/seed-store.js:1`) غير المصدّر في `packages/data/src/index.ts:1`.
- **Interpretation**: سكربت من حقبة Scenario لم يعد صالحًا.
- **Risk**: أي تشغيل له يفشل ويعيد إحياء مسار مفاهيمي قديم.
- **Recommendation**: إزالة السكربت أو إعادة كتابته وفق Store-First.
- **Graph Link**: `DG-ENGINE`, `DG-DATA`.

##### DC-02 (متوسط)

- **Observation**: محرر مكونات الصفحة يستهدف endpoint scenarios غير موجود.
- **Evidence**: `fetch(http://localhost:3001/api/scenarios/.../settings)` (`apps/ui/src/components/PageComponentsEditor.tsx:140`) ولا توجد routes مقابلة في API الحالي.
- **Interpretation**: مكوّن UI غير متصل بالمسار الحي.
- **Risk**: واجهة غير قابلة للعمل وتضليل تشغيلي.
- **Recommendation**: ربطه بعقد Store-First أو عزله من المسار المنتج.
- **Graph Link**: `DG-UI`, `DG-API`.

##### DC-03 (منخفض)

- **Observation**: سكربت `serve:mock` يشير لملف غير موجود.
- **Evidence**: `apps/api/package.json:11` يشير `st-server.js` والملف مفقود.
- **Interpretation**: أمر تشغيل ميت.
- **Risk**: فشل تشغيل أوتوماتيكي/تشخيصي.
- **Recommendation**: حذف السكربت أو إضافة الملف.
- **Graph Link**: `DG-API`.

#### B3) الملفات اليتيمة

##### OF-01 (متوسط)

- **Observation**: ملف Prisma محلي غير مستهلك.
- **Evidence**: `apps/api/prisma/vtdr-client.cjs` لا يملك أي مرجع في المستودع.
- **Interpretation**: أداة يتيمة خارج مسار التشغيل الرسمي.
- **Risk**: تعدد مصادر اتصال DB وإرباك تشغيلي.
- **Recommendation**: توثيقه كأداة منفصلة أو إزالته.
- **Graph Link**: `DG-API`, `SG-01`.

##### OF-02 (متوسط)

- **Observation**: كثافة artifacts مبنية وقديمة داخل `dist`.
- **Evidence**: `dist_files=250` في `Docs/COVERAGE-STATS.json`، ومنها artifacts تحمل نموذج Scenario داخل `packages/data/dist/generated-client/index.js:91`.
- **Interpretation**: artifacts غير منضبطة وتحتوي حقب معمارية مختلطة.
- **Risk**: قراءة/تشغيل خاطئ من artifact stale.
- **Recommendation**: اعتماد سياسة clean-build وتحييد artifacts عن source-of-truth.
- **Graph Link**: `DG-DATA`, `DG-ENGINE`.

##### OF-03 (منخفض)

- **Observation**: تعدد قواعد بيانات ونسخ احتياطية داخل prisma.
- **Evidence**: `packages/data/prisma/dev.db`, `dev.db.old`, `dev.db.bak`, ومسارات متداخلة `packages/data/prisma/packages/data/prisma/dev.db`.
- **Interpretation**: بيئة بيانات غير مفردة المصدر.
- **Risk**: نتائج تدقيق واختبارات غير قابلة للتكرار.
- **Recommendation**: تثبيت مسار DB وحذف النسخ غير المعتمدة.
- **Graph Link**: `SG-01`, `SG-02`.

#### B4) الازدواجية

##### DP-01 (عالٍ)

- **Observation**: ازدواج عميل Prisma داخل مسار API نفسه.
- **Evidence**: API ينشئ `PrismaClient` من `@prisma/client` (`apps/api/src/index.ts:2`) بينما repos تعتمد عقود عميل آخر (`packages/data/src/prisma-repository.ts:1`).
- **Interpretation**: ازدواج طبقة DAL الفعلية.
- **Risk**: Drift schema مستمر وصعب الاكتشاف.
- **Recommendation**: حقن عميل واحد فقط من طبقة البيانات.
- **Graph Link**: `DG-PRISMA-APP`, `DG-PRISMA-DATA`.

##### DP-02 (متوسط)

- **Observation**: تركيب store routes على مسارين متوازيين (`/stores` و`/v1/stores`).
- **Evidence**: `apps/api/src/index.ts:141`, `apps/api/src/index.ts:142`.
- **Interpretation**: ازدواج واجهة بدون فصل سياق واضح.
- **Risk**: سلوك مختلف لنفس العملية حسب المسار.
- **Recommendation**: مسار رسمي واحد + alias منضبط أو redirect.
- **Graph Link**: `DG-API`.

##### DP-03 (متوسط)

- **Observation**: ازدواج اصطلاحي بين عقود حديثة وقديمة.
- **Evidence**: `packages/contracts/runtime.ts` (Store-First) مقابل `packages/contracts/runtime.contract.d.ts` (Scenario/VirtualStore) (`packages/contracts/runtime.contract.d.ts:17`).
- **Interpretation**: ازدواج مرجعية مفاهيم النظام.
- **Risk**: قرارات تنفيذ جديدة على أساس عقد قديم.
- **Recommendation**: إيقاف تصدير العقود القديمة أو وضعها تحت namespace `legacy` صريح.
- **Graph Link**: `DG-CONTRACTS`.

#### B5) تعارضات معمارية

##### AC-01 (عالٍ)

- **Observation**: الهدف Store-First يتعارض مع آثار Scenario داخل المسار الحي/المساعد.
- **Evidence**: `sdk-bridge` يرسل `X-Scenario-Id` (`apps/api/public/sdk-bridge.js:23`)، و`PageComponentsEditor` يستدعي `/api/scenarios` (`apps/ui/src/components/PageComponentsEditor.tsx:140`).
- **Interpretation**: الحدّ المعماري غير محكوم بين legacy والجديد.
- **Risk**: سلوك مختلط وصعب الاستقرار طويل الأمد.
- **Recommendation**: طبقة توافق legacy مع تاريخ إيقاف واضح، أو إزالة مباشرة من runtime الحالي.
- **Graph Link**: `DG-UI`, `DG-API`, `DG-CONTRACTS`.

##### AC-02 (متوسط)

- **Observation**: منفذ UI الفعلي `3000` لا يطابق السياق التشغيلي المعلن `5173`.
- **Evidence**: `apps/ui/vite.config.ts:8` يحدد `port: 3000`.
- **Interpretation**: تناقض بيئة التشغيل المرجعية.
- **Risk**: تشخيص خاطئ لمشاكل الاتصال والproxy.
- **Recommendation**: توحيد المنفذ المعياري وتثبيته في docs/scripts.
- **Graph Link**: `DG-UI`, `DG-API`.

##### AC-03 (متوسط)

- **Observation**: بناء API يضم مصدر engine داخل مخرجاته بسبب `tsconfig include`.
- **Evidence**: `apps/api/tsconfig.json:41` يتضمن `../../packages/engine/**/*`، ومخرجات متكررة في `apps/api/dist/packages/engine/*`.
- **Interpretation**: تسرّب حدود الحزم أثناء البناء.
- **Risk**: artifacts متشابكة وصعوبة تتبع المصدر الفعلي للكود المنفذ.
- **Recommendation**: build مستقل للحزم واستهلاكها كباينري/exports فقط.
- **Graph Link**: `DG-API`, `DG-ENGINE`.

#### B6) فجوات التصميم

##### DGAP-01 (عالٍ)

- **Observation**: غياب اختبارات فعلية عبر الحزم الرئيسية.
- **Evidence**: `apps/api/package.json:13`, `packages/engine/package.json:18`, `packages/contracts/package.json:17` تحتوي `No tests yet`.
- **Interpretation**: لا يوجد Safety Net لسلوك التكامل.
- **Risk**: الانحدارات تمر حتى مع نجاح build.
- **Recommendation**: إدخال integration tests على مسارات `/api/stores`, `/api/v1/products`, `/preview`.
- **Graph Link**: `CG-01`, `CG-02`, `DG-API`.

##### DGAP-02 (متوسط)

- **Observation**: Envelope الاستجابة غير موحّد.
- **Evidence**: `store.routes` يعيد raw object في `PATCH /:id` (`apps/api/src/routes/store.routes.ts:41`) بينما endpoints أخرى تعيد `{success,data}`.
- **Interpretation**: عقد استجابة متذبذب بين المسارات.
- **Risk**: سلوك واجهة غير متوقع عند الفشل/النجاح.
- **Recommendation**: معيار Response DTO موحّد لكل endpoints.
- **Graph Link**: `DG-API`, `DG-UI`.

##### DGAP-03 (متوسط)

- **Observation**: قابلية الرصد منخفضة للأخطاء السياقية.
- **Evidence**: `validateContext` يلتقط أي خطأ ويعيد `false` (`apps/api/src/services/context-resolver.ts:43`) دون code taxonomy للأسباب.
- **Interpretation**: فقدان السبب الأصلي داخل طبقة middleware.
- **Risk**: صعوبة تشخيص الأعطال في الإنتاج.
- **Recommendation**: ترميز أخطاء context (missing|invalid|backend-failure) مع logging منظم.
- **Graph Link**: `CG-01`, `DG-API`.

#### B7) المخاطر المستقبلية

##### FR-01 (عالٍ)

- **Observation**: `sdk-bridge` يعترض Cart/Auth ويستدعي Cart endpoints غير موجودة.
- **Evidence**: `/api/v1/cart*` في `apps/api/public/sdk-bridge.js:40`, `apps/api/public/sdk-bridge.js:50`, `apps/api/public/sdk-bridge.js:58`، ولا توجد cart routes في API الحالي.
- **Interpretation**: جسر SDK يتجاوز قدرة backend الحالية.
- **Risk**: أخطاء JS داخل المعاينة وتدهور تجربة الاختبار.
- **Recommendation**: feature flag للجسر أو استكمال endpoints الأساسية.
- **Graph Link**: `CG-02`, `DG-API`, `DG-THEME-FS`.

##### FR-02 (متوسط)

- **Observation**: الاعتماد على مسارات ثابتة ومحلية داخل renderer.
- **Evidence**: حقن `http://localhost:3001` وSDK scripts مباشرة (`packages/engine/src/rendering/renderer-service.ts:341`, `packages/engine/src/rendering/renderer-service.ts:477`).
- **Interpretation**: coupling قوي مع بيئة محلية محددة.
- **Risk**: تعثر الانتقال لبيئات CI/remote preview متعددة.
- **Recommendation**: إعدادات base URL عبر config/env وليس hardcoded.
- **Graph Link**: `CG-02`, `DG-ENGINE`.

##### FR-03 (متوسط)

- **Observation**: الوثائق الحالية لا تعكس التشغيل الفعلي.
- **Evidence**: أمر خاطئ `pm run dev` (`Docs/DEV.md:9`) وتناقض مفهومي حول scenario (`ARCHITECTURE.md:17`).
- **Interpretation**: وثائق التشغيل ليست مصدرًا موثوقًا.
- **Risk**: قرارات مستقبلية مبنية على افتراضات خاطئة.
- **Recommendation**: توليد وثائق من الكود + فحص Drift إجباري في CI.
- **Graph Link**: `DG-UI`, `DG-API`, `DG-CONTRACTS`.

### 2.3 إثبات التغطية

#### أ) مصفوفة التغطية

- المصفوفة الكاملة (Path, Type, Invoked, Where, Notes):  
  `Docs/COVERAGE-MATRIX-ALL-FILES.csv`
- جرد شامل يتضمن `.turbo`:  
  `Docs/INVENTORY-ALL-FILES-INCL-TURBO.csv`

#### ب) إحصاءات الملفات

(من `Docs/COVERAGE-STATS.json`)

- إجمالي الملفات (بدون `node_modules` وبدون `.turbo`): `632`
- ملفات كود محللة في graph: `111`
- ملفات source قابلة للوصول من entrypoints: `78`
- ملفات مصنفة `invoked=yes`: `150`
- ملفات مصنفة `invoked=no`: `42`
- ملفات مصنفة `invoked=uncertain`: `442`
- ملفات `dist`: `250`
- ملفات docs: `47`
- ملفات archive: `40`

---

## 3) خارطة طريق خطة التنفيذ (فوري / قصير / متوسط)

### فوري (0-3 أيام)

1. توحيد Prisma client في API وإلغاء الانقسام الحالي بين `@prisma/client` و`@vtdr/data`.
2. إصلاح ترتيب تركيب الراوترات بحيث لا يخضع `/api/v1/stores` لـ context middleware.
3. توحيد contract السياق (`req.storeId` مقابل `req.store`) في middleware والroutes.
4. توحيد مسار preview مع Vite proxy (أو تعريف proxy لـ `/preview`).

**معيار الإغلاق**:  
`GET /api/stores` يعمل بدون 500، `GET /api/v1/stores` يعمل بدون context، `GET /preview/...` يعمل بمتجر صالح.

### قصير (1-2 أسبوع)

1. إغلاق فجوة CRUD (إما تطبيق endpoints الناقصة أو تحويل UI Read-only صريح).
2. فصل `themeSettingsJson` عن `brandingJson` بعقد ومخطط مستقل.
3. تنظيف مسارات Scenario القديمة (UI/API/bridge/contracts artifacts).
4. توحيد Envelope الاستجابة والأخطاء عبر API.

**معيار الإغلاق**:  
لا توجد شاشة UI تُطلق endpoint غير موجود أو contract غير متسق.

### متوسط (2-6 أسابيع)

1. إدخال تكامل اختبارات حقيقية (API + preview + persistence).
2. إضافة observability (structured logs + error codes + request tracing).
3. تنظيف artifacts والنسخ اليتيمة (`dist`/db copies) مع سياسة build/release واضحة.
4. إعادة بناء الوثائق من الكود الفعلي مع Drift Gate في CI.

**معيار الإغلاق**:  
اختبارات تكامل تغطي المسارات الحرجة، ووثائق متزامنة مع التنفيذ الفعلي.

---

## ملاحظة تنفيذية

تم تنفيذ التحليل بدون أي تعديل على الكود التشغيلي. التغييرات الوحيدة هي مخرجات تدقيق توثيقية داخل مجلد `Docs`.
