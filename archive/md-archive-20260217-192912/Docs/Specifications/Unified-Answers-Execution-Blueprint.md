# Unified Answers & Execution Blueprint

تاريخ الإنشاء: 2026-02-14
الحالة: مرجع تشغيلي موحّد (بديل عن التشتت بين الوثائق)

---

## 1) الإجابة الحاسمة: ما الذي نبنيه فعليًا؟

**نحن نبني محركًا لتفسير/تركيب/محاكاة ثيمات سلة خارج المنصة** بحيث تكون نتيجة المعاينة مطابقة لما سيحدث داخل سلة بعد التركيب.

**المنتج المستهدف هو بيئة تطوير متعددة الثيمات (Multi-Theme Development Environment)**،
وليس تطوير ثيم واحد بعينه.

**الاسم التشغيلي المعتمد للمشروع:**
Virtual Store–Driven Theme Runtime

> المعادلة المرجعية الوحيدة:
>
> Theme Files (Code) + Virtual Store State (Settings + Content) -> Runtime Context -> Live Preview

---

## 2) القرارات المعمارية النهائية (Final Decisions)

1. **المتجر الافتراضي هو مركز الحالة (Store-Centric).**
2. **الثيم لا يملك الحالة ولا المنطق؛ يستهلك Context فقط.**
3. **دعم تحكم مزدوج إلزامي:**
   - عبر الواجهة (Settings/Composition/Content)
   - عبر تعديل الكود مباشرة (Twig/CSS/JS/twilight.json)
4. **لا تخزين لملفات الثيم داخل DB** (تبقى في File System).
5. **DB تخزّن الحالة التشغيلية والسيناريوهات والروابط واللقطات.**
6. **التصدير لا يصدّر المحرك ولا الداتا**؛ يصدّر فقط حزمة ثيم متوافقة مع سلة.
7. **المعاينة Pure(Context)**: أي نتيجة عرض ناتجة فقط من Runtime Context.

---

## 3) نطاق النظام (In Scope)

- إدارة الثيمات وإصداراتها
- دعم العمل المتوازي على عدة ثيمات ضمن نفس البيئة
- عزل حالة التشغيل لكل ثيم/إصدار/سيناريو بشكل مستقل
- إدارة Virtual Stores وحالتها
- Schema-driven settings
- Page/Component composition
- Runtime Context builder
- Live preview
- Validation + readiness report
- Export package

## 4) خارج النطاق (Out of Scope)

- تشغيل متجر فعلي (Orders/Payments)
- التكامل التجاري الكامل مع سلة أثناء التطوير
- تحويل الثيم إلى صيغة أخرى
- فرض نمط عمل واحد على المطور
- بناء ثيم واحد مخصص كناتج نهائي للمشروع نفسه

---

## 5) حل التعارضات بين الوثائق

### التعارض 1: Theme-driven vs Store-driven

**الحسم:** Store-driven هو المعتمد، والثيم Source of Capabilities فقط.

### التعارض 2: هل النظام محرر ثيمات أم Runtime Engine؟

**الحسم:** Runtime Engine أولًا. أي محرر/واجهة مجرد أداة تحكم بالحالة.

### التعارض 3: Profile/Scenario أم Composition Engine؟

**الحسم:**

- Composition Engine = اللب المعماري
- Scenario = مدخل تشغيلي (preset state) وليس الكيان المركزي للنظام

### التعارض 4: أسماء متغيرة للنظام

**الحسم:** اعتماد اسم واحد في الكود والوثائق: `Virtual Store–Driven Theme Runtime (VTDR)`.

---

## 6) نموذج MVP الحقيقي (أول نسخة قابلة للتشغيل)

### MVP Goal

إثبات أن النظام يستطيع تشغيل ثيم حقيقي وإخراج معاينة متطابقة وتقرير جاهزية.

### MVP Features (5 فقط)

1. **Theme Loader**: تحميل ثيم + إصدار من File System
2. **Virtual Store State**: حالة متجر واحدة + صفحة واحدة (`home`)
3. **Context Builder v1**: دمج قدرات الثيم مع الحالة
4. **Live Preview v1**: عرض Twig مع إعادة تحميل تلقائية
5. **Validation v1 + Export v1**: فحص أساسي وتصدير حزمة الثيم

### ليس ضمن MVP

- Multi-page advanced composer
- سياسات كومبوننت متقدمة
- سيناريوهات كثيرة
- Workflow بيع/متجر ثيمات

---

## 7) خطة تنفيذ 30 يوم (عملية)

### الأسبوع 1 — Foundation

- تثبيت العقود (contracts) في `packages/contracts`
- بناء Theme Discovery + Version read
- تعريف Runtime State الأساسي

### الأسبوع 2 — Runtime Core

- بناء Context Builder v1
- ربط Data entities الأساسية
- API أولي لـ `/runtime/state` و `/preview/render`

### الأسبوع 3 — Preview + Dual Control

- Live preview مع file watch
- مزامنة تغييرات UI state + code changes
- Snapshot بسيط

### الأسبوع 4 — Validation + Export + Hardening

- قواعد validation الأساسية
- Export package متوافق
- تجربة end-to-end على ثيم حقيقي

---

## 8) Definition of Done (لمنع الضياع)

يعتبر MVP مكتملًا فقط إذا تحققت جميع الشروط:

1. تحميل ثيم وإصدار بنجاح
2. إنشاء Runtime Context صالح
3. عرض صفحة `home` في Preview بدون أخطاء Twig
4. أي تعديل على ملفات الثيم ينعكس مباشرة
5. أي تعديل على Store State ينعكس مباشرة
6. توليد تقرير Validation واضح
7. تصدير حزمة ثيم جاهزة

---

## 9) الأسئلة الحاسمة المتبقية (يجب حسمها قبل التنفيذ الكامل)

1. ما الحد الأدنى الرسمي لعقد الثيم الذي يجب دعمه في v1؟
2. هل Context contract سيكون نسخة واحدة أم versioned من البداية؟
3. ما محرك Twig المعتمد في runtime داخل API؟
4. ما سياسة fallback عند غياب حقول data مطلوبة؟
5. هل validation blocking أم warning-based في v1؟

---

## 10) قاعدة العمل اليومية (ضد التشتت)

قبل أي مهمة جديدة، اسأل:

- هل تخدم MVP الخماسي؟
- هل تقرّبنا من Definition of Done؟
- هل تضيف قدرة runtime حقيقية أم مجرد وثائق إضافية؟

إذا كانت الإجابة “لا” -> تُؤجل.

---

## 11) التوصية التنفيذية الآن

ابدأ فورًا بتنفيذ **Runtime Core** بدل كتابة وثائق إضافية.
الوثائق الحالية أصبحت كافية بعد هذا الدمج، والمخاطر الآن تنفيذية وليست مفاهيمية.

---

## 12) مرجع التوافق الرسمي (Salla Docs)

لأي قرار يتعلق ببنية الثيم، `twilight.json`، المعاينة، أو النشر:

- ارجع أولًا إلى [Salla-Official-Alignment.md](Salla-Official-Alignment.md)
- ثم طبّق القرار على التنفيذ في API/Runtime/Validation

في حال التعارض بين تصور داخلي ومتطلب رسمي من Salla:
**المتطلب الرسمي يتقدّم**.
