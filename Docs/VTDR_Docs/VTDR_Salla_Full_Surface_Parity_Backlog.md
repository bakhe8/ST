# VTDR - Salla Full Surface Parity Backlog

تاريخ الإصدار: 2026-02-20  
الحالة: Active  
الهدف: تمكين VTDR من تشغيل وإدارة الثيمات بسلوك مماثل لمنصة سلة على مستوى **الواجهة الأمامية للمتجر** + **لوحة التحكم** + **عقود الثيم**.

## 1) قاعدة التنفيذ

1. التطابق المطلوب هو تطابق **سلوكي/تشغيلي** وليس نسخ HTML حرفي.
2. أي بند لا يُقبل إلا إذا مر عبر:
   - Contract test
   - API integration test
   - Browser parity test
3. دعم أي ثيم يجب أن يكون عبر Runtime موحد، وليس ترقيعًا لكل ثيم.

## 2) تصنيف البنود التي طلبتها (حسب السطح الصحيح)

### A) Theme Lifecycle + Review Pipeline (Dashboard)

يشمل:
- Getting Started
- Create a theme
- Develop a theme
- Setup a theme
- Publish a theme
- Requirements & Review
- Review Process
- UI/UX Review
- Technical Review
- Metadata Review
- Pre-Launch Review
- Change Log

مخرجات VTDR المطلوبة:
1. Theme workspace داخل لوحة التحكم (create/develop/setup/publish).
2. Pipeline تدقيق قبل النشر (UI/UX, Technical, Metadata, Pre-launch).
3. شاشة تقرير موحد: `pass/warning/fail` مع أدلة قابلة للتتبع.
4. سجل تغييرات للإصدار (`ThemeVersion changelog`) مرتبط بكل نسخة.

---

### B) Theme Contract & Architecture Runtime (Engine/API)

يشمل:
- Files and Folders Structure
- Directory structure
- twilight.json
- Twig Template Engine (basic + twilight flavoured)
- Theme Architecture
- Layouts (Master Layout)
- Global Variables
- CSS Variables
- Salla Icons
- Custom Fonts
- Hooks
- Localizations

مخرجات VTDR المطلوبة:
1. Validator صارم لبنية الثيم (`directory + twilight.json + templates`).
2. Runtime Contract Context موحد يغطي global vars/hooks/localizations.
3. Compatibility report لكل ثيم: support matrix + missing contracts.
4. فحوصات CI تمنع إدخال ثيم يكسر العقد الأساسية.

---

### C) Storefront Page Runtime Parity (Preview + API)

يشمل:
- Pages Overview
- Home Page
- Product Pages (listing/single)
- Customer Pages (profile/orders/order details/wishlist/notifications)
- Blog Pages (listing/single)
- Brand Pages (listing/single)
- Common Pages (cart/loyalty/thank you/single page/landing page)

مخرجات VTDR المطلوبة:
1. Route coverage كاملة للصفحات أعلاه ضمن preview host الموحد.
2. Store context + translations + SDK context ثابتة لكل صفحة.
3. بيانات فعلية قابلة للعرض (products/blog/brands/customer/cart/orders).
4. اختبارات دلالية لكل صفحة (ليس 200 فقط).

---

### D) Component Runtime & Authoring Parity (Storefront + Dashboard)

يشمل:
- Components overview
- Home Components (YouTube, fixed banner, testimonials, parallax, sliders, brands, links, ...)
- Product Components (Essentials/Options)
- Common Components
- Header Components
- Footer Components
- Comments component

مخرجات VTDR المطلوبة:
1. Capability + Anchor probes لكل ثيم.
2. محرر مكونات في Dashboard مبني على schema مع شروط الحقول.
3. رندر فعلي للمكونات في storefront حسب `page_compositions`.
4. Diagnostics في وضع observe (لا حجب ربط الثيم، مع كشف النواقص).

## 3) برنامج التنفيذ (Delivery Slices)

## S-08: Theme Lifecycle Workspace
1. بناء/تهيئة/تطوير/نشر الثيم داخل Dashboard.
2. ربط كل خطوة بعقود تشغيل واضحة.

## S-09: Theme Review Pipeline
1. تنفيذ فحوصات UI/UX + Technical + Metadata + Pre-Launch.
2. إخراج تقرير gating موحد لكل نسخة ثيم.

## S-10: Full Storefront Page Coverage
1. إغلاق فجوات صفحات المنتجات/المدونة/العميل/السلة/الولاء/الشكر.
2. تكامل API + preview parity tests لكل مسار.

الحالة الحالية (2026-02-20):
1. ✅ شريحة أولى من S-10 مغلقة:
   - تغطية دلالية لمسارات `cart/checkout/loyalty/thank-you/landing-page/customer(profile|orders|wishlist|notifications|wallet)` داخل:
     - `apps/api/src/integration/theme-runtime-contract.integration.test.ts`
     - `apps/ui/e2e/preview-parity.spec.ts`
2. ✅ التحقق الدلالي يعتمد:
   - `templatePageId` من `window.vtdr_context`.
   - semantic markers لكل صفحة إضافية (وليس HTTP status فقط).
3. ✅ نتائج الاختبار:
   - `npm --workspace @vtdr/api run test -- --run src/integration/theme-runtime-contract.integration.test.ts`
   - `npm run test:e2e:preview`

## S-11: Global Variables / Hooks / Localization Parity
1. إكمال السياق العام المطلوب للثيمات.
2. منع تسرب مفاتيح ترجمة خام في واجهات المعاينة.

## S-12: Home Components Library Parity
1. إكمال حزمة Home Components المذكورة بالكامل.
2. توحيد source resolution لكل component data source.

## S-13: Product + Common Components Parity
1. Essentials/Options/Comments/Header/Footer parity.
2. ربطها بمصادر البيانات الحقيقية داخل المتجر.

## S-14: Multi-Theme CI Matrix
1. مصفوفة pass/warning/fail لعدة ثيمات حقيقية.
2. تقرير توافق موحد لكل ثيم بدون ترقيع يدوي.

## 4) معايير القبول (Definition of Done)

كل بند من قائمتك لا يُعد منجزًا إلا بتحقق:
1. شاشة/سلوك ظاهر في Storefront أو Dashboard (حسب طبيعته).
2. API contract موثق ومغطى اختباريًا.
3. Theme runtime contract tests خضراء.
4. Browser parity test أخضر.
5. إدراج الحالة في Parity Matrix (`PASS` بدل `PARTIAL/GAP`).

## 5) أولوية التنفيذ الفورية

الأولوية الحالية: **S-10 + S-11**  
السبب: هذه المرحلة هي التي تملأ الفراغ الظاهر الآن في المعاينة (بيانات/ترجمة/سياق صفحات) وتسمح للثيمات بإظهار قدراتها فعليًا.
