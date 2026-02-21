# Twilight Twig Helpers & Filters Contract

تاريخ: 2026-02-14
المصدر: https://docs.salla.dev/421929m0#helpers
الهدف: توحيد استخدام Twilight helpers/filters داخل VTDR

---

## 1) Helpers المعتمدة

Helpers المتاحة رسميًا:

- `is_current_url`
- `is_page`
- `link`
- `old`
- `pluralize`
- `page`
- `trans`

### قواعد استخدام

1. استخدم `is_page` للتحكم الشرطي المرتبط بالصفحة بدل مقارنة نصوص غير موثوقة.
2. استخدم `link`/`page` لبناء الروابط بدل دمج URL يدويًا.
3. استخدم `trans` و`pluralize` لكل النصوص القابلة للترجمة.
4. استخدم `old` فقط في سياق النماذج وإعادة التعبئة بعد validation.

---

## 2) Filters المعتمدة

Filters المتاحة رسميًا:

- `asset`
- `camel_case`
- `cdn`
- `currency`
- `date`
- `is_placeholder`
- `kebab_case`
- `money`
- `number`
- `snake_case`
- `studly_case`
- `time_ago`

### قواعد استخدام

1. استخدم `asset` و`cdn` فقط للروابط الخاصة بملفات الثيم/الأصول.
2. استخدم `money/currency` بدل تنسيق عملة يدوي.
3. استخدم `date` و`time_ago` لضمان احترام اللغة/السياق.
4. استخدم `number` عند الحاجة للتوافق مع العرض العربي للأرقام.
5. استخدم `is_placeholder` قبل معالجات الصور الحساسة.

---

## 3) قواعد توافق VTDR

### PASS

- لا يوجد helper/filter غير موثق رسميًا في القوالب الحرجة.
- كل النصوص المعروضة للتاجر تستخدم `trans`/`pluralize` حيث يلزم.
- الروابط تعتمد على `link`/`page`/`asset`/`cdn`.

### WARNING

- وجود نصوص ثابتة قابلة للترجمة لكن بدون `trans`.
- وجود تنسيق عملة/تاريخ يدوي رغم توفر filter رسمي.

### FAIL

- استخدام helper/filter غير مدعوم في Twilight.
- اعتماد القالب على سلوك مفقود بسبب helper خاطئ الاسم.

---

## 4) ملاحظات تنفيذية

1. هذا العقد يخص سلوك القوالب (Twig layer) فقط.
2. لا يغيّر Ownership الحالة في VTDR.
3. عند تعارض أي استخدام مع docs.salla.dev، المرجع الرسمي يتقدّم.
