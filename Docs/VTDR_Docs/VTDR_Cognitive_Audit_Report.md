# VTDR – Cognitive System Audit Report

## المرحلة الثانية: التدقيق المعرفي

> **المنهجية**: هذه الوثيقة تُبنى على الفهم التشغيلي المُوثَّق في `VTDR_Operational_Understanding_Report.md`. كل مشكلة مُوثَّقة بالملف والسطر والتأثير الفعلي.

---

## B1) الأخطاء التشغيلية

### B1-01: `resolveComponents()` يستدعي `store.componentStates` — دائماً فارغ

**الملف**: `packages/engine/src/core/composition-engine.ts:124`

```typescript
page: {
    id: activePageId,
    components: this.resolveComponents(schema, (store as any).componentStates || [])
}
```

**المشكلة**: `store.componentStates` هو Prisma relation يتطلب `include: { componentStates: true }` عند الجلب. لكن `PrismaStoreRepository.getById()` يُضمّن فقط `{ themeVersion: true }`. النتيجة: `(store as any).componentStates` دائماً `undefined` → يُعيد `[]` دائماً → `page.components` دائماً فارغ.

**التأثير**: `resolveComponents()` لا تعمل أبداً. `ComponentState` table في DB لا يُقرأ أبداً.

---

### B1-02: `blog_article` و`blog_articles` — ازدواجية في الجلب

**الملف**: `packages/engine/src/core/composition-engine.ts:57-64`

**المشكلة**: `SeederService` يُخزّن المقالات بـ `'blog_article'` (مفرد). `CompositionEngine` يجمع `blog_article` + `blog_articles` معاً. إذا وُجدت بيانات بالنوعين، تُضاف مرتين في context.

**التأثير**: تكرار محتمل في `blog_articles` داخل RuntimeContext.

---

### B1-03: Cart يُفقد عند إعادة تشغيل الخادم

**الملف**: `packages/engine/src/providers/simulator.service.ts`

**المشكلة**: Cart مُخزّن في `Map` داخل `SimulatorService` instance. لا يُستمر في DB. عند إعادة تشغيل `apps/api`، يُفقد Cart بالكامل.

**التأثير**: أي اختبار يعتمد على Cart عبر جلسات متعددة سيفشل.

---

### B1-04: `store.description` مُكرّر في composition-engine

**الملف**: `packages/engine/src/core/composition-engine.ts:107`

```typescript
description: storeData.description || storeData.description,
```

**المشكلة**: نفس المصدر مكرر — لا يوجد fallback حقيقي.

**التأثير**: لا تأثير وظيفي، لكنه يُشير إلى كود مُهمَل.

---

### B1-05: `|time_ago` filter يُعيد دائماً نص ثابت

**الملف**: `packages/engine/src/rendering/renderer-service.ts`

**المشكلة**: Filter مُنفَّذ بشكل ثابت — لا يحسب الفارق الزمني الحقيقي.

**التأثير**: أي template يستخدم `|time_ago` يُعرض دائماً "منذ وقت قصير" بغض النظر عن التاريخ.

---

### B1-06: `old()` و`link()` Twig functions — تنفيذ وهمي

**الملف**: `packages/engine/src/rendering/renderer-service.ts`

**المشكلة**:

- `old()` يُعيد دائماً `''` — لا يحفظ قيم النماذج
- `link()` يُعيد `/${val}` فقط — لا يُولّد URLs حقيقية

**التأثير**: أي template يستخدم `old()` لن يُعيد القيم المُدخلة.

---

### B1-07: `SchemaService` يعتمد على مسار خارجي غير مُدار

**الملف**: `packages/engine/src/core/schema-service.ts:18`

```typescript
this.dataDir = path.join(process.cwd(), 'temp_twilight_ext', 'data');
```

**المشكلة**: `temp_twilight_ext/data/` غير موجود في monorepo. إذا لم يُنشأ يدوياً، يُعيد `SchemaService` empty defaults بصمت.

**التأثير**: `SimulatorService.mapToSchema()` يُعيد البيانات كما هي دون mapping — ميزة schema mapping معطّلة.

---

### B1-08: `WebhookService` لا يُستدعى من أي route

**الملف**: `packages/engine/src/webhooks/webhook-service.ts`

**المشكلة**: مُنفَّذ بالكامل (HMAC signature، HTTP dispatch) لكن لا يوجد أي route أو service يستدعيه.

**التأثير**: ميزة Webhooks معطّلة تماماً رغم وجود الكود.

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

### B2-07: `WebhookService` — service بلا استدعاء

**الملف**: `packages/engine/src/webhooks/webhook-service.ts`

مُنفَّذ بالكامل (68 سطر) مع HMAC signature. لا يوجد أي استدعاء له في أي route أو service.

**الحكم**: Dead service.

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

---

## B3) Orphaned Modules / Files

| الملف | الحالة |
|-------|--------|
| `packages/contracts/content.ts` | مُصدَّر من index.ts، يُستورد في content-manager.ts فقط |
| `packages/contracts/component.ts` | مُصدَّر من index.ts، يُستخدم في composition-engine وrenderer |
| `packages/contracts/src/salla.generated.ts` | types فقط، لا runtime validation |
| `apps/api/src/providers/local-theme-file-provider.ts` | مُنشأ في index.ts، لم يُفحص استخدامه الفعلي |
| `packages/engine/seed-store.js` | ملف .js في جذر packages/engine، قد يكون script قديم |
| `apps/api/audit-db.ts` و`check-store.ts` | scripts تشخيصية يدوية في جذر apps/api |

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

---

## B6) النواقص التصميمية

| الرقم | النقص | التأثير |
|-------|-------|---------|
| B6-01 | لا يوجد Error Boundary في Rendering Pipeline | HTML جزئي أو فارغ عند فشل Twig |
| B6-02 | لا يوجد Validation لـ DataEntity payload | أي JSON يُقبل بدون schema validation |
| B6-03 | لا يوجد Rate Limiting أو Auth على Simulator endpoints | `/api/v1/*` مفتوحة بالكامل |
| B6-04 | `SynchronizationService` يجلب بيانات بدون Authentication | يعمل فقط مع Salla APIs العامة |
| B6-05 | لا يوجد Pagination فعلي في Simulator responses | جميع البيانات تُعاد دفعة واحدة |
| B6-06 | `temp_twilight_ext` — dependency خارجية غير مُدارة | لا script لإنشائها، لا توثيق |
| B6-07 | Cart لا يدعم cleanup عند تعدد المتاجر | تراكم Cart في memory |

---

## B7) المخاطر المستقبلية

| الرقم | الخطر | الخطورة |
|-------|-------|---------|
| B7-01 | SQLite لا يدعم concurrent writes | لا يمكن scale horizontally |
| B7-02 | Twig.js `cache: false` — أداء | تدهور عند زيادة الثيمات |
| B7-03 | `AsyncLocalStorage` كـ Context Carrier | صعوبة اختبار filters بشكل معزول |
| B7-04 | `themeSettingsJson` كـ Blob JSON | صعوبة الاستعلام والـ migration |
| B7-05 | `SeederService` يُولّد بيانات عشوائية | لا reproducibility في الاختبارات |
| B7-06 | `SynchronizationService` يحذف قبل المزامنة بلا rollback | خطر فقدان بيانات عند فشل المزامنة |

---

## ملخص التدقيق

### إحصائيات

| الفئة | العدد | الخطورة |
|-------|-------|---------|
| B1: أخطاء تشغيلية | 10 | متوسطة-عالية |
| B2: Dead Code | 10 | منخفضة-متوسطة |
| B3: Orphaned Modules | 6 | منخفضة |
| B4: Duplication | 4 | منخفضة |
| B5: تعارضات معمارية | 5 | عالية |
| B6: نواقص تصميمية | 7 | متوسطة-عالية |
| B7: مخاطر مستقبلية | 6 | متوسطة |
| **المجموع** | **48** | |

### أعلى 5 مشكلات بالأولوية

| الترتيب | المشكلة | التأثير |
|---------|---------|---------|
| 1 | **B1-01**: `componentStates` دائماً فارغ | ميزة كاملة معطّلة |
| 2 | **B5-01**: مصدران للحقيقة لـ Page Compositions | تعارض بيانات محتمل |
| 3 | **B5-02**: `ContentManager` متجاوَز | معمارية غير متسقة |
| 4 | **B1-07**: `SchemaService` يعتمد على مسار خارجي | ميزة schema mapping معطّلة |
| 5 | **B7-06**: `SynchronizationService` بلا rollback | خطر فقدان بيانات |

### الكيانات الميتة (Dead Infrastructure)

```
جداول DB غير مُستخدمة : StoreState, ComponentState, PageComposition, Snapshot
Repositories غير مُستخدمة: PrismaCollectionRepository, PrismaDataBindingRepository
Classes غير مُستخدمة  : ContentManager (كـ dependency), WebhookService
```

### الكيانات المُنفَّذة جزئياً

```
HookService         : مُنفَّذ لكن لا يوجد route لتسجيل hooks
LocalizationService : instance غير مُستخدم، فقط static method
SallaValidator      : category 'runtime' فارغة
```
