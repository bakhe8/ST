# VTDR Restructure Execution Roadmap

تاريخ الإنشاء: 2026-02-18  
النطاق: إعادة هيكلة تدريجية (Strangler) بدون إيقاف التطوير أو إعادة كتابة شاملة.

## 1) الهدف التنفيذي

تحويل VTDR إلى منصة قابلة للتوسع مع:

- Runtime Host موحد لأي ثيم.
- حدود واضحة بين `API` و`Engine` و`Theme Runtime`.
- اختبارات عقد إلزامية تمنع الانحراف مبكرًا.

## 2) المبادئ الحاكمة

1. لا إعادة كتابة كاملة (No Big-Bang Rewrite).
2. كل مرحلة تُغلق باختبارات عقد قبل الانتقال.
3. أي تغيير معماري يجب أن يكون محافظًا على السلوك الحالي (Backward Safe).
4. الكود والاختبارات هما مصدر الحقيقة، والوثائق تعكس ذلك.

## 3) المراحل (Phases)

### Phase-0: Contract Freeze + CI Guardrails

المدة: 1-2 يوم  
الحالة: ✅ مغلقة (2026-02-18)

المخرجات:

1. تثبيت العقد التشغيلي الرسمي: `Docs/VTDR_Docs/VTDR_Canonical_Runtime_Contract_v1.md`.
2. تأكيد بوابات CI:
   - `validate`
   - `Theme Runtime Contract Gate`
3. إضافة حارس حدود Runtime لمنع:
   - hardcode لثيم محدد داخل routes/UI preview.
   - ربط routes مباشرة بملفات الثيم.

معيار الإغلاق:

1. `npm run guard:runtime-boundaries` يمر بنجاح.
2. `npm run test:contract:theme-runtime` يمر بنجاح.
3. لا يوجد ربط `theme-raed-master` في طبقات التشغيل الحرجة.

دليل الإغلاق:

1. تنفيذ الحارس ونجاحه: `[RUNTIME-GUARD] Passed`.
2. تنفيذ عقد runtime ونجاحه: `1 passed`.
3. إزالة hardcode fallback في `apps/api/src/routes/runtime.routes.ts`.
4. توثيق القرار في `Docs/VTDR_Docs/VTDR_Architecture_Decision_Log.md`.

---

### Phase-1: Runtime Navigation Unification

المدة: 3-4 أيام  
الحالة: ✅ مغلقة (2026-02-18)

المخرجات:

1. توحيد طبقة التنقل داخل المعاينة (Anchor interception + preview path rewrite).
2. دعم الروابط داخل Web Components/Shadow DOM بشكل موحد.
3. تغطية المسارات الأساسية: `index/products/categories/brands/blog/cart/checkout/customer`.

معيار الإغلاق:

1. التصفح يبقى داخل `/preview/:storeId/:themeId/:version/...` بلا خروج مفاجئ.
2. اختبارات تنقل preview تمر على المسارات الأساسية.

تقدم التنفيذ الحالي:

1. إضافة فحص عقدي لوجود Navigation Shim داخل HTML المعاينة.
2. إضافة فحص عقدي لوجود `resolveAnchorFromEvent` داخل `sdk-bridge.js`.
3. استخراج منطق التنقل إلى وحدة موحدة:
   - `packages/engine/src/rendering/preview-navigation-shim.ts`
   - واستخدامها في `renderer-service`.
4. تفويض `sdk-bridge.js` لاستخدام API التنقل الموحد عبر `window.__VTDR_PREVIEW_NAV__`.
5. توسيع اختبار العقد لمسارات تنقل إضافية:
   - `cart / checkout / customer(profile|orders|wishlist|notifications|wallet)`.
6. إضافة فحص روابط الصفحة الرئيسية لضمان الارتباط بـ `preview base` وعدم الرجوع إلى `http://localhost:3001/`.
7. إضافة Deep-Link contract checks لمسارات العناصر المفردة:
   - `products/<slug|id>`, `categories/<slug|id>`, `brands/<slug|id>`, `blog/<slug|id>`.
   - مع fallback seed تلقائي إذا كانت البيانات فارغة.
8. تحقق نهائي بعد التحديثات:
   - `npm run validate` ✅
9. معيار الإغلاق تحقق فعليًا:
   - التصفح داخل preview base بقي مستقرًا لمسارات `index/products/categories/brands/blog/cart/checkout/customer/*`.
   - عقد التنقل + Deep-Links اجتاز بوابة `theme-runtime-contract`.

---

### Phase-2: Theme Adapter Isolation

المدة: 4-5 أيام  
الحالة: ✅ مغلقة (2026-02-18)

المخرجات:

1. واجهة `ThemeRuntimeAdapter` موحدة.
2. نقل أي mapping خاص بالثيم من routes إلى adapter/services.
3. جاهزية تشغيل أكثر من ثيم بدون تعديل ملفاته يدويًا.

معيار الإغلاق:

1. إضافة/تبديل ثيم لا يحتاج تعديل في منطق runtime الأساسي.

تقدم التنفيذ الحالي:

1. إضافة واجهة `IThemeRuntimeAdapter` في engine:
   - `packages/engine/src/infra/theme-runtime-adapter.interface.ts`.
2. إضافة تنفيذ محلي للـAdapter:
   - `apps/api/src/providers/local-theme-runtime-adapter.ts`.
3. نقل `SimulatorService` للاعتماد على الـAdapter بدل القراءة المباشرة لـ `twilight.json`.
4. فك ارتباط fallback الصور من ثيم محدد:
   - اعتماد placeholder محايد `/images/placeholder.png`.
5. إضافة أصل placeholder عام في API static:
   - `apps/api/public/images/placeholder.png`.
6. إزالة hardcode fallback في إنشاء المتجر:
   - الاعتماد على أول ثيم/نسخة مسجلة فعليًا أو فشل صريح برسالة تشغيلية.
7. تحقق نهائي بعد تحديثات المرحلة:
   - `npm run validate` ✅
8. عزل اختيار ثيم المعاينة عن route:
   - إضافة `PreviewThemeResolver` (استقر نهائيًا داخل `engine`):
     - `packages/engine/src/rendering/preview-theme-resolver.ts`
   - ربط `runtime.routes` لحسم الثيم/النسخة من بارامترات المعاينة (`:themeId/:version`) أو fallback لمتجر.
   - رفض النسخة/الثيم غير الصحيحين بـ `404` بدل fallback صامت.
9. توسيع عقد المعاينة:
   - فحص أن النسخة غير الصالحة ترجع `404`.
   - فحص cross-theme preview (عند توفر أكثر من ثيم) بدون إعادة ربط المتجر.
10. عزل تحميل schema داخل `RendererService`:

- استبدال القراءة المباشرة لـ `twilight.json` في مسار الرندر بتحميل إلزامي عبر `ThemeRuntimeAdapter`.

11. إزالة الطبقة legacy غير المستخدمة:

- حذف `LocalThemeFileProvider` وواجهة `IThemeFileProvider` بعد اكتمال اعتماد adapter.

12. استخراج منطق `home components` من `RendererService` إلى خدمة مستقلة:

- `packages/engine/src/rendering/home-components-resolver.ts`
- مع اختبار وحدة مباشر: `packages/engine/src/rendering/home-components-resolver.test.ts`

13. تحقق إغلاق المرحلة:

- `npm run test:contract:theme-runtime` ✅
- `npm run validate` ✅

---

### Phase-3: Domain Boundary Hardening

المدة: 5-6 أيام  
الحالة: ✅ مغلقة (2026-02-18)

المخرجات:

1. فصل أوضح بين `Simulation Data` و`Presentation Context`.
2. تقليص منطق التطبيع داخل routes وتحويله إلى services داخل engine.
3. توحيد عقود الكيانات الأساسية: products/categories/menus/blog.

معيار الإغلاق:

1. routes تصبح thin controllers فقط.
2. جميع التحويلات الدومينية في engine/services.

تقدم التنفيذ الحالي:

1. استخراج منطق تفسير المسار الدوميني للمعاينة `resolvePreviewTarget` من `runtime.routes` إلى:
   - `packages/engine/src/rendering/preview-context-service.ts`
2. استخراج منطق تطبيع سياق المعاينة `applyPreviewContext` إلى نفس الخدمة داخل `engine`.
3. تحويل `apps/api/src/routes/runtime.routes.ts` إلى طبقة توصيل أخف تعتمد خدمات `engine` بدل احتواء التطبيع الدوميني.
4. إضافة اختبار وحدة مباشر لمسارات التفسير:
   - `packages/engine/src/rendering/preview-context-service.test.ts`
5. استخراج تحميل كيانات المعاينة (`cart/orders/checkout_session`) من route إلى خدمة `engine`:
   - `packages/engine/src/rendering/preview-runtime-service.ts`
6. استخراج سياسة fallback للرندر (home->index + page-single fallback) إلى نفس خدمة `engine`.
7. إضافة اختبار وحدة مباشر لسلوك hydration/fallback:
   - `packages/engine/src/rendering/preview-runtime-service.test.ts`
8. استخراج ربط `themeId/themeVersion` + إعدادات `__preview_viewport` + ضمان `template_id` إلى دالة موحدة:
   - `bindPreviewContext` داخل `packages/engine/src/rendering/preview-context-service.ts`
9. تقليل إضافي لـ `runtime.routes` عبر تفويض binding/context decoration إلى `engine`.
10. توسيع اختبار الوحدة للتحقق من binding:

- `packages/engine/src/rendering/preview-context-service.test.ts`

11. نقل `PreviewThemeResolver` من API إلى `engine` لتوحيد قرار اختيار الثيم داخل الطبقة الدومينية:

- `packages/engine/src/rendering/preview-theme-resolver.ts`

12. حذف نسخة resolver من API بعد اكتمال النقل:

- `apps/api/src/services/preview-theme-resolver.ts` (removed)

13. إضافة اختبار وحدة مباشر لـ resolver:

- `packages/engine/src/rendering/preview-theme-resolver.test.ts`

14. إضافة `PreviewRenderOrchestrator` لتجميع تدفق المعاينة كاملًا (resolve+build+hydrate+bind+render):

- `packages/engine/src/rendering/preview-render-orchestrator.ts`

15. تبسيط `runtime.routes` ليعتمد على orchestrator بدل إدارة الخطوات داخليًا.
16. إضافة اختبار وحدة مباشر للـorchestrator:

- `packages/engine/src/rendering/preview-render-orchestrator.test.ts`

17. نقل parsing الخاص بـ `preview/*rest` إلى `engine` عبر:

- `resolveWildcardPath` في `preview-render-orchestrator.ts`

18. نقل منطق `POST /render` إلى orchestrator عبر `buildStoreContext`:

- إزالة نداء `engine.buildContext` المباشر من `runtime.routes`.

19. تحديث توقيع `createRuntimeRoutes` ليعتمد على `PreviewRenderOrchestrator` فقط.
20. إعادة هيكلة `simulator.routes` إلى thin-controller عبر wrappers موحّدة (`route/routeOr404`) لتقليل تكرار الاستجابة/الحالات.
21. نقل منطق `POST /auth/login` من route إلى orchestrator داخل `engine`:

- `packages/engine/src/providers/simulator-auth-orchestrator.ts`

22. تبسيط حقن تبعيات simulator routes:

- `createSimulatorRoutes(simulatorService, simulatorAuthOrchestrator)`

23. إضافة اختبارات وحدة للخدمة الجديدة:

- `packages/engine/src/providers/simulator-auth-orchestrator.test.ts`

24. نقل منطق إدارة الثيمات من route إلى orchestrator داخل `engine`:

- `ThemeManagementOrchestrator`
- وتحديث `theme.routes` لتصبح thin-controller.

25. نقل منطق إدارة المتاجر (promote/inherit/settings/seed/sync/clear/delete) إلى:

- `StoreManagementOrchestrator`
- وتحديث `store.routes` لتصبح thin-controller.

26. تحديث bootstrap لحقن orchestrators الجديدة في `index.ts`.
27. إضافة اختبارات وحدة لـ orchestrators الجديدة:

- `theme-management-orchestrator.test.ts`
- `store-management-orchestrator.test.ts`

28. تحقق نهائي بعد النقل:

- `npm run validate` ✅

29. معيار الإغلاق تحقق فعليًا:

- `runtime/store/theme/simulator routes` أصبحت thin-controllers.
- التحويلات الدومينية والقرارات التشغيلية نُقلت إلى orchestrators/services داخل `engine`.

---

### Phase-4: Scalability Readiness

المدة: 4-5 أيام  
الحالة: ✅ مغلقة (2026-02-19)

المخرجات:

1. تحسين عزل store/theme في caching keys وruntime context.
2. اختبار حمل تشغيلي خفيف لعدة متاجر وثيمات متزامنة.
3. baseline لأزمنة render.

معيار الإغلاق:

1. سلوك مستقر مع تعدد المتاجر والثيمات دون تداخل بيانات.

تقدم التنفيذ الحالي:

1. إضافة بناء مفتاح عزل رندر موحّد داخل `engine`:
   - `packages/engine/src/rendering/render-scope.ts`
   - scope يشمل `store/theme/version/template/views/viewport` ويُنتج `templateCacheId` حتمي.
2. ربط `RendererService` بمفتاح العزل:
   - استخدام `templateCacheId` بدل `Date.now()` في معرف Twig template.
   - حقن `__vtdr_render_scope` داخل سياق الرندر لأغراض التتبع.
3. اعتماد سياسة cache آمنة افتراضيًا:
   - cache Twig أصبح اختياريًا عبر `VTDR_TWIG_CACHE=1` بدل التفعيل الإجباري.
   - يحافظ على الاستقرار الحالي ويتيح تفعيل قياسات الأداء عند الحاجة.
4. إضافة baseline metrics لمسار المعاينة داخل `PreviewRenderOrchestrator`:
   - تسجيل `contextBuildMs / hydrateMs / renderMs / totalMs` لكل طلب.
   - إضافة `getRenderMetrics` و`getRenderBaseline` (avg/p95).
5. نشر metrics على استجابة المعاينة:
   - `X-VTDR-Render-Total-Ms`
   - `X-VTDR-Render-Context-Ms`
   - `X-VTDR-Render-P95-Ms`
6. إضافة أداة قياس تشغيلية:
   - `tools/perf/preview-baseline.mjs`
   - script: `npm run perf:preview:baseline`
   - لقياس latency client + server render baseline على متجر/ثيم/نسخة محددة.
7. إضافة اختبارات وحدة للمرحلة:
   - `packages/engine/src/rendering/render-scope.test.ts`
   - توسيع `preview-render-orchestrator.test.ts` للتحقق من metrics/baseline.
8. إضافة اختبار تكامل لعزل المعاينة بين متجرين والتحقق من رؤوس القياس:
   - `apps/api/src/integration/api.integration.test.ts`
   - السيناريو يتأكد أن preview HTML لكل متجر لا يتسرب لمسار متجر آخر وأن `x-vtdr-render-*` صالحة.
9. إضافة endpoint تشغيلي لقراءة baseline/metrics من API:
   - `GET /api/system/preview/metrics?limit=<n>`
   - المصدر: `PreviewRenderOrchestrator`.
10. إضافة اختبار تكامل حمل خفيف متزامن متعدد المتاجر/الصفحات:

- دفعات preview متوازية على متجرين وصفحات متعددة (`index/products/categories`) وأجهزة متعددة.
- تحقق صريح من عدم تسرّب `preview base` بين المتاجر أثناء الضغط.

11. تحقق بعد التنفيذ:

- `npm run validate` ✅

12. معيار الإغلاق تحقق فعليًا:

- عزل store/theme في مفاتيح الرندر مُطبق.
- baseline/metrics متاحة عبر headers وendpoint نظامي.
- اختبار حمل متزامن خفيف يمر دون تداخل بيانات.

---

### Phase-5: Code-First Documentation Stabilization

المدة: 2-3 أيام  
الحالة: ✅ مغلقة (2026-02-19)

المخرجات:

1. تحديث الوثائق التشغيلية الفعالة فقط.
2. أرشفة أي وثيقة غير متوافقة.
3. فرض `docs:drift` ضمن خط التحقق.

معيار الإغلاق:

1. كل وثيقة فعالة مرتبطة بمرجع كود/اختبار مباشر.

تقدم التنفيذ الحالي:

1. إنشاء خريطة traceability للوثائق الفعالة:
   - `Docs/VTDR_Docs/VTDR_Documentation_Traceability_Map.md`
   - تربط كل وثيقة فعالة بمراجع كود + اختبارات + حالة التفعيل.
2. توثيق قواعد enforcement المباشرة:
   - routes/schema snapshots عبر `docs:sync`
   - توثيق semantic changes في `API_SPEC`/`DATA_SCHEMA_SPEC`
   - إلزام المرور عبر `npm run validate`.
3. إضافة حارس تتبع إلزامي:
   - `tools/doc-drift/traceability-guard.mjs`
   - script: `npm run docs:traceability`
   - وربطه ضمن `npm run validate`.
4. تحقق الإغلاق:
   - `npm run docs:traceability` ✅
   - `npm run validate` ✅
5. معيار الإغلاق تحقق فعليًا:
   - كل وثيقة فعالة مرتبطة بمراجع كود/اختبار مباشرة ومحمية بحارس آلي داخل خط التحقق.

---

### Phase-6: Salla Runtime Parity Foundation (Theme-Agnostic)

المدة: 7-10 أيام  
الحالة: 🟡 قيد التنفيذ (2026-02-19)

الهدف:

1. تثبيت منطق تشغيل عام مطابق لعقود Salla/Twilight بدون ترقيع لكل صفحة أو ثيم.
2. تشغيل أي ثيم متوافق عبر Runtime Host نفسه دون تعديل يدوي على ملفات الثيم.
3. فصل "مشاكل البيانات/السياق" عن "ملفات الثيم" بحيث تصبح المعاينة مستقرة عبر جميع الصفحات.

المرجعية الرسمية المعتمدة:

1. Theme Master Layout (العقد العام للثيم): `https://docs.salla.dev/422558m0`
2. Theme Directory Structure: `https://docs.salla.dev/422650m0`
3. `twilight.json` Contract: `https://docs.salla.dev/422563m0`
4. SDK Basic Configuration: `https://docs.salla.dev/doc-422610#basic-configuration`
5. Web Components (Menus / Product Card / Product List):
   - `https://docs.salla.dev/422612m0`
   - `https://docs.salla.dev/422614m0`
   - `https://docs.salla.dev/422719m0`
6. Theme Build from Scratch: `https://docs.salla.dev/421877m0`

المخرجات المستهدفة:

1. **Runtime API Context Contract**:
   - كل طلب صادر من المعاينة إلى `/api/v1/*` يحمل سياق المتجر (`store_id` + headers) آليًا.
   - لا اعتماد على معالجات صفحة-صفحة.
2. **Canonical Storefront Context**:
   - بناء سياق ثابت (store/theme/user/page/translations) متوافق مع توقعات Twig.
   - منع تسرب مفاتيح ترجمة خام في الواجهة.
3. **Source-Driven Data Contract**:
   - توحيد تفسير `source/source-value` لعناصر web components.
   - عدم ربط المنطق بثيم واحد أو template واحد.
4. **Template Capability Boundary**:
   - احترام أن `page_compositions` الحالية تؤثر على `home.*` فقط حتى يتوفر دعم عام لكل صفحات الثيم.
   - إظهار هذا القيد بوضوح في الـUI كحد Runtime وليس خطأ صفحة.
5. **Parity Contract Tests**:
   - اختبارات عقد موحدة لصفحات: `index/products/categories/brands/blog`.
   - فحص: وجود البيانات، الترجمة، الروابط، وعدم كسر التنقل.

تقدم التنفيذ الحالي:

1. ✅ إضافة حقن سياق API عام داخل المعاينة (بدون ربط بصفحات محددة):
   - `packages/engine/src/rendering/preview-navigation-shim.ts`
   - يحقن `store_id` + `X-VTDR-Store-Id` لطلبات `fetch/XMLHttpRequest` إلى `/api/v1/*`.
2. ✅ تمرير `storeId` من `RendererService` إلى Navigation/API shim:
   - `packages/engine/src/rendering/renderer-service.ts`
3. ✅ إضافة fallback خلفي في `ContextResolver` من `Referer` لرابط preview لحماية التوافق أثناء الانتقال.
4. ✅ تثبيت Gate ضمان تفاعلي داخل عقد `theme-runtime`:
   - إلزام `store.api` بأن يكون `/api/v1` داخل HTML المعاينة.
   - إلزام وجود `__VTDR_API_CONTEXT_SHIM__` في الصفحات الأساسية.
   - منع hardcode لـ `http://localhost:3001/api/v1` داخل preview runtime.
   - فحص أن `/api/v1/products` يعمل بسياق `store_id` فقط (query-context parity).
5. ✅ تطبيق Seed Profiles معيارية مع auto-seed افتراضي:
   - إضافة profiles: `general / fashion / electronics` داخل `SeederService`.
   - إنشاء المتجر بدون `autoSeed` أصبح يُفعّل seed تلقائيًا افتراضيًا.
   - دعم تمرير `seedProfile` عند إنشاء المتجر وعند `POST /api/stores/:id/seed`.
   - حماية مسار clone من التلقيح التلقائي عبر `autoSeed: false`.
6. ✅ إضافة Browser E2E Parity Gate (Playwright):
   - ملف الإعداد: `apps/ui/playwright.config.ts`.
   - اختبار البوابة: `apps/ui/e2e/preview-parity.spec.ts`.
   - سكربت التنفيذ: `npm run test:e2e:preview`.
   - يغطي الصفحات الأساسية: `index/products/categories/brands/blog` مع رصد أخطاء runtime في المتصفح.
7. ✅ تثبيت عقد قدرات مكونات الثيم (Theme Components Capability Contract):
   - `Docs/VTDR_Docs/VTDR_Theme_Component_Capability_Contract_v1.md`
   - يحدد بوضوح:
     - أن تعريف المكونات يتم داخل `twilight.json` لكل ثيم (مرة واحدة).
     - أن لوحة VTDR لا تضيف مكونات يدويًا لكل ثيم.
     - مصفوفة `path prefixes` القياسية التي تتحكم في ظهور الصفحات داخل شاشة `مكونات الصفحات`.
8. ✅ تفعيل Capability Gate داخل `engine` وربطه بمخرجات إدارة الثيمات:
   - `discoverThemes` يعيد `componentCapability` لكل ثيم.
   - `registerTheme` يعيد `componentCapability` للثيم المسجل.
   - `syncThemes` يعيد `capabilityGate` مجمعًا لكل الثيمات مع `overallStatus`.
   - إضافة اختبارات وحدة لـ gate:
     - `packages/engine/src/validators/salla-validator.component-capability.test.ts`
9. ✅ ربط Capability Gate في Dashboard:
   - `apps/ui/src/pages/SystemHome.tsx`
   - إضافة زر `Sync Themes + Run Gate`.
   - عرض حالة كل ثيم (`PASS/WARNING/FAIL`) + تغطية الصفحات الأساسية + الصفحات الأساسية الناقصة.
   - ترتيب الثيمات تلقائيًا من الأضعف إلى الأقوى (`FAIL -> WARNING -> PASS`) مع ملخص عددي للحالات.
10. ✅ تثبيت Parity Matrix v1 من واقع الكود والاختبارات:

- `Docs/VTDR_Docs/VTDR_Parity_Matrix_v1.md`
- يربط كل نطاق parity بأدلة كود/اختبار مباشرة.
- يحدد فجوات `P0` التنفيذية بدون توسيع نطاق غير ضروري.

11. ✅ إغلاق `P0-01` (Theme Admission Observe Mode):

- تفعيل gate عند `PATCH /api/stores/:id` عبر `StoreManagementOrchestrator`.
- عدم رفض ربط الثيم عند `capability = fail/warning`، مع إرجاع تشخيصات `themeAdmission` بوضع `mode = observe`.
- الرفض يبقى فقط لأخطاء الربط الصلبة (متجر/ثيم/نسخة غير موجودة أو عقد Runtime غير صالح بنيويًا).
- إضافة اختبار API تكاملي يثبت السماح بالربط مع التشخيص:
  - `apps/api/src/integration/api.integration.test.ts` (سيناريو `allows binding a store to a failing theme and returns observe diagnostics`).

12. ✅ إغلاق `P0-02` (Store Context Contract Unification):

- إزالة `Context-Store-Id` من الواجهة وطبقة preview shim واعتماد `X-VTDR-Store-Id` كرأس Canonical.
- الإبقاء على fallback legacy داخل API resolver فقط لأغراض التوافق الخلفي.
- إضافة اختبار وحدة لسلوك resolver:
  - `apps/api/src/services/context-resolver.test.ts`.

13. ✅ إغلاق `P0-03` (Parity Assertions دلالية للصفحات الأساسية):

- توسيع عقد `theme-runtime` لتأكيد مؤشرات دلالية لكل صفحة أساسية:
  - `products/categories`: وجود `salla-products-list` + منع تسرب مفاتيح ترجمة خام.
  - `brands`: وجود `brands-nav/brand-item` مع التحقق من تمثيل بيانات API.
  - `blog`: وجود مؤشرات عرض فعلية (`post-entry/blog-slider`) + منع مفاتيح ترجمة خام.
- توحيد رسائل الفشل بصيغة `[theme][page]` لتحديد السبب بسرعة في CI.
- ترقية بوابة المتصفح `preview-parity` بنفس المنهج الدلالي على المسارات الأساسية.
- تحقق الإغلاق:
  - `npm run test:contract:theme-runtime` ✅
  - `npm run test:e2e:preview` ✅

14. ✅ إغلاق `P0-04` (Theme Matrix Gate - Observe):

- إضافة مصفوفة fixtures تشغيلية داخل اختبار التكامل:
  - `pass`: ثيم يغطي الصفحات الأساسية (`home/product/category/blog/brands`).
  - `warning`: ثيم ناقص تغطية الصفحات الأساسية.
  - `fail`: ثيم schema غير صالح (`components` غير مصفوفة).
- فرض سلوك تشخيصي تعاقدي عند ربط الثيم بالمتجر:
  - `pass/warning/fail` جميعها تسمح بالربط.
  - الحالة `fail` تُعاد كتشخيص صريح داخل `themeAdmission` بدل حجب الربط.
- تحقق الإغلاق:
  - `npm run test --workspace=@vtdr/api -- --run src/integration/api.integration.test.ts --testNamePattern "(allows binding a store to a failing theme and returns observe diagnostics|keeps theme matrix gate observable)"` ✅

15. ✅ إغلاق `P0-05` (Parity Baseline Gate):

- إضافة تصدير metrics من عقد runtime:
  - `apps/api/src/integration/theme-runtime-contract.integration.test.ts`
  - env: `VTDR_PARITY_CONTRACT_METRICS_FILE`
- إضافة تصدير metrics من E2E المتصفح:
  - `apps/ui/e2e/preview-parity.spec.ts`
  - env: `VTDR_PARITY_BROWSER_METRICS_FILE`
- إنشاء gate موحد:
  - `tools/perf/parity-baseline-gate.mjs`
  - script: `npm run parity:baseline:gate`
- ربطه ضمن خط التحقق:
  - `package.json` -> `validate` يتضمن `parity:baseline:gate`
- artifacts تشغيلية فعلية:
  - `Docs/VTDR/PARITY-BASELINE.latest.json`
  - `Docs/VTDR/PARITY-BASELINE.20260219-211923.json`
- تحقق الإغلاق:
  - `npm run parity:baseline:gate` ✅

16. 🟡 بدء تنفيذ `P0-06` (Theme Anchor Runtime Probe Gate):

- إضافة `ThemeAnchorProbeReport` داخل `SallaValidator` لفحص:
  - التغطية الفعلية لنقاط العرض لكل صفحة.
  - العناصر المعرّفة في `twilight.json` غير القابلة للرندر بسبب غياب anchor مناسب.
  - `orphan anchors` الموجودة في Twig بدون عناصر مقابلة في العقد.
- ربط نتائج الـprobe داخل:
  - `ThemeManagementOrchestrator.discoverThemes/registerTheme/syncThemes`.
- إدراج الحالة المجمعة (`overallStatus`) لكل ثيم من:
  - `componentCapability` + `anchorProbe`.
- توسيع Dashboard (`SystemHome`) لعرض:
  - `Anchor probe: rendered/declared`
  - `Missing anchors` لكل ثيم.
- إضافة اختبارات:
  - `salla-validator.anchor-probe.test.ts`
  - تحديث `theme-management-orchestrator.test.ts`.
- تحقق مرحلي:
  - `npm --workspace @vtdr/engine run test` ✅
  - `npm --workspace @vtdr/api run test -- --run src/integration/theme-runtime-contract.integration.test.ts src/integration/api.integration.test.ts` ✅
- المتبقي لإغلاق `P0-06`:
  - إضافة Runtime Probe HTML marker checks داخل عقد المعاينة (بخلاف الفحص البنيوي الحالي).
  - ربط Theme Admission Gate بعرض تشخيص صريح عند `anchorProbe.overallStatus = fail` للصفحات الأساسية (بدون رفض الربط).
  - إضافة اختبارات تكامل تؤكد إرجاع التشخيصات حسب `missing_anchor_points` الحرجة.

معيار الإغلاق:

1. أي ثيم متوافق مع عقود Salla الأساسية يعمل دون تعديلات خاصة داخل VTDR.
2. صفحات `products/blog` لا تعتمد على ترقيعات موضعية لكل template.
3. جميع نداءات SDK/Components الرئيسية تعمل ضمن سياق متجر صحيح تلقائيًا.
4. اختبار عقد parity يمر على الصفحات الأساسية لمتجرين مختلفين على الأقل.

---

### Phase-7: Full Surface Parity Program (Storefront + Dashboard + Theme Lifecycle)

المدة: 3-6 أسابيع  
الحالة: 🟡 مخطط (2026-02-20)

الهدف:

1. توسيع parity من طبقة runtime الأساسية إلى جميع الأسطح التشغيلية.
2. تغطية دورة حياة الثيم كاملة داخل لوحة التحكم (create/develop/setup/publish/review/changelog).
3. ضمان أن قائمة الصفحات/المكونات تعمل عبر أي ثيم متوافق دون ترقيع يدوي.

المرجع التنفيذي:

1. `Docs/VTDR_Docs/VTDR_Salla_Full_Surface_Parity_Backlog.md`

مخرجات المرحلة:

1. S-08 Theme Lifecycle Workspace.
2. S-09 Theme Review Pipeline.
3. S-10 Full Storefront Page Coverage.
4. S-11 Global Variables/Hooks/Localization Parity.
5. S-12/S-13 Components Library Parity.
6. S-14 Multi-Theme CI Matrix.

معيار الإغلاق:

1. تحويل البنود المستهدفة في `VTDR_Salla_Full_Surface_Parity_Backlog.md` من `GAP/PARTIAL` إلى `PASS`.
2. توفّر تقارير parity قابلة للتتبع لكل ثيم/إصدار.
3. نجاح `validate + contract + e2e parity` بدون استثناءات يدوية.
4. نجاح `contracts:coverage:guard` (منع نسيان أي عقد ضمن فهرس سلة المعتمد).

تقدم التنفيذ الحالي:

1. ✅ بدء `S-10` (Full Storefront Page Coverage) بإغلاق أول شريحة تحقق:
   - توسيع `theme-runtime-contract` ليفحص صفحات إضافية دلاليًا:
     - `cart/checkout/loyalty/thank-you/landing-page/customer(profile|orders|wishlist|notifications|wallet)`.
   - إضافة تحقق marker موحد لكل مسار عبر `window.vtdr_context.templatePageId`.
   - إضافة تحقق semantic marker لكل صفحة إضافية (مثل `salla-wallet`, `salla-notifications`, `vtdr-checkout.js`).
2. ✅ توسيع Browser parity gate لنفس مجموعة المسارات الإضافية بنفس منهج الفحص الدلالي.
3. ✅ تحقق الإغلاق المرحلي:
   - `npm --workspace @vtdr/api run test -- --run src/integration/theme-runtime-contract.integration.test.ts`
   - `npm run test:e2e:preview`
4. ✅ رفع جودة backfill/runtime data للسطح الموسّع (S-10.2):
   - توسيع `SeederService.ensureMinimumCoreData` لتغطية:
     - `loyalty`, `landing`, `wishlist`, `order`, `checkout_session`.
   - إصلاح تماسك backfill للمنتجات/مقالات المدونة (تحديث المصفوفات أثناء التوليد لمنع حالات الفراغ).
   - توسيع seeding الأساسي عند إنشاء المتجر ليولد نفس الكيانات السابقة افتراضيًا.
   - تحديث عقد `RuntimeContext` لإدراج `landing` رسميًا بدل حقن غير مُعرّف.
   - التحقق:
     - `npm --workspace @vtdr/contracts run build`
     - `npm --workspace @vtdr/engine run lint`
     - `npm --workspace @vtdr/engine run test -- --run src/rendering/preview-context-service.test.ts`
5. ✅ خطوة تمهيدية من S-11 (Translation Leakage Control):
   - إضافة fallback ترجمة داخل `RendererService` يمنع ظهور مفاتيح خام عندما لا توجد قيمة ترجمة.
   - تطبيق fallback على `trans` filter/function و`pluralize` و`salla.trans`.
   - التحقق:
     - `npm --workspace @vtdr/engine run lint`
     - `npm --workspace @vtdr/engine run test -- --run src/rendering/preview-context-service.test.ts src/rendering/preview-runtime-service.test.ts src/rendering/preview-render-orchestrator.test.ts`
6. ✅ بدء إغلاق S-12 Home Components GAPs (دفعة أولى):
   - إضافة normalization contracts في `HomeComponentsResolver` لعناصر:
     - `home.youtube`: استخراج `youtube_id` من الروابط.
     - `home.parallax-background`: توحيد `image` إلى `{ url }`.
     - `home.enhanced-slider`: توحيد `slides` وصور الشرائح.
   - إضافة اختبارات تغطية:
     - `packages/engine/src/rendering/home-components-resolver.test.ts`
   - تحديث سجل التغطية:
     - `component.home.youtube` من `GAP` إلى `PARTIAL`
     - `component.home.parallax-background` من `GAP` إلى `PARTIAL`
     - `component.home.enhanced-slider` من `GAP` إلى `PARTIAL`
7. ✅ متابعة إغلاق S-12 Home Components GAPs (دفعة ثانية):
   - إضافة normalization contracts لعناصر:
     - `home.featured-products-style1`
     - `home.featured-products-style2`
     - `home.featured-products-style3`
     - `home.enhanced-square-banners`
     - `home.slider-products-with-header`
   - توسيع الاختبارات التعاقدية في:
     - `packages/engine/src/rendering/home-components-resolver.test.ts`
   - تحديث سجل التغطية:
     - `component.home.featured-products-style-1` من `GAP` إلى `PARTIAL`
     - `component.home.featured-products-style-2` من `GAP` إلى `PARTIAL`
     - `component.home.featured-products-style-3` من `GAP` إلى `PARTIAL`
     - `component.home.enhanced-square-banners` من `GAP` إلى `PARTIAL`
     - `component.home.slider-products-with-headers` من `GAP` إلى `PARTIAL`

## 4) التنفيذ الحالي (Start Log)

تم إغلاق Phase-0 عبر:

1. إزالة hardcode مباشر لمسار placeholder المعتمد على ثيم محدد من `runtime.routes.ts`.
2. إضافة أداة حراسة: `tools/architecture/runtime-boundary-guard.mjs`.
3. إضافة سكربت: `npm run guard:runtime-boundaries`.
4. إدراج الحارس ضمن `npm run validate`.
5. تثبيت القرار المعماري في `VTDR_Architecture_Decision_Log.md`.

تم البدء بـ Phase-1 عبر:

1. توحيد اعتراض الروابط داخل runtime وsdk bridge لدعم `composedPath` (روابط Web Components/Shadow DOM).
2. ضبط `store.url` داخل سياق Twig ليشير إلى `preview base path` بدل root host.

تم البدء بـ Phase-2 عبر:

1. تثبيت `ThemeRuntimeAdapter` كحد فصل بين منطق التشغيل وملفات الثيم.
2. نقل تحميل settings/components للـtheme عبر adapter داخل `SimulatorService`.
3. اعتماد placeholder محايد مستقل عن أي ثيم.

## 5) أوامر التشغيل السريعة

```bash
npm run guard:runtime-boundaries
npm run test:contract:theme-runtime
npm run test:e2e:preview
npm run contracts:coverage:guard
npm run validate
```

## 6) شروط الانتقال للمرحلة التالية

لا يتم الانتقال إلى `Phase-1` إلا بعد اكتمال معايير إغلاق `Phase-0`.
