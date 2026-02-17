# Twilight.json Compliance Spec

تاريخ: 2026-02-14
المصدر الرسمي: https://docs.salla.dev/421921m0
الهدف: تعريف معايير توافق `twilight.json` داخل مشروع VTDR

---

## 1) موقع الملف ودوره

- يجب أن يكون `twilight.json` في جذر الثيم.
- الملف هو عقد التعريف الرئيسي للثيم (metadata + settings + features + components).
- أي تشغيل/معاينة/تصدير في VTDR يجب أن يبدأ بقراءة هذا الملف.

---

## 2) البنية الأساسية (Minimum Required)

الحد الأدنى المقبول:

1. `version`
2. `theme_name`
3. `repo_url`
4. `support_url`
5. `settings` (array)
6. `features` (array)
7. `components` (array)

> ملاحظة: قد توجد حقول إضافية حسب إصدار Twilight؛ تقبلها VTDR ما لم تتعارض مع العقد الرسمي.

---

## 3) قواعد `settings`

كل setting يجب أن يملك حدًا أدنى:
- `id`
- `type`
- (و/أو) `format` حسب نوع الحقل

أمثلة شائعة من المرجع:
- Boolean مع `format: switch`
- String مخفي مع `format: hidden`

### قاعدة تشغيلية
- أي setting مستخدم في Twig عبر `theme.settings.get()` يجب أن يكون معرفًا في `settings` أو له fallback واضح.

---

## 4) قواعد `features`

- `features` تمثل مكونات Twilight الجاهزة (pre-defined).
- أسماء features تأتي غالبًا بصيغة تبدأ بـ `component-`.
- يجب تضمين فقط features المدعومة فعليًا في الثيم.

### قاعدة تشغيلية
- أي feature غير مدعومة فعليًا في القوالب تعتبر `WARNING`.
- أي اعتماد على feature غير معلنة يعتبر `FAIL`.

---

## 5) قواعد `components`

لكل custom component حد أدنى:
- `name`
- `title`
- `path`
- `fields` (array)

وفي الحقول المتداخلة (خصوصًا `collection`):
- احترام `required`, `minLength`, `maxLength` عند وجودها.
- تعريف `id/type/format` لكل field فرعي عند الحاجة.

### قاعدة تشغيلية
- `path` يجب أن يطابق مسار مكون موجود في القوالب (مثل `home.custom-slider`).
- أي component غير قابل للربط بمسار عرض فعلي = `FAIL`.

---

## 6) قواعد استرجاع الإعدادات داخل Twig

يُسمح بالوصول عبر:
- `theme.settings.get('key')`
- مع fallback حيث يلزم.

### قاعدة تشغيلية
- منع الاعتماد على setting غير معرف بدون fallback.

---

## 7) مصفوفة فحص (PASS/WARNING/FAIL)

### PASS
- `twilight.json` موجود وصالح JSON
- الأقسام الأساسية موجودة
- settings/features/components متسقة مع القوالب

### WARNING
- feature معرّف لكن غير مستخدم
- setting معرف دون استخدام

### FAIL
- غياب الملف
- JSON غير صالح
- غياب أقسام أساسية
- مكون مخصص بلا path قابل للربط
- اعتماد في القالب على setting غير معرف بلا fallback

---

## 8) ربط المواصفة بالتنفيذ

تستخدم هذه المواصفة كمدخل لفحوصات:
- Theme Loader Validation
- Runtime Preflight
- Export Gate

المرجع الأعلى عند أي تعارض: docs.salla.dev/421921m0
