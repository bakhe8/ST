# Theme Directory Structure Compliance Spec

تاريخ: 2026-02-14
المصدر الرسمي: https://docs.salla.dev/421918m0
الهدف: تعريف قواعد توافق بنية ملفات الثيم داخل VTDR

---

## 1) المبدأ

بنية المجلدات في ثيمات Salla/Twilight ليست شكلية فقط؛
هي جزء من عقد التشغيل والمعاينة والنشر.

أي انحراف جوهري عن البنية القياسية يجب رصده في مرحلة preflight.

---

## 2) البنية المرجعية القياسية (Typical)

من الجذر:

- `src/`
  - `assets/`
    - `images/`
    - `js/`
    - `styles/`
  - `locales/`
    - `ar.json`
    - `en.json`
  - `views/`
    - `components/`
      - `footer/`
      - `header/`
      - `home/`
      - `product/`
      - `comments.twig`
    - `layouts/`
      - `master.twig`
    - `pages/`
      - `cart.twig`
      - `index.twig`
      - `loyalty.twig`
      - `page-single.twig`
      - `thank-you.twig`
      - `blog/`
      - `brands/`
      - `customer/`
      - `orders/`
      - `product/`

> ملاحظة: هذه بنية "typical"؛ قد توجد اختلافات طفيفة لكن لا يجب أن تكسر مسارات التشغيل الأساسية.

---

## 3) قواعد التوافق في VTDR

### PASS

- وجود `src/views/layouts/master.twig`
- وجود `src/views/pages/index.twig`
- وجود `src/assets/js` و`src/assets/styles`
- وجود `src/locales` على الأقل

### WARNING

- غياب أحد ملفات الصفحات الثانوية (مثل loyalty/blog...) مع بقاء المسار الأساسي سليمًا.
- وجود بنية بديلة منطقية مع mapping واضح في runtime.

### FAIL

- غياب `src` أو `views` أو `master.twig`
- غياب نقطة دخول الصفحة الرئيسية
- غياب بنية الأصول اللازمة للتشغيل (js/styles)
- مسارات لا يمكن ربطها مع ما يصرّح به `twilight.json`

---

## 4) ربط البنية مع twilight.json

1. أي `path` في `components` داخل `twilight.json` يجب أن يكون قابلًا للربط بمسار عرض فعلي داخل `src/views`.
2. أي feature/components معلنة يجب أن تملك تمثيلًا تشغيليًا واقعيًا أو fallback.

---

## 5) أثر مباشر على مراحل المشروع

- Theme Loader: يتحقق من البنية قبل أي parsing متقدم.
- Runtime Builder: يرفض التشغيل عند failure بنيوي.
- Validation/Export: يمنع التصدير إذا كانت البنية غير قابلة للتشغيل.

---

## 6) قاعدة الحسم

عند التعارض بين بنية داخلية مفترضة وبنية موصى بها رسميًا:
المتطلب الرسمي في docs.salla.dev يتقدم.
