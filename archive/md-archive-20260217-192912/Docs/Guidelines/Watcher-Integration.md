# Watcher Integration Guide

تاريخ: 2026-02-14
الغرض: تفعيل مراقبة تغييرات الثيمات (Twilight Watcher plugin) تلقائيًا في منصة VTDR

---

## 1) المتطلبات

- وجود ملف webpack.config.js في كل ثيم
- تثبيت حزمة @salla.sa/twilight/watcher.js

---

## 2) خطوات التفعيل التلقائي

1. عند إضافة أو استيراد ثيم جديد للمنصة:
   - تحقق من وجود ملف webpack.config.js
   - إذا لم يكن موجودًا، أنشئ ملفًا جديدًا بالحد الأدنى المطلوب
2. أضف الكود التالي تلقائيًا إلى قسم plugins:

```js
const ThemeWatcher = require('@salla.sa/twilight/watcher.js');
// ...existing code...
plugins: [
    new ThemeWatcher(),
    // ...existing plugins...
],
```

3. تأكد من تثبيت الحزمة:

```bash
npm install @salla.sa/twilight/watcher.js --save-dev
```

4. اربط نظام المعاينة الحية في المنصة مع Webpack ليعكس التغييرات فورًا.

---

## 3) السلوك التلقائي المطلوب

- عند تعديل أي ملف في الثيم (Twig, JS, CSS, twilight.json):
  - يقوم ThemeWatcher برصد التغيير
  - يتم تحديث المعاينة الحية تلقائيًا
  - تظهر رسالة "تم تحديث المعاينة بناءً على التغيير"

---

## 4) ملاحظات عملية

- يجب فحص وجود ThemeWatcher في كل ثيم عند عملية preflight
- إذا لم يكن موجودًا، يتم إضافته تلقائيًا
- يمكن تخصيص رسالة التحديث حسب احتياج المطور

---

> هذا الدليل جزء من Docs/Documentation-Alignment-Map.md ويجب تحديثه عند أي تغيير في آلية المراقبة.
