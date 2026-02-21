API_SPEC

Theme Development Runtime API

1. الهدف (Objective)

توفير واجهة برمجية موحّدة تمكّن:

واجهة التحكم (UI)

محرك المعاينة (Runtime)

محرر الثيم

مدير السيناريوهات

من التعامل مع البيانات، الثيمات، والإعدادات بطريقة ديناميكية تحاكي سلوك سلة أثناء تطوير الثيم.

2. المبادئ العامة

API حالة-محوره (State-driven)

API محايد تجاه الثيم

API لا يفرض منطق عرض

API مصمم للتطوير لا التشغيل التجاري

3. التقسيم العام للـ API
   /api
   ├─ system
   ├─ themes
   ├─ runtime
   ├─ data
   ├─ scenarios
   ├─ preview
   └─ export

4. System API
   4.1 معلومات النظام
   GET /api/system/info

Response

{
"version": "2.0",
"environment": "development",
"activeRuntime": true
}

5. Themes API
   5.1 تسجيل ثيم
   POST /api/themes

{
"name": "Raed Theme",
"version": "1.0.0",
"entry": "/themes/raed"
}

5.2 جلب قائمة الثيمات
GET /api/themes

5.3 جلب تعريف الثيم (Contract)
GET /api/themes/{themeId}/contract

Response

{
"features": [],
"settings": [],
"components": []
}

6. Runtime API
   6.1 تفعيل ثيم
   POST /api/runtime/theme

{
"themeId": "raed",
"version": "1.0.0"
}

6.2 تحديث إعدادات الثيم
PUT /api/runtime/theme/settings

{
"header_is_sticky": true,
"footer_is_dark": false
}

6.3 تحديث إعدادات كومبوننت
PUT /api/runtime/components/{componentPath}

{
"settings": {
"title": "عنوان تجريبي",
"products": ["p1", "p2"]
}

7. Data API
   7.1 جلب كيان بيانات
   GET /api/data/{entity}/{id}

أمثلة:

/api/data/products/p1

/api/data/collections/c1

7.2 إنشاء كيان بيانات
POST /api/data/{entity}

{
"payload": { }
}

7.3 تحديث كيان بيانات
PUT /api/data/{entity}/{id}

7.4 ربط بيانات بكومبوننت
POST /api/data/bind

{
"componentPath": "home.products-slider",
"source": "collection",
"sourceId": "featured_products"
}

8. Scenarios API (Profiles)
   8.1 إنشاء سيناريو
   POST /api/scenarios

{
"name": "Electronics Store",
"store": "store_1"
}

8.2 تفعيل سيناريو
POST /api/scenarios/activate

{
"scenarioId": "electronics"
}

8.3 تحديث سيناريو
PUT /api/scenarios/{id}

8.4 جلب الحالة الكاملة للسيناريو
GET /api/scenarios/{id}/state

9. Preview API
   9.1 توليد معاينة صفحة
   POST /api/preview/render

{
"page": "home",
"viewport": "desktop"
}

Response

{
"html": "<html>...</html>"
}

9.2 إعادة تحميل المعاينة
POST /api/preview/reload

10. Export API
    10.1 تصدير ثيم
    POST /api/export/theme

{
"themeId": "raed",
"version": "1.0.0"
}

Response

{
"package": "theme-raed.zip",
"format": "salla-compatible"
}

10.2 تصدير إعدادات افتراضية
GET /api/export/theme/{themeId}/defaults

11. Runtime State API
    11.1 الحالة الحالية
    GET /api/runtime/state

{
"theme": "raed",
"scenario": "electronics",
"page": "home"
}

12. Events (اختياري – داخلي)
    POST /api/runtime/event

{
"type": "SETTING_CHANGED",
"source": "theme",
"key": "header_is_sticky"
}

13. العلاقة مع الواجهة (UI)

UI لا تبني منطق

UI ترسل أوامر فقط

API يعيد الحالة

Runtime يعيد المعاينة

14. العلاقة مع الثيم

الثيم لا يستدعي API مباشرة

Runtime يحقن Context كامل للثيم

الثيم يعمل كما لو أنه داخل سلة

15. الخلاصة التنفيذية

هذا الـ API:

يمكّن بناء محرر ثيمات مطابق لسلة

يسمح بتعدد السيناريوهات

يفصل البيانات عن العرض

يسهّل تصدير الثيم لاحقًا

يصلح كأساس لأي توسعة مستقبلية
