# VTDR Parity Matrix v1

تاريخ الإصدار: 2026-02-19  
النطاق: قياس فجوة المطابقة التشغيلية بين VTDR وسلوك تشغيل ثيمات سلة (Theme-Agnostic Runtime).

## 1) مرجعية القياس

المصفوفة مبنية على الكود والاختبارات الفعلية فقط:
1. `Docs/VTDR/API-ROUTES.snapshot.json`
2. `Docs/VTDR_Docs/VTDR_Canonical_Runtime_Contract_v1.md`
3. `apps/api/src/integration/theme-runtime-contract.integration.test.ts`
4. `apps/api/src/integration/api.integration.test.ts`
5. `apps/ui/e2e/preview-parity.spec.ts`
6. `packages/engine/src/rendering/preview-navigation-shim.ts`
7. `packages/engine/src/validators/salla-validator.ts`
8. `packages/engine/src/providers/simulator.service.ts`

## 2) مقياس الحالة

1. `PASS`: مدعوم بعقد + اختبار فعلي.
2. `PARTIAL`: مدعوم جزئيًا أو بدون تغطية تعاقدية كافية.
3. `GAP`: فجوة تمنع المطابقة العامة (Theme-Agnostic) ويجب إغلاقها.

## 3) مصفوفة المطابقة التشغيلية (As-Is)

| النطاق | العنصر التعاقدي | الحالة | أدلة التنفيذ | أدلة الاختبار |
|---|---|---|---|---|
| Runtime Host | Preview routes موحدة لكل ثيم ومتجر | PASS | `apps/api/src/routes/runtime.routes.ts:75`, `apps/api/src/routes/runtime.routes.ts:88` | `apps/api/src/integration/theme-runtime-contract.integration.test.ts:157` |
| Runtime Host | Navigation/API context shim داخل المعاينة | PASS | `packages/engine/src/rendering/preview-navigation-shim.ts:97`, `packages/engine/src/rendering/preview-navigation-shim.ts:102` | `apps/api/src/integration/theme-runtime-contract.integration.test.ts:157` |
| Runtime Host | عزل المعاينة بين المتاجر والثيمات + metrics headers | PASS | `packages/engine/src/rendering/preview-render-orchestrator.ts:83`, `packages/engine/src/rendering/preview-render-orchestrator.ts:152` | `apps/api/src/integration/api.integration.test.ts:603`, `apps/api/src/integration/api.integration.test.ts:664` |
| Core API | تغطية CRUD أساسية لـ products/categories/brands/blog/cart/menus/theme settings | PASS | `apps/api/src/routes/simulator.routes.ts:65`, `apps/api/src/routes/simulator.routes.ts:83`, `apps/api/src/routes/simulator.routes.ts:158`, `apps/api/src/routes/simulator.routes.ts:167` | `apps/api/src/integration/api.integration.test.ts:186`, `apps/api/src/integration/api.integration.test.ts:880`, `apps/api/src/integration/api.integration.test.ts:1157`, `apps/api/src/integration/api.integration.test.ts:1521` |
| Theme Components | تطبيع `source` و`variable-list` لأي `twilight.json` ناقص/alias | PASS | `packages/engine/src/providers/simulator.service.ts:1406`, `packages/engine/src/providers/simulator.service.ts:1622` | `apps/api/src/integration/api.integration.test.ts:515` |
| Theme Capability | اكتشاف تغطية الصفحات من `component.path` | PASS | `packages/engine/src/validators/salla-validator.ts:134`, `packages/engine/src/providers/theme-management-orchestrator.ts:107` | `packages/engine/src/validators/salla-validator.component-capability.test.ts:1` |
| UI Observability | عرض حالة capability gate في لوحة النظام | PASS | `apps/ui/src/pages/SystemHome.tsx:210`, `apps/ui/src/pages/SystemHome.tsx:384` | مغطى تكامليًا عبر sync/gate في API tests |
| Browser Parity | فحص صفحات المعاينة الأساسية في المتصفح | PASS | `apps/ui/e2e/preview-parity.spec.ts:4` | `apps/ui/e2e/preview-parity.spec.ts:37` |
| Store Context Contract | توحيد كامل لآلية تمرير context headers في UI | PASS | `apps/ui/src/components/StoreSettingsPanel.tsx:28`, `apps/ui/src/pages/StoreProducts.tsx:67`, `apps/ui/src/pages/EditProduct.tsx:103`, `apps/api/src/services/context-resolver.ts:38` | `apps/api/src/services/context-resolver.test.ts:1` |
| Theme Admission | منع/تصنيف الثيمات الفاشلة كـ gate إلزامي قبل اعتمادها تشغيليًا | PARTIAL | `packages/engine/src/providers/store-management-orchestrator.ts:67`, `packages/engine/src/providers/store-management-orchestrator.ts:149` (تفعيل gate عند ربط الثيم بالمتجر) | `apps/api/src/integration/api.integration.test.ts:626` (رفض bind بثيم fail) |
| Parity Semantics | مطابقة دلالية عميقة لسلوك checkout/auth/customer مقارنة بسلة (وليست مجرد استجابة 200) | PARTIAL | مسارات موجودة: `apps/api/src/routes/simulator.routes.ts:58`, `apps/api/src/routes/simulator.routes.ts:190` | التغطية الحالية تركز parity وظيفي عام: `apps/api/src/integration/api.integration.test.ts:1800` |
| Theme Diversity | اعتماد مصفوفة ثيمات متعددة داخل CI (ناجح/ناقص/معطوب) | PASS | `apps/api/src/integration/api.integration.test.ts:725` (theme matrix gate fixtures + capability assertions) | `apps/api/src/integration/api.integration.test.ts:725` |
| Parity Baseline Gate | خط قياس baseline إلزامي (contract + browser) مع artifact تشغيلي | PASS | `tools/perf/parity-baseline-gate.mjs`, `apps/api/src/integration/theme-runtime-contract.integration.test.ts`, `apps/ui/e2e/preview-parity.spec.ts` | `Docs/VTDR/PARITY-BASELINE.latest.json` |

## 4) فجوات P0 الحالية (الأولوية القصوى)

> الهدف من P0: رفع احتمالية نجاح أي ثيم جديد بدون ترقيع موضعي.

### P0-01: إلزام Theme Admission Gate
1. ✅ تم تفعيل gate على مسار ربط الثيم بالمتجر (`PATCH /api/stores/:id`) مع رفض `422` لحالة `fail`.
2. سياسة مقترحة:
   - `fail`: منع bind الثيم للمتاجر افتراضيًا.
   - `warning`: مسموح مع banner تحذيري واضح.
3. نقطة التنفيذ:
   - مكتمل جزئيًا: `packages/engine/src/providers/store-management-orchestrator.ts`, `apps/api/src/routes/store.routes.ts`
   - المتبقي: فرض policy على `register/sync` في `packages/engine/src/providers/theme-management-orchestrator.ts`

### P0-02: توحيد Store Context Contract نهائيًا
1. ✅ تم حذف `Context-Store-Id` من الواجهة بالكامل واعتماد `X-VTDR-Store-Id` كرأس Canonical.
2. ✅ بقي fallback legacy داخل API resolver فقط لأغراض التوافق الخلفي.
3. ✅ تم توثيق السلوك باختبار وحدة مباشر:
   - `apps/api/src/services/context-resolver.test.ts`

### P0-03: Parity Assertions دلالية للصفحات الأساسية
1. ✅ تم توسيع اختبار parity للتحقق من مؤشرات دلالية قابلة للعرض فعليًا للصفحات الأساسية (`products/categories/brands/blog`) وليس نجاح HTTP فقط.
2. ✅ تم ربط الفشل مباشرة باسم الثيم والصفحة بصيغة `[theme][page]`.
3. ✅ نقطة التنفيذ:
   - `apps/api/src/integration/theme-runtime-contract.integration.test.ts` (semantic route assertions + route-scoped failures)
   - `apps/ui/e2e/preview-parity.spec.ts` (browser semantic gate + route-scoped parity failures)
4. ✅ تحقق الإغلاق:
   - `npm run test:contract:theme-runtime`
   - `npm run test:e2e:preview`

### P0-04: مصفوفة ثيمات CI متعددة (Theme Matrix Gate)
1. ✅ تم إدخال 3 أصناف fixtures داخل اختبار تكاملي واحد:
   - ثيم متوافق (`pass`)
   - ثيم ناقص تغطية الصفحات الأساسية (`warning`)
   - ثيم مع schema غير صالح (`fail`)
2. ✅ تم فرض السلوك المتوقع لكل صنف داخل CI:
   - `pass`: يسمح بالربط
   - `warning`: يسمح بالربط
   - `fail`: يمنع الربط (`422`)
3. ✅ نقطة التنفيذ:
   - `apps/api/src/integration/api.integration.test.ts` (سيناريو `enforces theme matrix gate (pass/warning/fail) during sync and store binding`)
4. ✅ تحقق الإغلاق:
   - `npm run test --workspace=@vtdr/api -- --run src/integration/api.integration.test.ts --testNamePattern "enforces theme matrix gate"`

### P0-05: تثبيت Parity Baseline قابل للقياس
1. ✅ تم إضافة تصدير metrics تعاقدي من:
   - `apps/api/src/integration/theme-runtime-contract.integration.test.ts`
   - عبر `VTDR_PARITY_CONTRACT_METRICS_FILE`.
2. ✅ تم إضافة تصدير metrics متصفح من:
   - `apps/ui/e2e/preview-parity.spec.ts`
   - عبر `VTDR_PARITY_BROWSER_METRICS_FILE`.
3. ✅ تم إنشاء gate موحد:
   - `tools/perf/parity-baseline-gate.mjs`
   - يشغّل contract + browser gates، يطبّق العتبات، ويصدر artifacts.
4. ✅ تم ربطه بالتشغيل القياسي:
   - `package.json` -> `parity:baseline:gate`
   - `package.json` -> `validate` يتضمن parity gate.
5. ✅ تحقق الإغلاق:
   - `npm run parity:baseline:gate`
   - artifact فعلي:
     - `Docs/VTDR/PARITY-BASELINE.latest.json`
     - `Docs/VTDR/PARITY-BASELINE.20260219-211923.json`

## 5) قرار البدء التنفيذي

تم إغلاق `P0-05` بالكامل.  
الخطوة التنفيذية التالية: الانتقال إلى أول فجوة `PARTIAL` في المصفوفة (Parity Semantics) وتثبيت عقد دلالي أعمق لمسارات `checkout/auth/customer`.
