# Salla Theme Blog Practices (Advisory)

تاريخ: 2026-02-14
المصدر: https://salla.dev/category/theme/
النوع: ممارسات إرشادية (ليست بديلًا عن المتطلبات الرسمية في docs.salla.dev)

---

## 1) Performance & Accessibility Baseline

مرجع:
- https://salla.dev/blog/theme-raed-performance-and-accessibility-guide/

### قواعد عملية
- إضافة `aria-label` للعناصر التفاعلية عند الحاجة.
- استخدام `alt` وصفي للصور، و`alt=""` للصور الزخرفية فقط.
- الالتزام بتباين ألوان مناسب (WCAG 2.1 AA).
- دعم التنقل الكامل عبر لوحة المفاتيح + `:focus-visible` واضح.
- تقليل CSS/JS (minify) في build.
- `loading="lazy"` للصور غير الحرجة.
- `preload` للموارد الحرجة (scripts/fonts) عند الحاجة.
- تقليل CLS عبر أبعاد ثابتة/`aspect-ratio` وحجز مساحات العناصر الديناميكية.

### قياس موصى به
- اختبار Lighthouse/PSI على: home + product + checkout.
- إضافة `?without-external-apps=1` عند القياس لعزل أثر التطبيقات الخارجية.

---

## 2) Theme Branching Workflow

مرجع:
- https://salla.dev/blog/optimized-themes-development-with-themes-branches/

### قواعد عملية
- اعتماد استراتيجية فروع واضحة لكل ميزة (feature branch).
- دعم الإنشاء من tag/commit عند الحاجة لتجارب متوازية.
- ربط الفروع مع Partners Portal لتبديل branch أثناء المعاينة.
- دمج الفروع إلى `master` فقط بعد اجتياز التحقق.

---

## 3) Component Default Values (Preview Quality)

مرجع:
- https://salla.dev/blog/theme-component-default-value/

### قواعد عملية
- تعريف `value` افتراضي لمعظم حقول المكونات لتحسين المعاينة.
- توفير محتوى placeholder واقعي (صور/نصوص/أرقام) يساعد التاجر على الفهم.
- منع القيم الحساسة أو أي ذكر لعلامات أخرى داخل القيم الافتراضية.
- استخدام محتوى عربي افتراضي مناسب للسياق عند الحاجة.

### ملاحظة منشورة بالمقال
- ورد في المقال شرط موافقة يتعلق بوجود مكونات بقيم افتراضية (يجب التحقق من آخر تحديث رسمي في docs.salla.dev قبل اعتمادها كقاعدة إلزامية).

---

## 4) Grouping Theme Settings in twilight.json

مرجع:
- https://salla.dev/blog/group-theme-settings-for-salla-themes/

### قواعد عملية
- تعريف `groups` في جذر `twilight.json`.
- الاستفادة من المجموعات المسبقة (مثل: header/footer/home) عند ملاءمتها.
- إنشاء مجموعات مخصصة (`product.single`, `cart`, ...) لتنظيم الإعدادات الكبيرة.
- ربط كل setting بمجموعة واضحة عبر `groups` لتحسين تجربة التاجر في المحرر.

---

## 5) كيفية استخدام هذه الوثيقة في مشروع VTDR

1. تُستخدم هذه الوثيقة لتحسين جودة UX/Preview والأداء.
2. المتطلبات الإلزامية للنشر والتوافق تؤخذ من:
   - [Salla-Official-Alignment.md](Salla-Official-Alignment.md)
3. عند التعارض: **المرجع الرسمي يتقدم على أي مقال مدونة**.
