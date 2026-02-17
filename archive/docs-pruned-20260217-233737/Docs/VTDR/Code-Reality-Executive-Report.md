# Code Reality Executive Report

Date: 2026-02-17
Scope: Code-first assessment (source of truth is runtime code, not documentation)

## 1) Executive Summary by Folder

### `apps`
- `apps/api`: Main Express backend and orchestration layer. Boots services, wires routes, applies context middleware, and exposes runtime preview endpoints (`apps/api/src/index.ts:63`, `apps/api/src/index.ts:136`, `apps/api/src/index.ts:152`).
- `apps/ui`: React/Vite management interface with store routes for dashboard, products, categories, static pages, settings, theme settings, and preview (`apps/ui/src/App.tsx:26`, `apps/ui/src/App.tsx:34`).
- Current status: Buildable and structured, but with material API/UI contract gaps.

### `packages`
- `packages/contracts`: System contracts/types. Modern runtime uses Store-First in `packages/contracts/runtime.ts:122`, but legacy scenario artifacts still exist in `packages/contracts/runtime.contract.d.ts:17`.
- `packages/data`: Prisma schema + repositories. Effective schema is Store-First (`packages/data/prisma/schema.prisma:43`). Legacy scenario schemas still exist in parallel files (`packages/data/prisma/schema.dev.prisma:51`).
- `packages/engine`: Core runtime logic (composition, rendering, simulation, store operations). Context build in `packages/engine/src/core/composition-engine.ts:30`, store logic in `packages/engine/src/core/store-logic.ts:4`, simulator surface in `packages/engine/src/providers/simulator.service.ts:5`.
- `packages/themes`: Real theme implementation (`theme-raed-master`) with `twilight.json`, Twig templates, and assets. Real settings exist (example: `header_is_sticky`) in `packages/themes/theme-raed-master/twilight.json:89`.

### `Docs`
- Current docs are largely generic rewritten templates and do not faithfully represent runtime behavior (examples: `Docs/DEV.md:1`, `Docs/Vision/Vision.md:1`).

### `archive`
- Contains archived old markdown docs snapshot (`archive/md-archive-20260217-192912`) for historical reference only.

### `stores`
- Empty at this time.

## 2) Contradictions/Conflicts + Resolution Decision

### Conflict 1: Context middleware vs route expectations
- Fact: Middleware sets only `req.storeId` (`apps/api/src/middlewares/context.middleware.ts:35`).
- Fact: Runtime/store routes rely on `req.store` (`apps/api/src/routes/runtime.routes.ts:19`, `apps/api/src/routes/store.routes.ts:29`).
- Decision: Normalize context injection by attaching full store object in middleware, or standardize all routes to resolve store explicitly from `req.storeId`.

### Conflict 2: Preview URL in UI vs dev proxy setup
- Fact: UI base defaults to `window.location.origin/api` (`apps/ui/src/services/api.ts:5`).
- Fact: Preview page strips `/api` and opens `/preview/...` (`apps/ui/src/pages/StorePreview.tsx:17`, `apps/ui/src/pages/StorePreview.tsx:18`).
- Fact: Vite proxy forwards only `/api` (`apps/ui/vite.config.ts:11`).
- Decision: Add proxy for `/preview` or route preview through `/api` consistently.

### Conflict 3: UI performs CRUD where API exposes mostly GET
- UI calls write operations:
  - Categories: `PUT/DELETE/POST` (`apps/ui/src/pages/StoreCategories.tsx:48`, `apps/ui/src/pages/StoreCategories.tsx:63`, `apps/ui/src/pages/StoreCategories.tsx:72`)
  - Static pages: `POST/PUT/DELETE` (`apps/ui/src/pages/StoreStaticPages.tsx:40`, `apps/ui/src/pages/StoreStaticPages.tsx:57`, `apps/ui/src/pages/StoreStaticPages.tsx:69`)
  - Product update: `PUT` (`apps/ui/src/pages/EditProduct.tsx:130`)
- API simulator routes expose read-focused endpoints for these resources (`apps/api/src/routes/simulator.routes.ts:13` to `apps/api/src/routes/simulator.routes.ts:35`).
- Decision: Either implement missing CRUD endpoints or make UI read-only until backend parity is complete.

### Conflict 4: Theme settings save path mismatches schema constraints
- Fact: Theme settings UI sends flat keys from `twilight.json` (`apps/ui/src/components/ThemeSettingsPanel.tsx:74`).
- Fact: Backend saves theme settings via branding update (`packages/engine/src/providers/simulator.service.ts:144`).
- Fact: `BrandingSchema` is strict and expects branding structure, not arbitrary theme setting keys (`packages/contracts/src/schemas.ts:6`, `packages/contracts/src/schemas.ts:20`).
- Decision: Separate `themeSettingsJson` from `brandingJson` in persistence model and API flow.

### Conflict 5: Store update response envelope mismatch
- Fact: UI expects `result.success` (`apps/ui/src/components/StoreSettingsPanel.tsx:57`).
- Fact: `PATCH /stores/:id` returns raw store object, not envelope (`apps/api/src/routes/store.routes.ts:42`).
- Decision: Standardize response envelope across all API endpoints (`{ success, data, error }`).

### Conflict 6: Legacy Scenario leftovers vs Store-First target
- Fact: Legacy scenario type still appears (`packages/contracts/runtime.contract.d.ts:17`).
- Fact: UI has dead scenario endpoint call (`apps/ui/src/components/PageComponentsEditor.tsx:140`).
- Fact: SDK bridge still uses scenario header (`apps/api/public/sdk-bridge.js:23`) while renderer injects `storeId` (`packages/engine/src/rendering/renderer-service.ts:477`).
- Decision: Remove or isolate all Scenario legacy references behind explicit compatibility boundary with sunset plan.

### Conflict 7: SDK bridge calls non-existing cart endpoints
- Fact: Bridge calls `/api/v1/cart*` (`apps/api/public/sdk-bridge.js:40`, `apps/api/public/sdk-bridge.js:50`).
- Fact: No cart routes are registered in active API routes list (`apps/api/src/routes/simulator.routes.ts:13` to `apps/api/src/routes/simulator.routes.ts:56`).
- Decision: Implement cart endpoints or disable those bridge hooks until implemented.

### Conflict 8: Docs directly contradict code operations
- Fact: Docs use incorrect command `pm run dev` (`Docs/DEV.md:8`), while actual root script is `npm run dev` (`package.json:10`).
- Fact: Architecture doc still references scenario isolation language despite Store-First runtime (`ARCHITECTURE.md:17`).
- Decision: Treat code + tests as source of truth, then regenerate docs from verified implementation.

## 3) Practical Execution Roadmap (Current State -> Final Target)

### Phase A (2-4 days): Contract Stabilization (Critical)
- Fix context flow (`req.store` vs `req.storeId`) across middleware and dependent routes.
- Fix preview URL/proxy consistency so preview works reliably in dev.
- Standardize API response envelopes.
- Exit criteria: Store settings + preview work end-to-end from UI.

### Phase B (4-7 days): CRUD Parity Closure
- Decide formal target per resource: full CRUD or read-only.
- Implement missing API operations or remove/disable UI write paths temporarily.
- Exit criteria: No UI operation triggers contract-level 404/unsupported behavior.

### Phase C (3-5 days): Legacy Scenario Cleanup
- Remove stale Scenario references from active frontend/backend paths.
- Keep only explicit compatibility layer if needed (with deprecation date).
- Exit criteria: Runtime path is fully Store-First without mixed concepts.

### Phase D (3-5 days): Theme Settings Persistence Model
- Introduce dedicated `themeSettingsJson` (or equivalent table).
- Keep `brandingJson` strictly for branding semantics.
- Exit criteria: `twilight.json` settings persist and round-trip without schema rejection.

### Phase E (3-6 days): Testing and Quality Gate
- Add integration tests for critical API endpoints and context resolution.
- Add UI->API contract tests for active screens.
- Exit criteria: `npm run test` executes real assertions (not placeholder echoes).

### Phase F (2-4 days): Documentation Rebuild from Code
- Recreate docs from implemented behavior with direct file-level references.
- Add drift checks in CI: route/schema changes require linked docs updates.
- Exit criteria: Docs become reliable roadmap aligned to runtime truth.

## 4) Current Goal Status (Code Reality)

- Build status: Passes (`npm run build` successful).
- Test status: Pipeline passes but mostly placeholder tests (`No tests yet` scripts).
- Strategic status: Final maintainability target is not yet reached because operational contracts are partially inconsistent between UI, API, and persistence.

## 5) Immediate Next Action (Recommended)

Start Phase A immediately:
1. Fix context injection and dependent routes.
2. Fix preview routing/proxy flow.
3. Normalize API response envelope.

ملاحظات المالك :

تقريرك “Code-Reality” ممتاز كمنهج (الكود هو الحقيقة)، وهو يلتقط مصدر الخطر الحقيقي عندكم: التغيير يحدث عبر حدود غير محروسة (UI↔API↔Engine↔DB) فتتحول أي إضافة صغيرة إلى كسر صامت.

سأعطيك “تنفيذ Phase A” لكن بصيغة منع التغيير نفسه من أن يصبح مصدر الخطر: يعني نحوّل التغيير إلى شيء مُقيَّد ومُختبَر ومُقاس بدل ما يكون قفزة عشوائية.

1) لماذا التغيير عندكم خطر الآن؟ (تشخيص سببي)

الخطر ليس “وجود Bugs”؛ الخطر هو أن النظام يسمح بهذه الأنواع من الانحراف بدون إنذار:

عقد Context غير موحّد: middleware يحقن storeId بينما routes تتوقع store → أي تعديل في جزء يكسر جزء آخر بدون ما يبان إلا وقت التشغيل.

مسار Preview غير متسق: UI يفتح /preview بينما dev proxy فقط /api → تغييرات UI تبدو “صح” لكن تفشل في dev.

UI تكتب و API تقرأ: واجهة تنفذ CRUD و backend ما يدعم إلا GET → كل تعديل UI قد ينتج 404/405 و “نصف ميزة”.

نموذج التخزين غير مطابق للعقود: ThemeSettings تُرسل مفاتيح حرة لكن backend يحاول حشرها في BrandingSchema الصارم → تغييرات إعدادات الثيم = رفض/ضياع بيانات.

Envelope غير موحّد: UI تتوقع {success} و API ترجع كائن raw → أي refactor بسيط يكسّر UI.

هذه النقاط تجعل التغيير خطر لأنه لا توجد “بوابات جودة” على الحدود.

2) قاعدة ذهبية: “لا تغيير بلا بوابة”

لو تبغى تمنع التغيير نفسه من أن يصبح مصدر خطر، لازم تفرض 4 بوابات (Gates) لا تتخطى:

Gate A — Contract Gate (أهم بوابة)

مصدر واحد للعقود (Types + Zod Schemas) ويُستخدم في:

API request/response validation

UI typed client

Integration tests

أي تغيير في endpoint أو payload يفشل الـ CI تلقائيًا إذا ما تم تحديث العقد والاختبارات.

Gate B — Runtime Safety Gate

كل request حساس يُتحقق منه Zod في API (حتى لو Typescript موجود).

أي req.store أو req.storeId لازم يُثبت في middleware بشكل قاطع (إما هذا أو ذاك، لا خليط).

Gate C — Integration Gate

اختبارات تكامل على 6–10 مسارات حرجة فقط (مو لازم تغطي كل شيء الآن) لكن تغطي “الحدود”:

context resolution

preview route

PATCH store

theme settings round-trip

categories/pages CRUD (إما موجودة أو محجوبة)

Gate D — Drift Gate (منع الانحراف)

سكربت CI يفحص:

أن routes المعلنة لها عقود

وأن UI لا تستدعي endpoints غير موجودة

وأن docs الأساسية (DEV/ARCHITECTURE) متزامنة مع scripts/routes (حتى لو minimal)

3) تنفيذ Phase A “بالحد الأدنى الذي يمنع الخطر”
(1) حسم مسألة Context مرة واحدة

قرار واحد فقط ثم تنظيف كامل:

خيار 1 (أنظف): middleware يحقن req.store (كائن Store) + req.storeId

خيار 2: لا يوجد req.store نهائيًا، كل route يحل store من storeId

المهم: تختار واحد وتمنع الآخر عبر Type augmentation + runtime assert:

إذا route يعتمد على req.store لازم middleware يضمنه

وإذا route يعتمد على req.storeId لازم يمنع الوصول لـ req.store

هذا وحده يقلل خطر التغيير بشكل كبير لأنه يغلق أكبر “فتحة كسر”.

(2) إصلاح preview في dev بشكل حتمي

أنت عندك تضارب /preview مقابل proxy /api.
أقوى حل يقتل الفوضى:

اجعل preview دائمًا يمر من API: /api/preview/...

أو أضف proxy صريح لـ /preview

لكن لا تترك UI “تقص /api” بذكاء… هذا نوع تغيير خطير لأنه سلوك implicit.

(3) توحيد Envelope (قرار واحد)

أنت كتبت القرار صح: { success, data, error }.

نفّذه بأقل تغييرات:

اكتب helper واحد في API:

ok(data) و fail(code,message,details?)

عدّل فقط endpoints التي UI تستهلكها الآن (Store settings + preview + theme settings)

(4) Theme settings: افصلها الآن (حتى قبل DB)

حتى لو ما سويت migration اليوم:

توقف عن تمرير theme settings داخل brandingJson.

اعمل payload منفصل themeSettings ويحفظ مؤقتًا في store record أو ملف json أو حقل جديد لاحقًا.

المهم الآن: لا تكسر BrandingSchema ولا تخلط semantics.

Exit Criteria لPhase A الحقيقي (واضح ومقاس):

UI Store Settings تحفظ وتقرأ بدون أخطاء

Preview يعمل في dev و prod بنفس المسار

لا يوجد endpoint يُرجع raw بينما UI يتوقع envelope

لا يوجد route يعتمد على req.store بدون ضمان middleware

4) “قرار parity” لتفادي Phase B يتحول لفوضى

عندك Conflict 3 (UI CRUD vs API GET). هذا لو تركته “معلّق” سيخلي كل تغيير UI خطر.

اتخذ قرار فوري أحد الاثنين:

Read-only الآن: عطّل أزرار/عمليات الحفظ في UI (feature flag) + أظهر رسالة “Backend parity pending”.

Implement minimal CRUD: بس للمسارات التي UI يستخدمها فعليًا الآن (مش كل شيء).

الأسوأ: تبقى UI ترسل PUT/POST/DELETE و API ما عنده… هذا يولد “سلوك كاذب” للمستخدم ويُفسد الثقة.

5) كيف تمنع “Legacy Scenario” من العودة كقنبلة؟

أنت قررت Sunset plan — ممتاز. اجعله قابل للتنفيذ:

ضع compatibility layer واحد فقط (إن احتجتم) في مكان واضح مثل:

packages/compat/scenario/

امنع أي import لـ scenario types خارج هذا المجلد عبر lint rule / tsconfig path restriction.

أي ملف legacy موجود: إمّا يُنقل للـ compat أو يُحذف.

هذا يمنع التغيير من “إعادة إدخال المفهوم” من باب خلفي.

6) أقوى “Immediate Next Action” بصيغة Task List

إذا تبغى تبدأ الآن بدون كلام زيادة، هذا ترتيب التنفيذ الذي يعطي أعلى تقليل للمخاطر لكل ساعة عمل:

Context: اختر نموذج واحد + عدّل middleware + أصلح كل routes المتأثرة + runtime assert.

Preview: وحّد المسار (إما /api/preview أو proxy /preview) وألغِ من UI أي قصّ implicit.

Envelope: طبّق ok/fail على endpoints التي UI تستخدمها الآن، وعدّل UI لتتوقع envelope موحد.

Theme settings: افصل themeSettings payload عن branding نهائيًا (حتى لو التخزين مؤقت).

أضف 6 اختبارات تكامل تغطي البنود أعلاه (هي “الفرامل” التي تمنع التغيير يصير خطر).