# Twilight Global Variables Contract

تاريخ: 2026-02-14
المصدر: https://docs.salla.dev/421938m0
الهدف: ضبط توافق المتغيرات العامة في Twig مع Runtime Context داخل VTDR

---

## 1) المبدأ

Twilight يوفر متغيرات عامة قابلة للاستخدام في أي صفحة Twig.
VTDR يجب أن يبني Runtime Context بحيث يحافظ على هذه المتغيرات الأساسية وعدم كسرها.

---

## 2) المتغيرات الأساسية الحرجة

## `store` (Store)

أمثلة أساسية مذكورة رسميًا:

- `store.id`
- `store.name`
- `store.username`
- `store.description`
- `store.slogan` (اختياري حسب feature)
- `store.logo`
- `store.url`
- `store.api`
- `store.icon`
- `store.contacts`
- `store.social`
- `store.settings`

## `theme` (Theme)

أمثلة أساسية مذكورة رسميًا:

- `theme.id`
- `theme.name`
- `theme.mode` (`live` أو `preview`)
- `theme.is_rtl`
- `theme.translations_hash`
- `theme.color`
- `theme.font` (اختياري)
- `theme.settings`
- `theme.components` (خاص بسياق الصفحة الرئيسية `index`)

---

## 3) قواعد توافق VTDR

### PASS

- توفر جميع الحقول الأساسية المطلوبة في `store` و`theme`.
- احترام `theme.mode` كسياق تشغيل (`preview` داخل VTDR).
- `theme.settings` متوافق مع `twilight.json`.

### WARNING

- حقل اختياري مفقود مع fallback صالح في القالب.
- `theme.components` غير متاح خارج الصفحة التي تتطلبه.

### FAIL

- فقدان حقل مطلوب بدون fallback (`store.api`, `store.url`, ...).
- نوع بيانات غير متوافق مع المتوقع (مثلاً object بدل string).
- سياق page يعتمد على `theme.components` دون وجوده في الصفحة المناسبة.

---

## 4) قواعد بناء Runtime Context

1. يجب أن يحتوي context على `store` و`theme` دائمًا.
2. يجب تطبيع القيم قبل الإرسال للمعاينة (type-safe normalization).
3. عند فقدان قيمة مطلوبة:
   - تسجيل failure في Validation
   - إرجاع رسالة واضحة تربط الحقل المفقود بالصفحة/المكون

---

## 5) أثر مباشر على الفحص قبل التصدير

قبل Export:

- [ ] وجود حقول `store` الأساسية
- [ ] وجود حقول `theme` الأساسية
- [ ] اتساق `theme.settings` مع مفاتيح `twilight.json`
- [ ] اتساق `theme.components` مع الصفحة الرئيسية فقط

---

## 6) ملاحظات عملية

- لا يجب افتراض أن جميع الحقول الاختيارية موجودة دائمًا.
- يفضّل في Twig استخدام fallback عند الوصول للحقول الأقل ثباتًا.
- المرجع النهائي عند التعارض: https://docs.salla.dev/421938m0
