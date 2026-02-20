# VTDR - Action Roadmap

> **المصدر**: مبني على نتائج VTDR_Cognitive_Audit_Report.md (48 مشكلة).
> **المبدأ**: الأولوية للإصلاحات التي تُعيد تشغيل ميزات معطّلة، ثم التنظيف المعماري، ثم التحسينات المستقبلية.

---

## المرحلة P0 - إصلاحات فورية (ميزات معطّلة)

> هذه المشكلات تُعطّل ميزات موجودة في الكود لكنها لا تعمل. إصلاحها لا يتطلب تغييراً معمارياً.

### P0-01: إصلاح componentStates في PrismaStoreRepository

**المشكلة**: B1-01 - page.components دائماً فارغ
**الملف**: packages/data/src/prisma-repository.ts:27-31
**الخطوة**: أضف componentStates: true في include عند getById()
**الجهد**: 5 دقائق | **التأثير**: يُعيد تشغيل resolveComponents() بالكامل

---

### P0-02: توحيد blog_article entity type

**المشكلة**: B1-02 + B4-03 - ازدواجية في جلب المقالات
**الملفات**: composition-engine.ts، seeder-service.ts، simulator.service.ts
**الخطوة**: اختر نوعاً واحداً (blog_article) وطبّقه في الثلاثة. احذف الجلب المزدوج من CompositionEngine.
**الجهد**: 30 دقيقة | **التأثير**: يمنع تكرار المقالات في RuntimeContext

---

### P0-03: إصلاح store.description المكرر

**المشكلة**: B1-04
**الملف**: packages/engine/src/core/composition-engine.ts:107
**الخطوة**: استبدل `storeData.description || storeData.description` بـ `storeData.description || store.title`
**الجهد**: 2 دقيقة | **التأثير**: إصلاح fallback حقيقي

---

### P0-04: إصلاح |time_ago filter

**المشكلة**: B1-05
**الملف**: packages/engine/src/rendering/renderer-service.ts
**الخطوة**: استبدل القيمة الثابتة بحساب فعلي للفارق الزمني.
**الجهد**: 20 دقيقة | **التأثير**: يُعيد تشغيل filter الزمن في جميع templates

---

### P0-05: إصلاح contextMiddleware - التحقق من وجود المتجر

**المشكلة**: B1-10
**الملف**: apps/api/src/routes/simulator.routes.ts
**الخطوة**: أضف storeRepo.getById(storeId) في middleware وأعد 404 إذا لم يُوجد.
**الجهد**: 15 دقيقة | **التأثير**: يمنع الطلبات الصامتة على متاجر غير موجودة

---

### P0-06: توثيق temp_twilight_ext أو استبداله

**المشكلة**: B1-07 + B6-06
**الملف**: packages/engine/src/core/schema-service.ts
**الخطوة**: أضف script tools/setup-schema-ext.sh أو README.md يشرح كيفية الحصول على temp_twilight_ext
**الجهد**: 1 ساعة | **التأثير**: يُزيل الـ dependency الخفية

---

## المرحلة P1 - تنظيف معماري

> إزالة الكود الميت وتوحيد المعمارية. لا يُضيف ميزات جديدة لكن يُقلّل التعقيد.

### P1-01: حذف الجداول الميتة من Prisma Schema

**المشكلة**: B2-01, B2-02, B2-03, B2-04
**الملف**: packages/data/prisma/schema.prisma
**الجداول للحذف**: StoreState، PageComposition، Snapshot
**ملاحظة**: ComponentState يجب إبقاؤه بعد إصلاح P0-01.
**الجهد**: 2 ساعة (schema + migration + generated client)
**التأثير**: تبسيط schema من 11 إلى 8 نماذج

---

### P1-02: حذف ContentManager أو تفعيله

**المشكلة**: B2-05 + B5-02
**الملف**: packages/engine/src/core/content-manager.ts
**الخيار A** (أسرع): احذف ContentManager من index.ts وأزل dependency من CompositionEngine.
**الخيار B** (أفضل معمارياً): حوّل SimulatorService وCompositionEngine ليستخدما ContentManager بدلاً من StoreLogic مباشرة.
**الجهد**: A = 30 دقيقة | B = 3 ساعات

---

### P1-03: حذف Collection وCollectionItem وDataBinding infrastructure

**المشكلة**: B2-06
**الملفات**: schema.prisma، prisma-repository.ts، content-manager.ts، dal.contract.ts
**الخطوة**: احذف الجداول الثلاثة + repositories + interfaces + methods في ContentManager.
**الجهد**: 2 ساعة | **التأثير**: تبسيط كبير في data layer

---

### P1-04: حذف WebhookService أو ربطه بـ route

**المشكلة**: B1-08 + B2-07
**الخيار A**: احذف WebhookService إذا لم تكن Webhooks في الخطة.
**الخيار B**: أضف route POST /store/:storeId/webhooks/dispatch يستدعيه.
**الجهد**: A = 15 دقيقة | B = 1 ساعة

---

### P1-05: توحيد نظام الترجمة

**المشكلة**: B5-03
**الملفات**: localization-service.ts، renderer-service.ts
**الخطوة**: اختر نظاماً واحداً. إذا كان RendererService هو المُستخدم، احذف LocalizationService instance من CompositionEngine واستخدم static method مباشرة.
**الجهد**: 1 ساعة

---

### P1-06: استخراج utilities مشتركة

**المشكلة**: B4-01 + B4-02
**الملف الجديد**: packages/engine/src/utils/normalizers.ts
**الدوال**: slugify()، sanitizeImageUrl()، generateEntityId()، pickLocalizedText()
**الجهد**: 1 ساعة | **التأثير**: مصدر واحد للـ normalization logic

---

### P1-07: إضافة Error Boundary في Rendering Pipeline

**المشكلة**: B6-01
**الملف**: packages/engine/src/rendering/renderer-service.ts
**الخطوة**: عند فشل Twig، أعد HTML يحتوي على رسالة خطأ واضحة بدلاً من HTML فارغ.
**الجهد**: 30 دقيقة

---

### P1-08: إضافة Validation لـ DataEntity payload

**المشكلة**: B6-02
**الملف**: packages/data/src/prisma-repository.ts
**الخطوة**: أضف Zod schema validation قبل JSON.stringify(payload) في create() وupsertByEntityKey().
**الجهد**: 2 ساعة

---

### P1-09: تنظيف archive/ وscripts التشخيصية

**المشكلة**: B2-09 + B3-06
**الخطوة**: احذف archive/ بعد مراجعة محتواه. انقل audit-db.ts وcheck-store.ts إلى tools/ أو احذفهما.
**الجهد**: 30 دقيقة

---

## المرحلة P2 - تحسينات مستقبلية

> تحسينات تتطلب قرارات معمارية أكبر أو وقتاً أطول.

### P2-01: استبدال SQLite بـ PostgreSQL

**المشكلة**: B7-01
**الخطوة**: غيّر provider = "sqlite" إلى provider = "postgresql" في schema.prisma + migration.
**الجهد**: 4 ساعات | **التأثير**: يُتيح concurrent writes وscaling

---

### P2-02: تفعيل Twig caching

**المشكلة**: B7-02
**الملف**: packages/engine/src/rendering/renderer-service.ts
**الخطوة**: فعّل cache: true في Twig وأضف cache invalidation عند تغيير الثيم.
**الجهد**: 2 ساعة | **التأثير**: تحسين أداء ملحوظ

---

### P2-03: إضافة Rollback في SynchronizationService

**المشكلة**: B7-06
**الملف**: packages/engine/src/providers/synchronization-service.ts
**الخطوة**: استخدم prisma.$transaction() لتغليف clearDataEntities() + جميع عمليات الإنشاء.
**الجهد**: 3 ساعات | **التأثير**: يمنع فقدان البيانات عند فشل المزامنة

---

### P2-04: إضافة Cart persistence في DB

**المشكلة**: B1-03
**الخطوة**: أضف جدول Cart في Prisma schema واستبدل Map في SimulatorService.
**الجهد**: 4 ساعات

---

### P2-05: إضافة Pagination فعلي في Simulator

**المشكلة**: B6-05
**الملف**: packages/engine/src/providers/simulator.service.ts
**الخطوة**: أضف page وper_page query parameters وطبّق slice على البيانات.
**الجهد**: 2 ساعة

---

### P2-06: تفعيل SallaValidator category runtime

**المشكلة**: B1-09
**الملف**: packages/engine/src/validators/salla-validator.ts
**الخطوة**: أضف قواعد تفحص وجود Twig templates للصفحات المطلوبة وصحة twilight.json settings.
**الجهد**: 3 ساعات

---

### P2-07: إضافة Auth على Simulator endpoints

**المشكلة**: B6-03
**الملف**: apps/api/src/routes/simulator.routes.ts
**الخطوة**: أضف API key middleware أو JWT validation على /api/v1/*.
**الجهد**: 3 ساعات

---

## ملخص خطة العمل

| المرحلة | المشكلات | الجهد الإجمالي | الأثر |
|---------|---------|----------------|-------|
| P0 - فوري | 6 مشكلات | ~3 ساعات | إعادة تشغيل ميزات معطّلة |
| P1 - تنظيف | 9 مشكلات | ~12 ساعة | تبسيط المعمارية وتقليل التعقيد |
| P2 - مستقبلي | 7 مشكلات | ~21 ساعة | تحسين الأداء والموثوقية |

### ترتيب التنفيذ المقترح داخل P0

P0-03 (2 دقيقة) → P0-01 (5 دقائق) → P0-05 (15 دقيقة) → P0-04 (20 دقيقة) → P0-02 (30 دقيقة) → P0-06 (1 ساعة)

### المشكلات المتبقية غير المُعالَجة

المشكلات التالية موثّقة لكن لا تحتاج إجراءً فورياً:

- B3-01 إلى B3-05 - ملفات تحتاج فحصاً إضافياً
- B6-04 - Salla Sync بدون Auth (قيد خارجي)
- B7-03 - AsyncLocalStorage (تصميم مقصود)
- B7-04 - themeSettingsJson كـ Blob (تغيير كبير)
- B7-05 - Seeder عشوائي (يمكن إضافة seed ثابت لاحقاً)
