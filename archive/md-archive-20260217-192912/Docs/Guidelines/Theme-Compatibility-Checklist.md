# Theme Compatibility Checklist (Salla)

تاريخ: 2026-02-14
الاستخدام: فحص توافق أي ثيم قبل/بعد المعاينة وقبل التصدير

الحالات:

- PASS
- WARNING
- FAIL

---

## A) Structure

- [ ] وجود بنية مجلدات متوافقة مع دليل الثيمات الرسمي
  - المرجع: https://docs.salla.dev/421918m0
  - الحالة:
  - ملاحظة:

- [ ] وجود الملفات الحرجة: `src/views/layouts/master.twig` و`src/views/pages/index.twig`
  - المرجع: https://docs.salla.dev/421918m0
  - الحالة:
  - ملاحظة:

- [ ] وجود بنية الأصول الأساسية: `src/assets/js` و`src/assets/styles`
  - المرجع: https://docs.salla.dev/421918m0
  - الحالة:
  - ملاحظة:

- [ ] اتساق مسارات العرض الفعلية مع `path` المعرّف في `twilight.json`
  - المرجع: https://docs.salla.dev/421918m0
  - الحالة:
  - ملاحظة:

- [ ] وجود ملف `twilight.json` بصيغة صحيحة
  - المرجع: https://docs.salla.dev/421921m0
  - الحالة:
  - ملاحظة:

- [ ] التوافق مع `Twilight-Json-Compliance-Spec.md` (الأقسام الأساسية والقواعد)
  - المرجع: https://docs.salla.dev/421921m0
  - الحالة:
  - ملاحظة:

---

## B) Theme Contracts

- [ ] تعريفات metadata الأساسية موجودة وصالحة
  - المرجع: https://docs.salla.dev/421889m0
  - الحالة:
  - ملاحظة:

- [ ] `settings` المستخدمة في القوالب معرفة في `twilight.json` أو لها fallback واضح
  - المرجع: https://docs.salla.dev/421921m0
  - الحالة:
  - ملاحظة:

- [ ] `features` المعلنة متسقة مع القدرات الفعلية للثيم
  - المرجع: https://docs.salla.dev/421921m0
  - الحالة:
  - ملاحظة:

- [ ] `components` المخصصة مرتبطة بمسارات عرض فعلية (`path`)
  - المرجع: https://docs.salla.dev/421921m0
  - الحالة:
  - ملاحظة:

- [ ] لا يوجد استخدام Helper غير مدعوم في Twilight Twig
  - المرجع: https://docs.salla.dev/421929m0#helpers
  - الحالة:
  - ملاحظة:

- [ ] لا يوجد استخدام Filter غير مدعوم في Twilight Twig
  - المرجع: https://docs.salla.dev/421929m0
  - الحالة:
  - ملاحظة:

- [ ] الروابط/الترجمة/تنسيق التاريخ والعملة تعتمد على helpers/filters الرسمية
  - المرجع: https://docs.salla.dev/421929m0
  - الحالة:
  - ملاحظة:

- [ ] توافق Twig syntax مع Twilight
  - المرجع: https://docs.salla.dev/421928m0
  - الحالة:
  - ملاحظة:

- [ ] عدم استخدام helpers/filters غير مدعومة
  - المرجع: https://docs.salla.dev/421929m0
  - الحالة:
  - ملاحظة:

---

## C) Runtime & Preview

- [ ] المعاينة تعمل بدون أخطاء Twig قاتلة
  - المرجع: https://docs.salla.dev/421878m0
  - الحالة:
  - ملاحظة:

- [ ] Runtime Context يحتوي المتغيرات العامة الأساسية (`store`, `theme`) بشكل متوافق
  - المرجع: https://docs.salla.dev/421938m0
  - الحالة:
  - ملاحظة:

- [ ] الحقول المطلوبة في `store` و`theme` موجودة أو لها fallback صالح
  - المرجع: https://docs.salla.dev/421938m0
  - الحالة:
  - ملاحظة:

- [ ] `theme.mode` و`theme.components` مستخدمة بسياق صحيح (خصوصًا صفحة index)
  - المرجع: https://docs.salla.dev/421938m0
  - الحالة:
  - ملاحظة:

- [ ] المتغيرات الأساسية المستخدمة في القوالب متوافقة مع Global Variables
  - المرجع: https://docs.salla.dev/421938m0
  - الحالة:
  - ملاحظة:

---

## D) Publish Readiness

- [ ] استيفاء متطلبات النشر العامة
  - المرجع: https://docs.salla.dev/421885m0
  - الحالة:
  - ملاحظة:

- [ ] استيفاء متطلبات المراجعة الرئيسية
  - المرجع: https://docs.salla.dev/421886m0
  - الحالة:
  - ملاحظة:

- [ ] اجتياز المراجعة التقنية
  - المرجع: https://docs.salla.dev/421888m0
  - الحالة:
  - ملاحظة:

- [ ] اجتياز مراجعة UX/UI
  - المرجع: https://docs.salla.dev/421887m0
  - الحالة:
  - ملاحظة:

---

## E) Export Gate

- [ ] التصدير ينتج ملفات ثيم فقط (بدون runtime artifacts)
  - الحالة:
  - ملاحظة:

- [ ] الحزمة قابلة للرفع وفق مسار النشر الرسمي
  - المرجع: https://docs.salla.dev/421880m0
  - الحالة:
  - ملاحظة:

---

## النتيجة النهائية

- إجمالي PASS:
- إجمالي WARNING:
- إجمالي FAIL:
- القرار:
  - [ ] جاهز للمعاينة المتقدمة
  - [ ] جاهز للتصدير
  - [ ] يحتاج إصلاحات
