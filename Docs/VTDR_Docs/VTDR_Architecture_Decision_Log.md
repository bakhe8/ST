# VTDR Architecture Decision Log

تاريخ البدء: 2026-02-18  
النطاق: قرارات معمارية تنفيذية مرتبطة مباشرة بخطة إعادة الهيكلة.

## ADR-001 — اعتماد إعادة هيكلة تدريجية (Strangler) بدل إعادة كتابة شاملة

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - النظام يعمل فعليًا وفيه تراكم تغييرات حية.
  - إعادة كتابة شاملة سترفع خطر التراجع الوظيفي وتبطئ الوصول لهدف parity.
- القرار:
  - تنفيذ الهيكلة على مراحل (`Phase-0` → `Phase-5`) مع الحفاظ على سلوك التشغيل الحالي.
- الأثر:
  - تقليل مخاطر الانكسار.
  - الحفاظ على زخم تطوير الميزات بالتوازي.

## ADR-002 — Canonical Runtime Contract v1 هو العقد التشغيلي الملزم

- التاريخ: 2026-02-18
- الحالة: Accepted
- القرار:
  - اعتماد `Docs/VTDR_Docs/VTDR_Canonical_Runtime_Contract_v1.md` كمرجع عقدي موحد لمسارات التشغيل (preview + simulator + sdk bridge).
- الإلزام:
  - `npm run test:contract:theme-runtime` بوابة رسمية.
- الأثر:
  - توحيد مرجع الحقيقة التشغيلي ومنع التفسيرات المتضاربة.

## ADR-003 — فرض حارس حدود Runtime داخل خط التحقق

- التاريخ: 2026-02-18
- الحالة: Accepted
- القرار:
  - إضافة `tools/architecture/runtime-boundary-guard.mjs` وربطه ضمن `npm run validate`.
- قواعد الحارس الحالية:
  - منع hardcode لثيم محدد داخل routes/UI preview.
  - منع coupling مباشر بين routes وملفات الثيم.
- الأثر:
  - كشف الانحراف المعماري مبكرًا قبل تضخم الكود.

## ADR-004 — عدم ربط fallback assets بثيم محدد

- التاريخ: 2026-02-18
- الحالة: Accepted
- القرار:
  - إزالة fallback image المرتبط بـ `theme-raed-master` من runtime route واستبداله placeholder مستقل.
- الأثر:
  - تقليل coupling مع ثيم بعينه.
  - تحسين قابلية تشغيل ثيمات أخرى.

## ADR-005 — اختبار التكامل يشغّل API عبر tsx وليس dist node

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - تشغيل `node apps/api/dist/index.js` في بيئة الاختبار قد يفشل بسبب imports workspace source entrypoints.
- القرار:
  - تشغيل API في اختبارات التكامل عبر:
    - `npm exec tsx apps/api/src/index.ts`
- الأثر:
  - استقرار بوابات CI الخاصة بالعقود والتكامل.

## ADR-006 — الانتقال إلى Phase-1 مشروط بإغلاق فعلي لـ Phase-0

- التاريخ: 2026-02-18
- الحالة: Accepted
- القرار:
  - لا يبدأ `Phase-1` قبل تحقق الشروط التالية:
    1. نجاح `npm run guard:runtime-boundaries`.
    2. نجاح `npm run test:contract:theme-runtime`.
    3. وجود توثيق قرار معماري محدث.
- الأثر:
  - منع التقدم فوق أساس غير مستقر.

## ADR-007 — اعتماد ThemeRuntimeAdapter كحد فصل رسمي لعقود الثيم

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - منطق `SimulatorService` كان يعتمد مباشرة على قراءة `twilight.json` عبر provider منخفض المستوى.
  - fallback الصور كان مقيدًا بمسار ثيم محدد.
- القرار:
  - إدخال واجهة `IThemeRuntimeAdapter` داخل `engine` كعقد موحد لقراءة schema/settings/components.
  - تنفيذ `LocalThemeRuntimeAdapter` في API وربطه داخل bootstrap.
  - اعتماد placeholder محايد `/images/placeholder.png` بدل أي fallback مرتبط بثيم بعينه.
- الأثر:
  - تقليل coupling المباشر مع بنية ثيم محدد.
  - تجهيز أفضل لتبديل/زيادة الثيمات دون تعديل منطق التشغيل الأساسي.

## ADR-008 — حسم ثيم المعاينة عبر PreviewThemeResolver بدل منطق route المباشر

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - مسار المعاينة يحمل `:themeId/:version` لكن route كان يعيد الرندر بحسب ثيم المتجر فقط.
  - هذا يعيق اختبار/تشغيل أكثر من ثيم على نفس المتجر.
- القرار:
  - إدخال `PreviewThemeResolver` كخدمة مستقلة.
  - `runtime.routes` يفوض لها اختيار الثيم/النسخة والتحقق من الصحة.
  - أي ثيم/نسخة غير صالحين يرجعان `404` صريحًا.
- الأثر:
  - فصل قرار الثيم عن route.
  - دعم معاينة ثيمات متعددة لنفس المتجر بدون تعديل بيانات المتجر أو الثيم.

## ADR-009 — RendererService يستهلك schema عبر ThemeRuntimeAdapter

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - `RendererService` كان يقرأ `twilight.json` مباشرة أثناء بناء مكونات الصفحة الرئيسية.
  - هذا يعيد coupling طبقة الرندر ببنية ملفات الثيم.
- القرار:
  - إضافة دالة تحميل schema داخل `RendererService` تعتمد `ThemeRuntimeAdapter` إلزاميًا.
- الأثر:
  - توحيد مسار الوصول لعقد الثيم عبر adapter.
  - تقليل الاعتماد المباشر على الملفات داخل طبقة الرندر.

## ADR-010 — إزالة ThemeFileProvider legacy بعد اكتمال الانتقال

- التاريخ: 2026-02-18
- الحالة: Accepted
- القرار:
  - حذف `LocalThemeFileProvider` و`IThemeFileProvider` لعدم وجود مستهلكين بعد إدخال adapter.
- الأثر:
  - تقليل الازدواجية المعمارية.
  - منع العودة لمسار legacy في التطويرات القادمة.

## ADR-011 — فصل Home Components Resolver عن RendererService

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - منطق تجهيز مكونات الصفحة الرئيسية كان متضخمًا داخل `RendererService`.
- القرار:
  - نقل منطق بناء/تطبيع `home components` إلى خدمة مستقلة:
    - `HomeComponentsResolver`.
  - إبقاء `RendererService` كمنسق render فقط.
- الأثر:
  - تقليل تعقيد `RendererService`.
  - تسهيل اختبار المنطق الدوميني الخاص بالمكونات بمعزل عن Twig/rendering pipeline.

## ADR-012 — نقل Preview Context Domain Logic من API Routes إلى Engine

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - `runtime.routes.ts` كان يحتوي منطقًا دومينيًا متضخمًا لتفسير المسارات وتطبيع سياق المعاينة.
  - هذا يضعف حدود الطبقات ويزيد coupling بين API routing وbusiness logic.
- القرار:
  - استخراج:
    - `resolvePreviewTarget`
    - `applyPreviewContext`
  - إلى خدمة مستقلة داخل `engine`:
    - `packages/engine/src/rendering/preview-context-service.ts`
  - إبقاء `runtime.routes.ts` كطبقة توصيل فقط.
- الأثر:
  - تحسين حدود المسؤوليات بين API وEngine.
  - تقليل تعقيد routes.
  - تسهيل اختبار منطق التفسير الدوميني بمعزل عن Express.

## ADR-013 — تجميع Hydration/Fallback للمعاينة داخل Engine

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - `runtime.routes.ts` كان لا يزال يحتوي تفاصيل تشغيلية (hydration لكيانات cart/orders/checkout وسياسة fallback عند فشل القوالب).
  - هذا يبقي route-controller أثقل من المطلوب في Phase-3.
- القرار:
  - استخراج هذه المسؤوليات إلى خدمة engine:
    - `hydratePreviewEntities`
    - `renderPreviewWithFallback`
  - ضمن:
    - `packages/engine/src/rendering/preview-runtime-service.ts`
- الأثر:
  - `runtime.routes` أصبح أقرب إلى thin controller.
  - تقليل coupling بين Express pipeline وسياسات الرندر.
  - تسهيل اختبار fallback/hydration كوحدات مستقلة.

## ADR-014 — توحيد Preview Context Binding داخل Engine

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - بعد استخراج التفسير والتطبيع، بقي route يحقن `themeId/themeVersion` و`__preview_viewport` و`template_id`.
  - هذا منطق دوميني/عرضي يجب أن يبقى ضمن طبقة engine.
- القرار:
  - إضافة `bindPreviewContext` داخل:
    - `packages/engine/src/rendering/preview-context-service.ts`
  - وتفويض route بالكامل لهذا الربط.
- الأثر:
  - إزالة خطوة binding من طبقة Express.
  - توحيد قواعد تجهيز السياق في نقطة واحدة قابلة للاختبار.

## ADR-015 — نقل PreviewThemeResolver إلى Engine وإزالة نسخة API

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - `PreviewThemeResolver` كان معرفًا داخل API رغم أنه منطق دوميني لا يعتمد على Express.
  - هذا يشتت قواعد اختيار الثيم بين الطبقات.
- القرار:
  - نقل resolver إلى:
    - `packages/engine/src/rendering/preview-theme-resolver.ts`
  - وتصديره عبر `packages/engine/index.ts`.
  - حذف النسخة السابقة من API.
- الأثر:
  - توحيد منطق اختيار الثيم ضمن engine.
  - تقليل مسؤولية API layer إلى routing/wiring فقط.

## ADR-016 — اعتماد PreviewRenderOrchestrator كمسار preview الموحد

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - رغم نقل معظم المنطق إلى engine، بقي التسلسل التشغيلي موزعًا داخل route.
- القرار:
  - إضافة `PreviewRenderOrchestrator` داخل engine لتجميع:
    - target resolution
    - wildcard path normalization
    - theme resolution
    - context build
    - preview entity hydration
    - preview binding
    - render fallback
  - وجعل `runtime.routes` يكتفي باستدعاء orchestrator.
- الأثر:
  - تقليل تعقيد route بشكل إضافي.
  - توحيد pipeline المعاينة في نقطة قابلة للاختبار.
  - رفع وضوح الحدود بين API وEngine.

## ADR-017 — توسيع PreviewRenderOrchestrator ليغطي Runtime Context Endpoint

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - مسار `POST /render` كان لا يزال يستدعي `engine.buildContext` مباشرة داخل route.
- القرار:
  - إضافة `buildStoreContext` داخل `PreviewRenderOrchestrator`.
  - تعديل `runtime.routes` ليعتمد على orchestrator فقط في مساري:
    - `GET /preview/*`
    - `POST /render`
- الأثر:
  - إزالة آخر اعتماد مباشر لـ route على `CompositionEngine`.
  - توحيد منطق سياق runtime ضمن engine orchestration.

## ADR-018 — Thin Simulator Routes + Auth Orchestrator

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - `simulator.routes` كان يحتوي تكرارًا عاليًا في نمط الاستجابة وحالات not-found.
  - منطق `auth/login` (تجهيز customer + dispatch webhook) كان داخل route.
- القرار:
  - اعتماد wrappers موحدة داخل route layer:
    - `route`
    - `routeOr404`
  - نقل منطق `auth/login` إلى خدمة `engine`:
    - `SimulatorAuthOrchestrator`
  - تقليل تبعيات route factory لتصبح:
    - `createSimulatorRoutes(simulatorService, simulatorAuthOrchestrator)`
- الأثر:
  - تقليل حجم وتعقيد `simulator.routes`.
  - نقل منطق سلوكي من controller إلى engine layer.
  - تحسين قابلية الاختبار لعقد login/webhook بمعزل عن Express.

## ADR-019 — توحيد إدارة Store/Theme عبر Orchestrators في Engine

- التاريخ: 2026-02-18
- الحالة: Accepted
- السياق:
  - بقيت `store.routes` و`theme.routes` تحمل منطق تشغيل وتحكم أكثر من المطلوب لطبقة routing.
- القرار:
  - إدخال:
    - `StoreManagementOrchestrator`
    - `ThemeManagementOrchestrator`
  - ونقل منطق الإدارة الرئيسية من routes إلى هاتين الخدمتين.
  - إبقاء routes كطبقة توصيل واستجابة فقط.
- الأثر:
  - تقليل coupling بين Express وbusiness logic.
  - توحيد نقاط القرار التشغيلي داخل engine.
  - رفع قابلية الاختبار والصيانة في توسعات المراحل القادمة.

## ADR-020 — Render Scope Isolation + Preview Baseline Metrics

- التاريخ: 2026-02-19
- الحالة: Accepted
- السياق:
  - المرحلة الرابعة تتطلب جاهزية توسع مع منع أي تداخل محتمل بين متاجر/ثيمات متعددة على مسار المعاينة.
  - مطلوب baseline زمني واضح للرندر قبل الدخول في تحسينات أداء أعمق.
- القرار:
  - إضافة `render scope` موحّد داخل engine لتكوين `templateCacheId` حتمي يعتمد على:
    - `storeId`
    - `themeId`
    - `themeVersion`
    - `template`
    - `views signature/path`
    - `viewport`
  - حقن `__vtdr_render_scope` داخل render context للتتبع.
  - إبقاء Twig cache معطلًا افتراضيًا وتفعيله اختياريًا فقط عبر `VTDR_TWIG_CACHE=1` للحفاظ على الاستقرار.
  - إضافة قياسات baseline داخل `PreviewRenderOrchestrator`:
    - `contextBuildMs`
    - `hydrateMs`
    - `renderMs`
    - `totalMs`
  - نشر baseline مختصر في headers لمسار preview.
- الأثر:
  - تحسين عزل سياق الرندر تمهيدًا للتوسع متعدد المتاجر/الثيمات.
  - توفير قياس تشغيلي فوري (avg/p95) دون كسر العقد الحالي.
  - تمكين تفعيل cache لاحقًا بشكل متحكم فيه عبر متغير بيئة بدل تغيير سلوك افتراضي مفاجئ.

## ADR-021 — نشر Preview Metrics عبر System API Endpoint

- التاريخ: 2026-02-19
- الحالة: Accepted
- السياق:
  - قياسات الرندر أصبحت متاحة داخل `PreviewRenderOrchestrator` فقط.
  - فريق التشغيل يحتاج قراءة baseline/metrics بدون تتبع كل استجابة preview يدويًا.
- القرار:
  - إضافة endpoint:
    - `GET /api/system/preview/metrics?limit=<n>`
  - endpoint يعيد:
    - baseline (`samples/avg/p95`)
    - نافذة metrics حديثة (`storeId/themeId/pageId/viewport/timings`)
  - إبقاء endpoint قراءة فقط ودون تعديل سلوك المعاينة.
- الأثر:
  - زيادة observability لمسار preview.
  - تسهيل المقارنة قبل/بعد أي تحسين أداء.
  - دعم أفضل لمراقبة العزل تحت الضغط المتزامن.

## ADR-022 — فرض Traceability Gate للوثائق الفعالة

- التاريخ: 2026-02-19
- الحالة: Accepted
- السياق:
  - بعد توسع وثائق `Docs/VTDR_Docs` أصبح خطر رجوع وثائق غير مرتبطة بالكود/الاختبارات أعلى.
  - `docs:drift` يغطي snapshots (routes/schema) لكنه لا يتحقق من ربط كل وثيقة فعالة بمراجع تشغيلية مباشرة.
- القرار:
  - إضافة حارس:
    - `tools/doc-drift/traceability-guard.mjs`
  - اعتماد خريطة مرجعية إلزامية:
    - `Docs/VTDR_Docs/VTDR_Documentation_Traceability_Map.md`
  - ربط الحارس ضمن خط التحقق عبر:
    - `npm run docs:traceability`
    - ودمجه داخل `npm run validate`.
- الأثر:
  - منع بقاء أي وثيقة فعالة بلا مراجع كود/اختبارات صريحة.
  - تثبيت Phase-5 كمرحلة قابلة للقياس والإغلاق الفعلي.
  - تقليل خطر الانحراف الوثائقي مع استمرار التطوير السريع.
