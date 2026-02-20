# VTDR Execution Restructure Plan

تاريخ الخطة: 2026-02-17  
نطاق الخطة: تنفيذ عملي من الوضع الحالي إلى نظام مستقر وقابل للصيانة، مع اعتماد الكود كمصدر حقيقة.

## الهدف التنفيذي
تحقيق استقرار تشغيلي أولًا (P0)، ثم إغلاق فجوات التوافق UI/API/Engine/Data، ثم إعادة بناء الوثائق من الكود الفعلي فقط.

## مرجع التنفيذ (Source of Truth)
- `Docs/Specifications/SYSTEM_SPEC.md`
- `Docs/Specifications/Master Specification.md`
- `Docs/Specifications/API_SPEC.md`
- `Docs/Specifications/DATA_SCHEMA_SPEC.md`
- `Docs/Specifications/STORE_PARITY_BACKLOG.md`
- `Docs/VTDR/API-ROUTES.snapshot.json`
- `Docs/VTDR/DATA-SCHEMA.snapshot.json`
- Historical archive: `archive/docs-pruned-20260217-233737/Docs`

## تسلسل الأولوية
1. تثبيت التشغيل الحرج P0.
2. إغلاق فجوة CRUD والتوافقات.
3. تثبيت اختبارات التكامل كـ Gate.
4. إعادة بناء الوثائق تدريجيًا من الكود.

## خطة يومية قابلة للتنفيذ

### اليوم 1: توحيد Prisma Client (P0)
المخرجات:
1. توحيد مصدر Prisma المستخدم فعليًا بين API وطبقة `packages/data`.
2. إزالة مسار الانقسام الذي يسبب فشل `GET /api/stores`.

معيار الإغلاق:
1. `GET /api/stores` يرجع `200` بدون خطأ `fakerSeed`.
2. لا يوجد استدعاء متضارب لعميل Prisma بين طبقات التشغيل.

تحقق سريع:
```powershell
npm run dev
# ثم اختبار:
# GET http://localhost:3001/api/stores
```

### اليوم 2: حسم Store Context Contract (P0)
المخرجات:
1. توحيد عقد السياق بين `req.storeId` و`req.store` عبر middleware والroutes.
2. ضمان أن مسارات `/api/v1/stores` لا تتطلب context مسبق.

معيار الإغلاق:
1. `GET /api/v1/stores` يعمل بدون `Store context missing`.
2. مسارات simulator/runtime تستقبل سياقًا صحيحًا عند وجود متجر صالح.

تحقق سريع:
```powershell
# بدون هيدر سياق:
# GET http://localhost:3001/api/v1/stores
# مع هيدر سياق صالح:
# GET http://localhost:3001/api/v1/products
```

### اليوم 3: تثبيت Preview Routing بين UI وAPI (P0)
المخرجات:
1. توحيد مسار preview في الواجهة والخادم وVite proxy.
2. منع أي تحويل مسارات متضارب بين `/api` و`/preview`.

معيار الإغلاق:
1. شاشة المعاينة في UI تفتح HTML صالحًا لمتجر/ثيم صالحين.
2. لا توجد أخطاء proxy مرتبطة بمسارات preview.

تحقق سريع:
```powershell
npm run dev
# افتح:
# http://localhost:5173/store/<storeId>/preview
```

### اليوم 4: توحيد API Response Envelope
المخرجات:
1. اعتماد envelope موحد: `{ success, data, error }`.
2. مواءمة استهلاك UI مع envelope الفعلي في جميع الشاشات النشطة.

معيار الإغلاق:
1. لا يوجد كسر عقد بين `store.settings/theme.settings/products/categories/static-pages`.
2. اختفاء حالات نجاح/فشل صامتة بسبب اختلاف شكل الرد.

تحقق سريع:
```powershell
# أمثلة:
# PATCH /api/stores/:id
# GET /api/v1/theme/settings
# PUT /api/v1/theme/settings
```

### اليوم 5: قرار CRUD Parity (تنفيذي)
المخرجات:
1. قرار رسمي لكل مورد: `implemented` أو `read-only`.
2. إما تنفيذ endpoints الناقصة أو تعطيل مسارات الكتابة في UI مؤقتًا بشكل صريح.

معيار الإغلاق:
1. لا توجد عملية UI ترسل طلبًا غير مدعوم.
2. مصفوفة endpoints محدثة بحالة كل endpoint.

### اليوم 6: Theme Settings Persistence Boundary
المخرجات:
1. فصل `themeSettings` عن `branding` (عقد/تخزين/تدفق).
2. منع خلط مفاهيم branding داخل إعدادات الثيم العامة.

معيار الإغلاق:
1. حفظ/قراءة إعدادات الثيم يعمل بدون رفض schema بسبب حقول غير متوافقة.
2. round-trip ناجح للإعدادات القادمة من `twilight.json`.

### اليوم 7: تنظيف آثار Scenario Legacy
المخرجات:
1. عزل أو إزالة المراجع legacy في UI/API/SDK bridge/contracts artifacts.
2. تعريف حدود توافقية صريحة إن كانت مطلوبة مؤقتًا.

معيار الإغلاق:
1. المسار التشغيلي الأساسي Store-First بالكامل.
2. أي بقايا legacy إما معزولة أو موثقة كـ deprecated.

### اليوم 8-9: Integration Tests كـ Quality Gate
المخرجات:
1. اختبارات تكامل حقيقية تغطي: stores lifecycle، simulator read/write الفعلي، preview render path.
2. إزالة الاعتماد على `No tests yet` كسلوك نجاح وهمي.

معيار الإغلاق:
1. فشل العقد يعكس فشلًا حقيقيًا في pipeline.
2. نجاح `npm run test` يعني مرور سيناريوهات تشغيلية فعلية.

### اليوم 10: توثيق تدريجي من الكود + Drift Gate
المخرجات:
1. تحديث الوثائق الأساسية فقط وفق التنفيذ:
   - `ARCHITECTURE.md`
   - `Docs/DEV.md`
   - مواصفة API/Schema المرتبطة مباشرة بالتنفيذ
2. إضافة آلية كشف انحراف doc/code في CI على routes + schema.

معيار الإغلاق:
1. الوثائق الأساسية متطابقة مع التشغيل الفعلي.
2. أي تغيير routes/schema مستقبلي يكسر CI إذا لم يصاحبه تحديث مرجعي.

## قواعد الحوكمة أثناء التنفيذ
1. لا يبدأ أي Feature جديد قبل إغلاق P0 (اليوم 1-4).
2. أي تعديل contract يجب أن يرافقه اختبار تكامل.
3. أي تحديث وثائقي يجب أن يتضمن مرجعًا مباشرًا لملف/مسار تنفيذ.
4. إذا تعارضت الوثائق مع الكود، الكود هو المصدر، ثم تُصحح الوثيقة.

## تعريف الانتهاء الفعلي
1. `GET /api/stores` و`GET /api/v1/stores` و`/preview` تعمل end-to-end.
2. لا يوجد مسار UI نشط يصطدم endpoint غير مدعوم.
3. اختبارات التكامل تعمل فعليًا وتفشل عند كسر العقد.
4. الوثائق الأساسية تعكس الواقع التشغيلي الحالي.

## الحالة الحالية
- الخطة اليومية محدثة: 2026-02-18.
- تم التنفيذ الفعلي:
  - اليوم 1: مكتمل (توحيد Prisma في المسار التشغيلي).
  - اليوم 2: مكتمل (توحيد Store Context وحقن `req.store`).
  - اليوم 3: مكتمل (Proxy المعاينة في Vite لـ `/preview` و`/themes`).
  - اليوم 4: مكتمل جزئيًا (إصلاح envelope لمسارات `PATCH /stores/:id` ومسارات store الحرجة).
  - اليوم 5: مكتمل (تنفيذ CRUD فعلي لمسارات `products/categories/static-pages`).
  - اليوم 6: مكتمل (فصل `themeSettingsJson` عن `brandingJson` مع توافق انتقالي للقراءة).
  - اليوم 7: مكتمل (تنظيف آثار Scenario Legacy في المسارات النشطة UI/API/SDK).
  - اليوم 8-9: مكتمل (اختبارات تكامل ووحدة فعلية + تشغيل `npm run test` بنجاح).
  - اليوم 10: مكتمل (تحديث `ARCHITECTURE.md` و`Docs/DEV.md` و`API_SPEC.md` و`DATA_SCHEMA_SPEC.md` + إضافة `docs:sync`/`docs:drift` وربطها مع `validate`).
  - اليوم 11: مكتمل (إعادة بناء `SYSTEM_SPEC.md` و`Master Specification.md` و`Database Design Document.md` و`Unified-Answers-Execution-Blueprint.md` كوثائق تشغيلية code-first).
  - اليوم 12: مكتمل (توسيع helper `ok/fail` ليشمل `context/runtime/simulator`، وتوحيد status الفعلي في simulator، وإضافة اختبارات فشل/حواف للتكامل).
  - اليوم 13: مكتمل (تقليص `Docs` إلى وثائق نشطة فقط، وأرشفة بقية الملفات في `archive/docs-pruned-20260217-233737/Docs`).
  - اليوم 14: مكتمل (إضافة أداة `data:harden` لتنظيف payloads القديمة في `DataEntity` وتطبيع صور/فئات المنتجات والهيكل الهرمي للأقسام).
  - اليوم 15: مكتمل (بدء Slice بصري للثيم: ربط `themeSettingsJson` بالمعاينة، دمج آمن لتحديثات إعدادات الثيم، وتفعيل شاشة تحرير مكونات الصفحات وحفظ `page_compositions`).
  - اليوم 16: مكتمل (إثراء خيارات مكونات الثيم من بيانات المتجر الفعلية `products/categories/brands` وربطها بالمعاينة عبر resolver بصري قبل render).
  - اليوم 17: مكتمل (ترقية محرر `collection` في `Page Components` إلى محرر مرئي منظّم للبنرات/الروابط/السلايدر/التقييمات بدل JSON خام، مع دعم ترتيب/إضافة/حذف العناصر وحقول `image/textarea/integer/variable-list`).
  - اليوم 18: مكتمل (تنفيذ محرر روابط ذكي `variable-list` مع اختيار نوع الرابط وقيمته، وإثراء مصادر الروابط في `theme/components` لتشمل `pages/blog/offers`، وتوحيد resolver داخل المعاينة لحقول `variable-list` بما فيها الحقول الفرعية داخل `collection`).
  - اليوم 19: مكتمل (إضافة بحث فوري داخل خيارات `variable-list` في المحرر، على المستوى العلوي وداخل `collection`، مع عرض عدد النتائج والحفاظ على الخيار المحدد أثناء التصفية).
  - اليوم 20: مكتمل (ترقية اختيار `variable-list` إلى نافذة `Modal Picker` متقدمة ببحث وفرز ومعاينة الرابط قبل الاعتماد، مع دعم الحقول العلوية وحقول `collection` الفرعية).
  - اليوم 21: مكتمل (إضافة قواعد ظهور المكونات داخل `page_compositions` لكل عنصر: `enabled + viewport`، وربطها بمحرك المعاينة لتصفية مكونات الصفحة حسب الجهاز، مع دعم `viewport=mobile|desktop` في مسار `preview` وتحديث واجهة المعاينة بمبدّل جهاز).
  - اليوم 22: مكتمل (تفعيل شروط إظهار الحقول `conditions` داخل محرر مكونات الصفحات اعتمادًا على قيم الحقول الحية، بما في ذلك الحقول الفرعية داخل `collection`، لتطابق سلوك إعدادات الثيم الفعلية أثناء التحرير).
  - اليوم 23: مكتمل (إظهار الحقول `static` المشروطة داخل محرر المكونات، وإضافة سياسة حفظ واضحة للحقول المخفية: `preserve/clear` قبل حفظ خصائص العنصر).
  - اليوم 24: مكتمل (توحيد العرض البصري لحقول المنطق `boolean` في محرر المكونات (`switch/checkbox`) عبر مكوّن تحكم موحد مع نفس نمط التفاعل والحالة).
  - اليوم 25: مكتمل (توحيد العرض البصري لحقول الإدخال النصية في محرر المكونات `text/textarea/image/icon` عبر مكوّن موحد يدعم الوصف والمعاينة البصرية للصور ويُستخدم في الحقول العلوية وداخل `collection`).
  - اليوم 26: مكتمل (توحيد حقول الاختيار `dropdown/multi-select` وحقول الأرقام `number/integer` في محرر المكونات عبر عناصر تحكم موحدة مع رسائل نطاق فورية وتطبيقها على الحقول العلوية وداخل `collection`).
  - اليوم 27: مكتمل (توحيد حقول `variable-list` في محرر المكونات عبر عنصر تحكم موحد للحقول العلوية وحقول `collection` مع الحفاظ على `Modal Picker` والاختيار حسب المصدر والرابط الثابت/المخصص).
  - اليوم 28: مكتمل (بدء Slice محتوى بصري للمدونة: إضافة CRUD لمسارات `blog categories/articles` في API، توليد بيانات مدونة واقعية في `seed`، إضافة شاشات إدارة المدونة في الواجهة، وتوسيع اختبارات التكامل للتحقق من تغذية `variable-list` بخيارات `blog_articles/blog_categories` فعليًا).
  - اليوم 29: مكتمل (بدء Slice محتوى بصري للماركات/العروض: إضافة CRUD لمسارات `brands/offers` في API، توسيع `seed` لإنتاج عروض خاصة، إضافة شاشات إدارة `brands/offers` في الواجهة، وتوسيع اختبارات التكامل للتحقق من انعكاس تعديلات الماركات داخل خيارات مكونات الثيم).
  - اليوم 30: مكتمل (بدء Slice بصري لقوائم التنقل: استبدال mock القوائم ببيانات متجر فعلية `menu/header|footer`، إضافة `PUT /api/v1/menus/:type`، إضافة شاشة إدارة القوائم في الواجهة، وتوسيع اختبارات التكامل للتحقق من حفظ/قراءة القوائم بعناصر متداخلة).
  - اليوم 31: مكتمل (إغلاق Slice-06 لتكافؤ `reviews/questions`: إضافة CRUD كامل لمسارات `reviews/questions` مع مسارات المنتج المرتبطة، إضافة شاشتي إدارة `reviews/questions` في الواجهة، ربط الحساب التجميعي لتغذية المنتج (`rating/comments/questions_count`) بعد كل تعديل، وتوسيع `seed` واختبار التكامل للتحقق من التحديثات end-to-end).
  - اليوم 32: مكتمل (بدء Phase-4 للجاهزية التوسعية: إضافة `render scope` معزول لمفاتيح الكاش في `engine`، إضافة baseline metrics لمسار المعاينة مع headers، إضافة أداة قياس `perf:preview:baseline`، وإضافة اختبار تكامل لعزل المعاينة بين متجرين، ثم التحقق الشامل بنجاح `npm run validate`).
  - اليوم 33: مكتمل (إغلاق Phase-4: إضافة `GET /api/system/preview/metrics` لعرض baseline ونافذة metrics، إضافة اختبار حمل متزامن متعدد المتاجر/الصفحات للتحقق من العزل تحت الضغط، وتوثيق القرار المعماري ثم نجاح `npm run validate`).
  - اليوم 34: مكتمل (بدء Phase-5: إنشاء `VTDR_Documentation_Traceability_Map.md` وربط الوثائق الفعالة مباشرة بمراجع الكود والاختبارات وقواعد enforcement).
  - اليوم 35: مكتمل (إغلاق Phase-5: إضافة `docs:traceability` عبر `tools/doc-drift/traceability-guard.mjs` وربطه ضمن `validate`، وتوثيق القرار المعماري `ADR-022` ثم نجاح `npm run validate`).
  - اليوم 36: مكتمل (بدء تنفيذ Slice-07 فعليًا: توسيع حالات المخزون `low-stock/backorder` داخل `SimulatorService`، إضافة فرز/فلاتر merchandising (`featured` + stock sort)، تحديث شاشات `StoreProducts/EditProduct` لدعم حقول `track_quantity/allow_backorder/low_stock_threshold/is_featured/weight`، وتوسيع اختبار التكامل ثم نجاح `npm run validate`).

## موجة التنفيذ الحالية (الخمس نقاط)
- تاريخ التنفيذ: 2026-02-18.
- الحالة: مكتملة بالكامل مع تحقق أخير ناجح (`npm run validate`).

1. إغلاق فجوة cart على مستوى API/Engine:
   - تمت إضافة endpoints: `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PATCH /api/v1/cart/items/:itemId`, `DELETE /api/v1/cart/items/:itemId`.
   - التنفيذ: `apps/api/src/routes/simulator.routes.ts`, `packages/engine/src/providers/simulator.service.ts`.
2. إزالة hardcode من preview:
   - أصبحت المعاينة تعتمد `themeId/themeVersion` من المتجر بدل قيم ثابتة.
   - التنفيذ: `apps/ui/src/pages/StorePreview.tsx`.
3. إزالة hardcode من Page Components Editor:
   - تحميل المكونات من API store-scoped بدل مسار ملف ثابت.
   - تمت إضافة endpoint `GET /api/v1/theme/components`.
   - التنفيذ: `apps/ui/src/components/PageComponentsEditor.tsx`, `apps/api/src/routes/simulator.routes.ts`, `packages/engine/src/providers/simulator.service.ts`.
4. توسيع اختبارات التكامل:
   - إضافة تغطية lifecycle موسعة (promote/inherit/clone/seed/sync) + cart lifecycle + theme components.
   - التنفيذ: `apps/api/src/integration/api.integration.test.ts`.
5. تنظيف artifacts والوثائق التابعة لها:
   - تحديث `.gitignore` لمنع رجوع ملفات قواعد البيانات/المخرجات المولدة.
   - إزالة artifacts المتتبعة غير المرغوبة من الشجرة.
   - مزامنة docs snapshots (`docs:sync`) مع التحقق (`docs:drift`).
   - تحديث `Docs/README.md` وأرشفة الأصول غير النشطة في `archive/docs-assets-pruned-20260218-000241/`.

- الإجراء التالي: بدء دورة تحسينات المنتج التالية على مستوى السلوك (تحسينات المنتج والقدرات) فوق خط أساس عقود ووثائق مستقر.

## موجة التنفيذ التالية (Product-First / Store Parity)
1. اعتماد `Docs/Specifications/STORE_PARITY_BACKLOG.md` كمرجع أولوية للميزات.
2. تنفيذ Vertical Slices بدل تحسينات أفقية عامة.
3. الوضع الحالي: الشرائح `Slice-01` حتى `Slice-06` مغلقة ومحققة.
4. `Slice-07: Inventory + Merchandising Visual Parity` قيد التنفيذ النشط (Round-1 منفذ ومثبت بالاختبارات، مع بقاء إغلاق الشريحة الكامل).

## موجة إعادة الهيكلة (Architecture Restructure)
- تاريخ البدء: 2026-02-18.
- المرجع: `Docs/VTDR_Docs/VTDR_Restructure_Execution_Roadmap.md`.
- سجل القرارات: `Docs/VTDR_Docs/VTDR_Architecture_Decision_Log.md`.

### الحالة
1. `Phase-0: Contract Freeze + CI Guardrails` ✅ مغلقة.
2. `Phase-1: Runtime Navigation Unification` ✅ مغلقة.
3. `Phase-2: Theme Adapter Isolation` ✅ مغلقة.
4. `Phase-3: Domain Boundary Hardening` ✅ مغلقة.
5. `Phase-4: Scalability Readiness` ✅ مغلقة.
6. `Phase-5: Documentation Stabilization` ✅ مغلقة.

### ما أُغلق فعليًا في Phase-0
1. تثبيت العقد الرسمي: `Docs/VTDR_Docs/VTDR_Canonical_Runtime_Contract_v1.md`.
2. إضافة حارس حدود التشغيل: `tools/architecture/runtime-boundary-guard.mjs`.
3. إضافة سكربت الحارس: `npm run guard:runtime-boundaries`.
4. ربط الحارس ضمن `validate` في `package.json`.
5. إزالة hardcode fallback المرتبط بثيم محدد من `apps/api/src/routes/runtime.routes.ts`.
6. نجاح تحقق الإغلاق:
   - `npm run guard:runtime-boundaries` ✅
   - `npm run test:contract:theme-runtime` ✅

### بداية التنفيذ في Phase-1
1. توحيد اعتراض الروابط في المعاينة لدعم الروابط داخل Web Components.
2. ضبط `store.url` في سياق Twig ليبقى داخل preview base path.
3. استخراج منطق التنقل إلى وحدة موحدة `preview-navigation-shim` وربط `sdk-bridge` بها عبر `window.__VTDR_PREVIEW_NAV__`.
4. توسيع اختبار العقد لمسارات الملاحة (`cart/checkout/customer/*`) مع فحص أن روابط home تبقى ضمن `preview base`.
5. إضافة فحوصات Deep-Link عقدية للمسارات المفردة (`products/categories/brands/blog`) مع إعادة seed تلقائية إذا كانت بيانات المتجر فارغة.

### بداية التنفيذ في Phase-2
1. إدخال واجهة `IThemeRuntimeAdapter` داخل `engine` وفصل الوصول إلى `twilight.json` خلف adapter.
2. إضافة تنفيذ محلي `LocalThemeRuntimeAdapter` وربطه في `apps/api/src/index.ts`.
3. تحويل `SimulatorService` لاستخدام adapter في جلب `theme/settings/components`.
4. توحيد fallback الصور إلى placeholder محايد `/images/placeholder.png` وإضافة الأصل في `apps/api/public/images/placeholder.png`.
5. إزالة fallback hardcode لثيم محدد عند إنشاء متجر (`StoreFactory`) مع فشل صريح إذا لم توجد ثيمات مسجلة.
6. إضافة `PreviewThemeResolver` وربطه في `runtime.routes` لحسم ثيم/نسخة المعاينة من URL بدل الربط الضمني بثيم المتجر فقط.
7. إضافة فحص عقدي لحالة نسخة ثيم غير صالحة (`404`) وفحص cross-theme preview عند توفر أكثر من ثيم.
8. عزل تحميل `twilight` داخل `RendererService` عبر `ThemeRuntimeAdapter` بدل القراءة المباشرة (اعتماد إلزامي).
9. حذف مسار `ThemeFileProvider` legacy بعد اكتمال الانتقال للـadapter.
10. استخراج منطق `home components` إلى خدمة مستقلة `HomeComponentsResolver` مع اختبار وحدة مباشر.
11. تحقق إغلاق المرحلة بنجاح: `npm run test:contract:theme-runtime` ✅ و`npm run validate` ✅.

### بداية التنفيذ في Phase-3
1. نقل منطق `resolvePreviewTarget` من `apps/api/src/routes/runtime.routes.ts` إلى `packages/engine/src/rendering/preview-context-service.ts`.
2. نقل منطق `applyPreviewContext` إلى نفس الخدمة داخل `engine` لعزل التحويلات الدومينية عن طبقة routes.
3. تبسيط `runtime.routes` ليعمل كـ thin controller يستدعي خدمات `engine` بدل احتواء تطبيع الكيانات.
4. إضافة اختبار وحدة لـ `resolvePreviewTarget` في `packages/engine/src/rendering/preview-context-service.test.ts`.
5. نقل تحميل كيانات المعاينة (`cart/orders/checkout_session`) من `runtime.routes` إلى `packages/engine/src/rendering/preview-runtime-service.ts`.
6. نقل سياسة fallback عند فشل القوالب (home->index وfallback إلى `page-single`) إلى خدمة `engine` نفسها.
7. تحديث `runtime.routes` ليستهلك `hydratePreviewEntities` و`renderPreviewWithFallback` فقط.
8. إضافة اختبار وحدة مباشر للخدمة الجديدة في `packages/engine/src/rendering/preview-runtime-service.test.ts`.
9. نقل binding الخاص بسياق المعاينة (`themeId/themeVersion/viewport/template_id`) إلى `bindPreviewContext` داخل `engine`.
10. توسيع اختبار وحدة `preview-context-service` للتحقق من binding الجديد.
11. نقل `PreviewThemeResolver` من `apps/api` إلى `packages/engine` لتجميع قرار اختيار الثيم/النسخة في طبقة واحدة.
12. حذف ملف resolver من API بعد اكتمال النقل.
13. إضافة اختبار وحدة لـ `PreviewThemeResolver` داخل `engine`.
14. إضافة `PreviewRenderOrchestrator` داخل `engine` ليجمع مسار المعاينة end-to-end.
15. تبسيط `runtime.routes` ليستخدم orchestrator فقط في GET preview.
16. إضافة اختبار وحدة لـ `PreviewRenderOrchestrator`.
17. نقل parsing الخاص بالـwildcard (`*rest`) إلى `resolveWildcardPath` داخل `engine`.
18. نقل منطق `POST /render` إلى `PreviewRenderOrchestrator.buildStoreContext` وإزالة أي اعتماد مباشر على `engine` داخل route.
19. تعديل توقيع `createRuntimeRoutes` ليعتمد على `PreviewRenderOrchestrator` فقط.
20. إعادة هيكلة `simulator.routes` باستخدام wrappers موحدة للاستجابة (`route/routeOr404`) لتقليل منطق controller.
21. نقل منطق `auth/login` إلى `SimulatorAuthOrchestrator` داخل `engine`.
22. تحديث bootstrapping لتمرير `simulatorAuthOrchestrator` بدل تمرير `storeLogic/webhookService/hookService` مباشرة للroutes.
23. إضافة اختبار وحدة لـ `SimulatorAuthOrchestrator`.
24. إضافة `ThemeManagementOrchestrator` ونقل منطق `discover/register/sync` إليه مع تبسيط `theme.routes`.
25. إضافة `StoreManagementOrchestrator` ونقل منطق `promote/inherit/settings/seed/sync/clear/delete` إليه مع تبسيط `store.routes`.
26. تحديث bootstrap لحقن orchestrators الجديدة (`theme/store`) بدل تمرير خدمات متعددة مباشرة للroutes.
27. إضافة اختبارات وحدة لـ `theme-management-orchestrator` و`store-management-orchestrator`.
28. نجاح التحقق الكامل بعد النقل: `npm run validate` ✅.
29. بدء Phase-4 (Scalability Readiness):
    - عزل مفاتيح رندر Twig عبر `render-scope` يشمل `store/theme/version/template/viewport/views`.
    - نشر metrics زمنية للرندر (`context/hydrate/render/total`) وتوفير baseline `avg/p95`.
    - تفعيل cache Twig أصبح اختياريًا عبر `VTDR_TWIG_CACHE=1` حفاظًا على الاستقرار الافتراضي.
    - إضافة سكربت قياس: `npm run perf:preview:baseline`.
    - نجاح التحقق النهائي بعد التغييرات: `npm run validate` ✅.
30. إغلاق Phase-4:
    - إضافة endpoint تشغيلي لقراءة baseline/metrics: `GET /api/system/preview/metrics`.
    - إضافة اختبار تكامل ضغط متزامن متعدد المتاجر/الصفحات يثبت عدم تداخل preview base.
    - تحديث `API_SPEC` + snapshots (`docs:sync`) + نجاح `npm run validate` ✅.
31. بدء Phase-5 (Documentation Stabilization):
    - إنشاء خريطة traceability للوثائق الفعالة مع مراجع code/test صريحة.
    - تثبيت قواعد enforcement لتحديث docs/snapshots مع أي تغيير semantic.
32. إغلاق Phase-5:
    - إضافة حارس traceability: `tools/doc-drift/traceability-guard.mjs`.
    - إضافة script: `npm run docs:traceability`.
    - ربط `docs:traceability` داخل `npm run validate`.
    - تحديث سجل القرارات بـ `ADR-022`.
    - نجاح التحقق النهائي: `npm run validate` ✅.
