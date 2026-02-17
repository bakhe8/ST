# Twilight SDK Integration Contract

تاريخ: 2026-02-14
المصدر: https://docs.salla.dev/422610m0
الهدف: ضبط كيفية تعامل VTDR مع Twilight JS SDK

---

## 1) تعريف الدور

Twilight JS SDK هو طبقة واجهات JavaScript للتعامل مع Storefront APIs والأحداث داخل الثيم.

في مشروع VTDR:
- **الـ SDK ليس بديلًا عن Runtime Context Builder**.
- **الـ SDK يُستخدم كطبقة تفاعل داخل المعاينة/الثيم** بعد تجهيز السياق.

---

## 2) قواعد دمج إلزامية

1. داخل ثيمات Twilight لا نعيد تحميل SDK يدويًا (يتم حقنه عبر المحرك).
2. لا نستدعي `salla.init()` داخل بيئة Twilight القياسية (يتم تلقائيًا).
3. نسمح باستخدام:
   - `salla.config.get()` للقراءة
   - `salla.config.set()` للإعدادات المحدودة اللازمة للثيم
4. التغييرات التشغيلية الجوهرية (state ownership) تبقى في Virtual Store State داخل VTDR.

---

## 3) حدود المسؤولية بين VTDR وSDK

### VTDR مسؤول عن:
- بناء Runtime Context
- إدارة Store State
- Validation/Export
- محاكاة السيناريوهات

### Twilight SDK مسؤول عن:
- عمليات الواجهة التفاعلية (Cart, Wishlist, Auth, ...)
- الاشتراك بالأحداث event-driven behavior
- استدعاءات storefront endpoints من داخل الثيم

---

## 4) سطح APIs المهم لمشروعك

بحسب Overview، المجالات الأساسية:
- Auth
- Cart
- Comments
- Currency
- Order
- Product
- Profile
- Rating
- Wishlist
- Loyalty
- Booking

تطبيق MVP:
- ابدأ بـ Cart + Product + Wishlist + Auth events فقط.
- باقي المجالات تدخل تدريجيًا بعد ثبات Runtime Core.

---

## 5) Contract للأحداث داخل المعاينة

1. أحداث SDK لا يجب أن تعدّل Core State مباشرة دون طبقة وسيطة.
2. أي event مؤثر يُسجل في Event Log داخل VTDR.
3. فشل event (مثل add to cart failure) يجب أن يظهر في Results Panel.
4. نضيف تطابقًا بين:
   - SDK event name
   - Runtime snapshot id
   - page/scenario الحالية

---

## 6) مبادئ أمان واستقرار

1. منع أي استدعاء SDK يعتمد على بيانات ناقصة من Context.
2. تفعيل نمط debug فقط في development عبر `salla.config.set('debug', true)` عند الحاجة.
3. لا يتم hardcode لمعرفات حساسة داخل القوالب.

---

## 7) أثر مباشر على API_SPEC الداخلي

للتوافق مع SDK usage patterns، يوصى في VTDR APIs بـ:
- Endpoint لحالة runtime الحالية
- Endpoint لتسجيل أحداث المعاينة (event log)
- Endpoint لربط event بفشل/نجاح التحقق

---

## 8) Gate فحص قبل التصدير

قبل Export:
- [ ] لا يوجد تحميل SDK يدوي مكرر داخل الثيم
- [ ] لا يوجد `salla.init()` مكرر في Twilight runtime
- [ ] كل عمليات SDK الحرجة لديها معالجة نجاح/فشل
- [ ] لا يوجد اعتماد على config keys غير متاحة

---

## 9) روابط مرجعية متابعة

- Overview: https://docs.salla.dev/422610m0
- Events: https://docs.salla.dev/422611m0
- Configuration: https://docs.salla.dev/422612m0
- Storage: https://docs.salla.dev/422613m0
- Helpers: https://docs.salla.dev/422617m0
