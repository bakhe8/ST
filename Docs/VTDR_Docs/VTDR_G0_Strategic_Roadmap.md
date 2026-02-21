# VTDR – G0: خارطة الطريق الاستراتيجية نحو الهدف الفعلي

> **الإصدار**: 1.0
> **التاريخ**: 2026-02-21
> **المنهجية**: تحقق عميق من الكود + مقارنة بمصادر سلة الرسمية (theme-raed + docs.salla.dev)
> **الهدف المُعلَن**: منصة مطابقة لسلة تستهدف استعراض وبناء ثيمات متاجر سلة باحترافية عالية — **بدون الاتصال بمنصة سلة الفعلية**

---

## الفهرس

1. [تقييم الوضع الحالي](#١-تقييم-الوضع-الحالي)
2. [الفجوات المكتشفة من المصادر الرسمية](#٢-الفجوات-المكتشفة-من-المصادر-الرسمية)
3. [خارطة الطريق G1–G4](#٣-خارطة-الطريق-g1g4)
4. [الأولويات التقنية التفصيلية](#٤-الأولويات-التقنية-التفصيلية)
5. [مصادر التحقق](#٥-مصادر-التحقق)

---

## ١. تقييم الوضع الحالي

### ١.١ ملخص تنفيذي

بعد التحقق المباشر من الكود ومقارنته بـ `theme-raed-master` (المصدر الرسمي المفتوح لكل متجر سلة) وبتوثيق `docs.salla.dev` الشامل، النتيجة:

| المحور                  | الحالة                                    | النسبة |
| ----------------------- | ----------------------------------------- | ------ |
| دقة RuntimeContext      | مطابق بنسبة عالية لكن بفجوات محددة        | ~85%   |
| أنواع الصفحات المدعومة  | 20+ صفحة مدعومة، صفحة البحث غائبة         | ~90%   |
| Twig filters/functions  | معظمها موجود، عدة فلاتر دوال مفقودة       | ~75%   |
| نظام Hooks              | طُبِّق hook واحد فقط (body:end) من 25+    | ~4%    |
| Hot Reload              | غير موجود — يستلزم manual browser refresh | 0%     |
| محاكاة العميل المُسجَّل | دائماً guest، لا يمكن محاكاة تسجيل الدخول | 0%     |

### ١.٢ ما يعمل بشكل جيد

- **تقديم Twig حقيقي**: RendererService يُشغّل محرك Twig.js كاملاً مع Context غني
- **بنية المتجر**: store.name، store.currency، store.locale، store.social، store.languages[]، store.currencies[] — كلها مُعبَّأة
- **المنتج الفردي**: normalizeProductForTemplate يغطي تقريباً كل حقول Salla (options، variants، donation، notify_availability، وغيرها)
- **20+ نوع صفحة**: home، product/single، categories، brands، blog، cart، checkout، customer/\*، wishlist، orders، notifications، compare، loyalty، landing، ...
- **القائمة والشعار**: menus[]، store.logo مُعبَّأة من DataEntity
- **التسليم الكامل**: buildContext → hydratePreviewEntities → bindPreviewContext → renderPreviewWithFallback — خط أنابيب مكتمل
- **SeederService**: يُلقّم بيانات أولية تلقائياً إذا كان المتجر فارغاً (كل 30 ثانية)
- **SDK Bridge**: يُحقن twilight.min.js + sdk-bridge.js في كل صفحة

### ١.٣ الأخطاء البرمجية المؤكدة في الكود

| المرجع | الملف                   | السطر                                                                                         | الوصف                                               |
| ------ | ----------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| B1-02  | `composition-engine.ts` | يُجلَب `blog_articles` + `blog_articles` (نسختان من نفس الاستعلام، النسخة الجمع دائماً فارغة) | استعلام مكرر بدون فائدة                             |
| B1-04  | `composition-engine.ts` | `description: storeData.description \|\| storeData.description`                               | self-reference — لا يقع أبداً على القيمة الاحتياطية |

---

## ٢. الفجوات المكتشفة من المصادر الرسمية

### ٢.١ Twig Filters المفقودة

المصدر: `docs.salla.dev/421929m0` (Twilight Filters & Functions)

| الفلتر             | في VTDR            | في سلة الرسمي  | ملاحظة                    |
| ------------------ | ------------------ | -------------- | ------------------------- |
| `\|date`           | غير موجود          | ✅ موجود       | يدعم الأرقام العربية      |
| `\|studly_case`    | غير موجود          | ✅ موجود       | تحويل النص إلى StudlyCase |
| `\|kabab_case`     | موجود (خطأ إملائي) | `\|kebab_case` | اسم خاطئ في الكود         |
| `\|time_ago`       | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|currency`       | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|money`          | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|asset`          | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|cdn`            | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|is_placeholder` | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|snake_case`     | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|camel_case`     | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|trans`          | ✅ موجود           | ✅ موجود       | مطابق                     |
| `\|number`         | ✅ موجود           | ✅ موجود       | مطابق                     |

### ٢.٢ Twig Functions المفقودة

المصدر: `docs.salla.dev/421929m0`

| الدالة             | في VTDR                       | في سلة الرسمي | ملاحظة                     |
| ------------------ | ----------------------------- | ------------- | -------------------------- |
| `is_current_url()` | غير موجود (لدينا `is_link()`) | ✅ موجود      | تحقق إذا كان الرابط الحالي |
| `page()`           | غير موجود                     | ✅ موجود      | استرجاع بيانات صفحة معينة  |
| `is_page()`        | ✅ موجود                      | ✅ موجود      | مطابق                      |
| `link()`           | ✅ موجود                      | ✅ موجود      | مطابق                      |
| `old()`            | ✅ موجود                      | ✅ موجود      | مطابق                      |
| `trans()`          | ✅ موجود                      | ✅ موجود      | مطابق                      |
| `pluralize()`      | ✅ موجود                      | ✅ موجود      | مطابق                      |

### ٢.٣ سياق سلة العربة (cart) — حقول مفقودة

المصدر: `docs.salla.dev/422575m0` (Cart Page Variables)

| الحقل                                      | في VTDR    | في سلة الرسمي |
| ------------------------------------------ | ---------- | ------------- |
| `cart.items`                               | ✅         | ✅            |
| `cart.count`                               | ✅         | ✅            |
| `cart.sub_total`                           | ✅         | ✅            |
| `cart.free_shipping_bar.has_free_shipping` | ❌ مفقود   | ✅            |
| `cart.free_shipping_bar.remaining`         | ❌ مفقود   | ✅            |
| `cart.real_shipping_cost`                  | ❌ مفقود   | ✅            |
| `cart.coupon`                              | ❌ مفقود   | ✅            |
| `cart.total`                               | يحتاج تحقق | ✅            |
| `cart.shipping`                            | يحتاج تحقق | ✅            |

### ٢.٤ نظام Hooks — الفجوة الكبرى

المصدر: `docs.salla.dev/422552m0` (Twilight Hooks)

VTDR يُنفِّذ حالياً hook **واحد فقط** (`body:end`) من أصل **25+ hook** رسمي:

**Hooks الرأس (Head)**:

- `head:start` — بداية `<head>`
- `head` — داخل `<head>`
- `head:end` — نهاية `<head>`

**Hooks الجسم (Body)**:

- `body:classes` — إضافة classes إلى `<body>`
- `body:start` — بداية `<body>`
- `body:end` — ✅ **الوحيد المُنفَّذ**

**Hooks العميل**:

- `customer:header_dropdown`
- `customer:auth_extra_links`
- `customer:auth_extra_fields`
- `customer:account_mobile_menu`

**Hooks المنتج**:

- `product:card.before`
- `product:card.after`
- `product:card.info.start`
- `product:card.info.end`
- `product:size-guide`

**Hooks العربة**:

- `cart:item_before`
- `cart:item_after`
- `cart:coupon`
- `cart:summary`

**Hooks شكر على الطلب**:

- `thank-you:order_summary.before`
- `thank-you:order_summary.after`

**Hooks العلامات التجارية**:

- `brands:header`
- `brands:footer`

**Hooks المكوّنات**:

- `component:{path}.before`
- `component:{path}.after`
- `component:{path}.start`
- `component:{path}.end`

### ٢.٥ صفحات غير مدعومة

| الصفحة                       | في VTDR                                | في سلة                              |
| ---------------------------- | -------------------------------------- | ----------------------------------- |
| صفحة البحث (`/search`)       | ❌ لا template، لا routing، لا context | ✅                                  |
| نتائج البحث (search context) | ❌                                     | ✅ `search.query`، `search.results` |

---

## ٣. خارطة الطريق G1–G4

### المبدأ التوجيهي

> **كل مرحلة تُحقق قيمة مستقلة قابلة للقياس** — لا تنتظر مرحلة أخرى.

```
G1 ─── إصلاح الدقة الجوهرية (الحقيقة لا الوهم)
G2 ─── إكمال سطح Twig (مطابقة 100% للبيئة)
G3 ─── تجربة المطوّر (UX المنصة الاحترافية)
G4 ─── مطابقة Salla الكاملة (الهدف النهائي)
```

---

### G1 — إصلاح الدقة الجوهرية

> **الهدف**: لا يوجد بيانات خاطئة أو مفقودة تُخفي مشاكل في الثيم.

**زمن الإنجاز المتوقع**: 2–3 أيام عمل

| المهمة                                                                   | الملف                                          | الأثر                  |
| ------------------------------------------------------------------------ | ---------------------------------------------- | ---------------------- |
| G1-01: إصلاح B1-02 — حذف استعلامات blog_articles/blog_categories المكررة | `composition-engine.ts`                        | بيانات أكثر نظافة      |
| G1-02: إصلاح B1-04 — إصلاح self-reference في description                 | `composition-engine.ts`                        | وصف المتجر يظهر صحيحاً |
| G1-03: إضافة cart.free_shipping_bar                                      | `preview-context-service.ts`                   | عربة أكثر اكتمالاً     |
| G1-04: إضافة cart.real_shipping_cost                                     | `preview-context-service.ts`                   | سعر الشحن الحقيقي      |
| G1-05: إضافة cart.coupon                                                 | `preview-context-service.ts`                   | الكوبون في العربة      |
| G1-06: تحسين debug.twig — طباعة context كاملاً                           | `theme-raed-master/src/views/pages/debug.twig` | أداة تحقق فعّالة       |

**ملاحظة debug.twig**: الملف حالياً شبه فارغ (سطران فقط). يجب تحويله إلى أداة تفريغ context شاملة لمقارنة VTDR بسلة الرسمي.

---

### G2 — إكمال سطح Twig

> **الهدف**: أي ثيم يعمل على سلة الحقيقية يعمل على VTDR بدون تعديل.

**زمن الإنجاز المتوقع**: 3–5 أيام عمل

| المهمة                                                 | الملف                                              | الأثر                         |
| ------------------------------------------------------ | -------------------------------------------------- | ----------------------------- |
| G2-01: تطبيق `\|date` مع دعم الأرقام العربية           | `renderer-service.ts`                              | ثيمات تعرض التواريخ بشكل صحيح |
| G2-02: تطبيق `\|studly_case`                           | `renderer-service.ts`                              | مطابقة كاملة لفلاتر سلة       |
| G2-03: إضافة `is_current_url()`                        | `renderer-service.ts`                              | Navigation active states      |
| G2-04: إضافة `page()`                                  | `renderer-service.ts`                              | جلب بيانات صفحات ديناميكياً   |
| G2-05: إضافة صفحة البحث — template + routing + context | `preview-context-service.ts` + `theme-raed-master` | صفحة البحث تعمل               |
| G2-06: إعادة تسمية `kabab_case` إلى `kebab_case`       | `renderer-service.ts`                              | مطابقة الاسم الرسمي           |

---

### G3 — تجربة المطوّر (DX)

> **الهدف**: مطوّر الثيم يرى التغييرات فورياً بدون manual refresh.

**زمن الإنجاز المتوقع**: 4–7 أيام عمل

| المهمة                     | التفاصيل                                                                     | الأثر                               |
| -------------------------- | ---------------------------------------------------------------------------- | ----------------------------------- |
| G3-01: Hot Reload للثيمات  | File watcher على مجلد `src/views/` + WebSocket يُرسل إشارة إلى المتصفح       | المطوّر يرى الثيم يتحدث فورياً      |
| G3-02: محاكاة تسجيل الدخول | واجهة في UI لتفعيل "وضع العميل المُسجَّل" + normalizeRuntimeUser يقرأ الحالة | اختبار صفحات customer/\* بشكل حقيقي |
| G3-03: تحسين debug page    | صفحة debug مخصصة في UI تعرض context الحالي بشكل منسق                         | تشخيص أسرع                          |

---

### G4 — مطابقة Hooks نظام سلة الكامل

> **الهدف**: الثيمات التي تستخدم `{% hook "head" %}` أو `{% hook "product:card.before" %}` تعمل كما في سلة.

**زمن الإنجاز المتوقع**: 5–10 أيام عمل

| المهمة                                  | الأثر                                    |
| --------------------------------------- | ---------------------------------------- |
| G4-01: تطبيق head:start، head، head:end | CSS/JS مُحقَّن من Hooks يظهر في `<head>` |
| G4-02: تطبيق body:classes، body:start   | Classes ديناميكية على `<body>`           |
| G4-03: تطبيق customer:\* hooks          | قائمة المستخدم وصفحات الحساب             |
| G4-04: تطبيق product:\* hooks           | cards المنتجات القابلة للتخصيص           |
| G4-05: تطبيق cart:\* hooks              | عربة التسوق القابلة للتخصيص              |
| G4-06: تطبيق thank-you:\* hooks         | صفحة الشكر القابلة للتخصيص               |
| G4-07: تطبيق component:{path}.\* hooks  | Hooks المكوّنات الديناميكية              |

---

## ٤. الأولويات التقنية التفصيلية

### ٤.١ G1-03 إلى G1-05: حقول العربة المفقودة

**الملف**: `packages/engine/src/rendering/preview-context-service.ts`
**الدالة**: `normalizeCartForTemplate`

يجب إضافة:

```typescript
free_shipping_bar: {
    has_free_shipping: false,       // يتغير بناءً على إعدادات المتجر
    remaining: 0,                   // المبلغ المتبقي للشحن المجاني
    progress: 100                   // نسبة التقدم
},
real_shipping_cost: 0,              // تكلفة الشحن الفعلية
coupon: null                        // الكوبون المُطبَّق (null إذا لم يُطبَّق)
```

**مصدر البيانات**: يمكن قراءتها من DataEntity للمتجر، أو استخدام قيم افتراضية منطقية.

### ٤.٢ G2-01: فلتر `|date` مع الأرقام العربية

**الملف**: `packages/engine/src/rendering/renderer-service.ts`

سلة تدعم `|date("Y/m/d")` مع تحويل الأرقام إلى عربية عند locale=ar.

```typescript
env.addFilter("date", (value: any, format: string = "Y-m-d") => {
  const date = new Date(value);
  const formatted = formatDate(date, format); // بناء تنسيق مخصص
  // إذا كانت locale عربية: تحويل الأرقام
  const storeCtx = getStoreContext(); // من AsyncLocalStorage
  if (storeCtx?.locale?.startsWith("ar")) {
    return formatted.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
  }
  return formatted;
});
```

### ٤.٣ G2-03: دالة `is_current_url()`

**الملف**: `packages/engine/src/rendering/renderer-service.ts`

```typescript
env.addGlobal("is_current_url", (url: string) => {
  const ctx = getRenderContext(); // من AsyncLocalStorage
  const currentUrl = ctx?.page?.url || "";
  return currentUrl.includes(url) || url.includes(currentUrl);
});
```

**ملاحظة**: VTDR لديه حالياً `is_link()` لكنها ليست نفس الدالة.

### ٤.٤ G3-01: Hot Reload

**الملية التقنية**:

1. **في الـ API** (`apps/api`): استخدام `chokidar` لمراقبة مجلد الثيم
2. **عبر WebSocket**: إرسال رسالة `{ type: 'theme-reload' }` عند تغيير أي ملف `.twig` أو `.json`
3. **في الـ UI** (`apps/ui`): الـ iframe يستمع للرسالة ويعيد تحميل نفسه

```
theme/src/views/**/*.twig
         ↓ (chokidar)
API WebSocket → RELOAD EVENT
         ↓
UI iframe.contentWindow.location.reload()
```

### ٤.٥ G1-06: تحسين debug.twig

الملف حالياً:

```twig
<h1>Hello World</h1>
<p>Store: {{ store.name }}</p>
```

يجب أن يصبح أداة تفريغ شاملة تعرض:

- كل مفاتيح context المتاحة
- بنية store كاملة
- بنية page.components
- المتغيرات المُحقَّنة (product/category/brand حسب الصفحة)
- theme.settings الحالية
- translations المتاحة

---

## ٥. مصادر التحقق

### ٥.١ المصادر الرسمية المُستخدَمة في هذا التقرير

| المصدر                                                                  | الاستخدام                                                               |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `packages/themes/theme-raed-master/`                                    | المصدر الرسمي الأول: theme-raed هو أساس كل متجر سلة جديد (مفتوح المصدر) |
| `packages/themes/theme-raed-master/src/views/pages/product/single.twig` | 83 سطر تعليق يوثّق كل متغيرات منتج سلة                                  |
| `docs.salla.dev/421929m0`                                               | Twilight Filters & Functions الرسمي                                     |
| `docs.salla.dev/422552m0`                                               | Twilight Hooks الرسمي (25+ hook)                                        |
| `docs.salla.dev/422575m0`                                               | Cart Page Variables الرسمي                                              |
| `docs.salla.dev/422561m0`                                               | Single Product Variables الرسمي                                         |
| `docs.salla.dev/llms.txt`                                               | فهرس شامل لـ 408+ صفحة توثيق رسمية                                      |

### ٥.٢ منهجية التحقق الموصى بها

1. **theme-raed كمرجع أول**: كل تعليق في ملفات `.twig` في `theme-raed-master` هو حقيقة مباشرة من سلة
2. **llms.txt كخارطة**: الفهرس يعطي URLs لكل صفحة توثيق — يُستخدَم لاستهداف الصفحات حسب الأولوية
3. **Cloud mocks كتحقق بنية**: صفحات مثل `docs.salla.dev/16603963e0` تعرض بنية responses الفعلية في "Try it out"
4. **الكود كقاضٍ نهائي**: عند التعارض، الكود في `preview-context-service.ts` هو الحقيقة الحالية

### ٥.٣ الصفحات ذات الأولوية للتحقق القادم (من llms.txt)

| الصفحة           | URL                       | السبب                        |
| ---------------- | ------------------------- | ---------------------------- |
| Global Variables | `docs.salla.dev/421938m0` | المتغيرات العامة لكل الصفحات |
| Product Listing  | `docs.salla.dev/422559m0` | متغيرات صفحة تصفح المنتجات   |
| Customer Profile | `docs.salla.dev/422562m0` | متغيرات صفحات العميل         |
| Blog Listing     | `docs.salla.dev/422567m0` | متغيرات قائمة المدونة        |
| Search Page      | يحتاج تحديد               | لا context حالياً في VTDR    |
| Wishlist         | يحتاج تحديد               | صفحة المفضلة                 |
| Checkout         | يحتاج تحديد               | صفحة الدفع                   |

---

## ملخص الإجراءات الفورية (الأسبوع القادم)

```
اليوم 1-2: G1 — إصلاح الأخطاء البرمجية + حقول العربة + debug.twig
اليوم 3-4: G2 — date filter + studly_case + is_current_url() + page()
اليوم 5  : G2 — صفحة البحث (template + routing + context)
اليوم 6-7: G3 — Hot Reload (chokidar + WebSocket)
اليوم 8+ : G4 — Hooks System (مرحلياً: head + body + product)
```

**الأثر المُتوقَّع بعد G1+G2**: أي ثيم Salla قياسي (مثل theme-raed) يُعرض بدقة 98%+ بدون تعديل.

**الأثر المُتوقَّع بعد G3**: منصة تطوير احترافية حقيقية — مطوّر الثيم يرى تغييراته فورياً.

**الأثر المُتوقَّع بعد G4**: مطابقة كاملة — حتى الثيمات التي تعتمد على Hooks المتقدمة تعمل بشكل صحيح.

---

> **ملاحظة ختامية**: الفجوة الوحيدة التي لا يمكن حلها بدون سلة الحقيقية هي بيانات المستخدم الحقيقي (سجل الطلبات الفعلي، النقاط الحقيقية، إلخ). لكن بـ SeederService القائم + محاكاة العميل المُسجَّل (G3)، يمكن محاكاة 95%+ من سيناريوهات المطوّر باحترافية كاملة.
