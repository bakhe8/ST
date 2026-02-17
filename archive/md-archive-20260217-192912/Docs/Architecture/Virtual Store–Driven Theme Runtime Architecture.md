Virtual Store–Driven Theme Runtime Architecture

1) المنظور العام (System View)

النظام عبارة عن بيئة تشغيل للثيمات تتمحور حول متجر افتراضي، وتربط بين:

ملفات الثيم (كما هي)

قرارات المتجر (إعدادات + محتوى)

محرك بناء سياق

طبقة معاينة وتشغيل

Theme Files
     │
     ▼
Virtual Store
     │
     ▼
Runtime Context Builder
     │
     ▼
Preview & Operations
     │
     ▼
Validation & Export

2) الطبقات الأساسية (Core Layers)
2.1 Theme Files Layer

الدور

تمثيل الثيم كما هو مكتوب فعليًا (Source of Capabilities)

المحتوى

قوالب العرض (Twig)

الأصول (CSS / JS / Images)

تعريفات العقد (twilight.json بما فيه الإصدار)

الخصائص

تُقرأ مباشرة من النظام

أي تعديل في الملفات ينعكس فورًا على التشغيل

لا تُخزَّن في قاعدة البيانات

2.2 Virtual Store Layer (الطبقة المركزية)

الدور

تمثيل المتجر بوصفه الكيان الذي يغيّر سلوك الثيم

المكونات

Theme Settings State

Page Composition State

Component Customization State

Store Content State (Products, Categories, Media, Texts)

Scenario State (حالات متجر مختلفة)

الناتج

Store Runtime State موحّد

2.3 Runtime Context Builder

الدور

دمج قدرات الثيم مع حالة المتجر الافتراضي لإنتاج Runtime Context

المدخلات

Theme Files

Store Runtime State

العملية

قراءة ما يتيحه الثيم

تطبيق اختيارات المتجر

بناء سياق تشغيل مطابق للاستهلاك

المخرجات

Runtime Context (JSON/Structure جاهزة للعرض)

2.4 Preview & Operations Layer

الدور

تشغيل وعرض نتيجة السياق

المكونات

Theme Renderer (Twig Runtime)

Live Reload Controller

Scenario Switcher

Preview Sandbox

الخصائص

تحديث فوري عند أي تغيير

دعم تعدد السيناريوهات

تشغيل مطابق لما سيحدث بعد التركيب الحقيقي

2.5 Validation & Export Layer

الدور

التأكد من جاهزية الثيم وإخراجه

الوظائف

التحقق من اكتمال التعريفات

التحقق من سلامة التشغيل

ربط النتائج بالإصدار

تجهيز حزمة التصدير

المخرجات

Validation Reports

Exportable Theme Package

3) طبقة الواجهة (UI Layer)
الدور

إدارة المتجر الافتراضي

إدارة المعاينة

تنسيق العمل بين الكود والتخصيص

الوحدات

Theme & Version Selector

Virtual Store Control Panel

Page & Component Composer

Content Manager

Live Preview Panel

Results & Status Panel

المبدأ

الواجهة تدير الاختيارات
ولا تتدخل في منطق الثيم أو السياق

4) طبقة البيانات (Data Layer)
4.1 ما يُخزَّن

Virtual Stores

Store States

Scenarios

Snapshots

Validation Results

Export Records

4.2 ما لا يُخزَّن

ملفات الثيم

قوالب العرض

الأصول

5) التحكم المزدوج (Dual Control Model)

النظام يدعم مسارين متوازيين:

5.1 التحكم عبر المتجر الافتراضي

تعديل الإعدادات

تخصيص الصفحات

ترتيب المكونات

إدارة المحتوى

5.2 التحكم عبر الكود

تعديل ملفات الثيم مباشرة

إعادة تحميل تلقائي

إعادة بناء المعاينة فورًا

كلا المسارين

يعملان على نفس Store Runtime State

يلتقيان في Runtime Context Builder

6) التدفق التشغيلي الكامل (End-to-End Flow)

تحميل الثيم من Theme Files

اختيار/إنشاء متجر افتراضي

ضبط إعدادات المتجر ومحتواه

تعديل الثيم (اختياريًا)

بناء Runtime Context

تشغيل المعاينة

التبديل بين السيناريوهات

التحقق من الجاهزية

تصدير الثيم

7) الخصائص المعمارية للنظام

Version-Aware (الإصدار جزء من الثيم)

Store-Centric (المتجر في المركز)

Live & Iterative

Code-Friendly

UI-Friendly

Non-Opinionated (لا يفرض أسلوب عمل)

8) العلاقة مع منصة سلة

النظام:

يعتمد على ما هو متاح علنًا من سلة

يعكس طريقة تأثير المتجر على الثيم

لا يستبدل منطق المنصة

ولا يحاكيها داخليًا

9) الخلاصة المعمارية النهائية

الثيم يعرّف الإمكانيات
المتجر الافتراضي يقرر الاختيارات
النظام يربط الاثنين
والمعاينة تُظهر النتيجة كما ستعمل فعليًا

هذا التخطيط كامل، مغلق، وقابل للتنفيذ،
وأي توسعة لاحقة (Marketplace، Collaboration، CI…) تُبنى فوقه دون كسر الأساس.