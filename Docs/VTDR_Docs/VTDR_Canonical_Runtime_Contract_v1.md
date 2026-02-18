# VTDR Canonical Runtime Contract v1

تاريخ الإصدار: 2026-02-18  
النطاق: عقد تشغيل موحد لتمكين أي ثيم Salla من العمل داخل VTDR دون تعديل ملفات الثيم.

## 1) الهدف التشغيلي

تثبيت طبقة Runtime Host موحدة بحيث يكون:
- VTDR مسؤولًا عن السياق التشغيلي والـAPI والـSDK bridge.
- الثيم مسؤولًا عن العرض (Twig/CSS/JS) فقط.

بالتالي يمكن تشغيل ثيمات متعددة على متاجر متعددة بنفس منطق موحد.

## 2) الحدود المعمارية (Boundary)

- `Theme`:
  - قوالب Twig + أصول العرض.
  - لا يحمل منطق ربط بيئة VTDR.

- `VTDR Runtime Host`:
  - بناء `RuntimeContext`.
  - تطبيع البيانات (Products/Categories/Brands/Blog/Customer/Cart/Checkout/Orders).
  - ربط المسارات preview وتحويل التنقل الداخلي.
  - حقن وتشغيل `sdk-bridge.js`.

## 3) نقاط الدخول الإلزامية

- Theme discovery/sync:
  - `POST /api/themes/sync`
  - `GET /api/themes`

- Store lifecycle:
  - `POST /api/stores`
  - `PATCH /api/stores/:id` (ربط `themeId`, `themeVersionId`)

- Simulator APIs (حد أدنى):
  - `GET /api/v1/products`
  - `GET /api/v1/menus/header`
  - `GET /api/v1/theme/components`
  - `GET /api/v1/theme/settings`

- Preview runtime:
  - `GET /preview/:storeId/:themeId/:version?page=index`
  - `GET /preview/:storeId/:themeId/:version/*`
  - دعم المسارات المحلية المسبوقة باللغة مثل `/ar/products`.

- Runtime bridge:
  - `GET /sdk-bridge.js`

## 4) قواعد التنقل (Navigation Contract)

- أي رابط متجر (Home/Products/Categories/Brands/Blog) يجب أن يبقى داخل نطاق:
  - `/preview/:storeId/:themeId/:version/...`
- الروابط المحلية (`localhost`, `127.0.0.1`) تعامل كرابط متجر داخل بيئة المعاينة.
- في حال فشل SDK أو عدم جاهزيته، يوجد Navigation Shim احتياطي داخل HTML المعاينة.

## 5) قواعد التحقق من الصفحة (Render Contract)

لكل مسار ضمن العقد، يجب أن يحقق:
- HTTP 200.
- وجود `<html` في الاستجابة.
- عدم وجود مؤشرات فشل Rendering مثل:
  - `Renderer Error`
  - `Render Error`
  - `Preview rendering failed`
- وجود حقن `sdk-bridge.js` داخل صفحة المعاينة.

## 6) التحقق الآلي الرسمي (Source of Truth)

تم اعتماد اختبار تكاملي موحد كمرجع تنفيذي مباشر للعقد:

- `apps/api/src/integration/theme-runtime-contract.integration.test.ts`

هذا الاختبار:
- يكتشف كل الثيمات بعد sync.
- ينشئ متجرًا لكل ثيم.
- يربط المتجر بالثيم/الإصدار.
- يمر على مسارات preview الأساسية + مسار لغة.
- يتحقق من جاهزية APIs الأساسية وsdk bridge.

أمر التشغيل المحلي:
- `npm run test:contract:theme-runtime`

## 7) ما يضمنه هذا العقد

- عدم حبس المنصة على ثيم واحد.
- فصل منطق العرض عن منطق التشغيل.
- قابلية توسع مباشرة عند إضافة ثيمات جديدة.
- كشف أي انكسار توافق مبكرًا عبر الاختبار الآلي.
