# Theme Raed Implementation Reference

تاريخ: 2026-02-14
المصدر: https://github.com/SallaApp/theme-raed
الغرض: تحويل Theme Raed إلى مرجع عملي لمشروع VTDR

---

## 1) ماذا يؤكد Theme Raed بوضوح

1. الثيم يعتمد على بنية Twilight القياسية:
   - src/assets
   - src/views
   - src/locales
   - twilight.json
2. المعاينة والتهيئة التشغيلية تعتمد على Context والمتغيرات الجاهزة في Twig.
3. استخدام واسع لمكونات Salla Web Components داخل الصفحات (مثل salla-products-list وغيرها).
4. الفصل بين:
   - Layouts
   - Pages
   - Components
   - Partial JS entries
5. التحديثات المتكررة في CHANGELOG تؤكد أن التوافق مع Twilight يتغير باستمرار ويجب تتبعه.

---

## 2) أنماط معمارية مهمة يجب نقلها إلى VTDR

### A) Event lifecycle واضح
- نمط جاهزية الثيم عبر حدث جاهز عام ثم تشغيل المكونات.
- توصية VTDR:
  - توحيد دورة تشغيل: boot -> context-ready -> preview-ready

### B) تقسيم مدخلات JS حسب الصفحة
- وجود مداخل build متعددة (home/product/checkout/...)
- توصية VTDR:
  - Context Builder يحدد page-intent ويصدر payload خاص بكل صفحة

### C) توثيق المتغيرات داخل ملفات Twig
- كثير من الصفحات تبدأ بعقد Variables موثقة.
- توصية VTDR:
  - استخراج schema متغيرات الصفحة آليًا لإنتاج Validation أوضح

### D) اعتماد hooks
- وجود نقاط hook متعددة في layout/page
- توصية VTDR:
  - محرك المعاينة يجب يحترم نقاط hook ولا يكسرها

---

## 3) نقاط حرجة مرتبطة بـ twilight.json

من خلال README و CHANGELOG:
1. features + components محور أساسي في تعريف الثيم.
2. تم دعم خصائص مثل default data و preview images في الإصدارات الحديثة.
3. هناك اعتماد واضح على الإعدادات (theme.settings.get) في runtime.

توصية VTDR:
- فحص إلزامي لـ:
  - وجود twilight.json
  - صلاحية بنية features/components/settings
  - وجود defaults و preview metadata عند الحاجة

---

## 4) ما يجب إضافته إلى Validation في مشروعك (P0)

1. فحص توافق بنية المجلدات مع نمط Theme Raed القياسي.
2. فحص سلامة استدعاءات theme.settings.get المستخدمة في القوالب.
3. فحص وجود تعريفات واضحة لمتغيرات الصفحات الحرجة:
   - home
   - product
   - cart
   - thank-you
4. فحص Web Components المستخدمة في القوالب مقابل القائمة المدعومة.
5. فحص عدم تضمين ملفات IDE-only في الحزمة النهائية (مثل ملفات لا يجب bundling لها).

---

## 5) ما لا ننقله حرفيًا

1. لا ننسخ تصميم أو CSS أو مكونات Theme Raed نفسها.
2. لا نعتمد على تفاصيل داخلية تخص ثيم واحد كأنها معيار رسمي عام.
3. لا نحول VTDR إلى clone للثيم؛ نستخدمه كنموذج مرجعي للسلوك فقط.

---

## 6) خلاصة تنفيذية

Theme Raed مفيد جدًا كمرجع تشغيل حقيقي لـ Twilight،
لكنه مرجع تطبيقي وليس عقدًا رسميًا أعلى من docs.salla.dev.

قاعدة الحسم:
- المتطلبات الرسمية: من docs.salla.dev
- الأنماط العملية الواقعية: من Theme Raed
- التنفيذ في VTDR: يدمج الاثنين معًا دون نسخ الثيم.
