# Salla Official Alignment

تاريخ: 2026-02-14
المصدر: https://docs.salla.dev/
الهدف: ربط مشروع VTDR بالمسار الرسمي في Salla Docs

---

## 1) المسارات الرسمية التي يجب اعتمادها

### Twilight (Themes)
- Create a theme: https://docs.salla.dev/421877m0
- Develop a theme: https://docs.salla.dev/421878m0
- Setup a theme: https://docs.salla.dev/421879m0
- Publish a theme: https://docs.salla.dev/421880m0
- Themes publishing requirements: https://docs.salla.dev/421885m0
- Theme publish main requirements: https://docs.salla.dev/421886m0
- UX/UI Review: https://docs.salla.dev/421887m0
- Technical Theme Review: https://docs.salla.dev/421888m0
- Theme Metadata Review: https://docs.salla.dev/421889m0

### Theme Structure & Contracts
- Themes directory structure: https://docs.salla.dev/421918m0
- twilight.json: https://docs.salla.dev/421921m0
- Twig basic syntax: https://docs.salla.dev/421928m0
- Twilight flavoured twig: https://docs.salla.dev/421929m0
- Theme layouts: https://docs.salla.dev/421943m0
- Global variables: https://docs.salla.dev/421938m0

### Salla CLI
- CLI overview: https://docs.salla.dev/429774m0
- CLI usage: https://docs.salla.dev/422761m0
- CLI authorization: https://docs.salla.dev/422762m0
- Theme commands overview: https://docs.salla.dev/422774m0
- Theme create: https://docs.salla.dev/422775m0
- Theme preview: https://docs.salla.dev/422776m0
- Theme publish: https://docs.salla.dev/422968m0

### Twilight JS SDK / Web Components
- Twilight JS SDK overview: https://docs.salla.dev/422610m0
- Web Components overview: https://docs.salla.dev/422688m0
- Web Components usage: https://docs.salla.dev/422689m0

---

## 2) ماذا يعني هذا لمشروعك مباشرة

1. مشروعك صحيح في الجوهر: الثيمات في سلة تعتمد على `twilight.json` + Twig + بنية ملفات محددة.
2. محرك VTDR يجب أن يلتزم بعقود Twilight (متغيرات/قوالب/بنية)، وليس اختراع عقد بديلة.
3. أي Export من VTDR يجب أن يخرج Theme Package متوافق مع متطلبات النشر الرسمية.
4. نجاح MVP لا يكفي بالمعاينة فقط؛ يلزم مرور “قائمة تحقق توافق” مع متطلبات Technical/Metadata/UX review.
5. CLI ليس بديلًا عن محركك؛ لكنه مرجع قياسي لتدفق create/preview/publish.

---

## 3) قرارات تنفيذ فورية (P0)

1. إنشاء `Theme Compatibility Checklist` داخل المشروع مبني على صفحات:
   - directory structure
   - twilight.json
   - publishing requirements
2. ربط Validation Engine في VTDR بنتائج: `pass / warning / fail` وفق هذه القائمة.
3. إضافة `Salla Reference Links` داخل كل عقدة فحص لتسهيل المراجعة.
4. اعتماد `twilight.json` كمدخل إلزامي في Theme Loader v1.

---

## 4) مخاطر يجب الانتباه لها

1. أي Context مفصل داخليًا يجب ألا يفترض حقول غير مضمونة في Twilight.
2. دعم Web Components يجب أن يكون اختياريًا حسب الثيم، لا فرضًا عامًا.
3. اختلافات نسخ Twilight قد تتطلب Versioned compatibility profile.

---

## 5) ربطها مع وثيقتك الموحّدة

هذه الوثيقة تُستخدم كطبقة “مرجعية رسمية” مكملة لـ:
- [Unified-Answers-Execution-Blueprint.md](Unified-Answers-Execution-Blueprint.md)
- [Image-Spec-Comparison-Matrix.md](Image-Spec-Comparison-Matrix.md)
- [Salla-Theme-Blog-Practices.md](Salla-Theme-Blog-Practices.md) (إرشادي)
- [Theme-Raed-Implementation-Reference.md](Theme-Raed-Implementation-Reference.md) (مرجع تطبيقي)
- [Twilight-SDK-Integration-Contract.md](Twilight-SDK-Integration-Contract.md) (عقد دمج SDK)
- [Twilight-Json-Compliance-Spec.md](Twilight-Json-Compliance-Spec.md) (عقد توافق twilight.json)
- [Twilight-Twig-Helpers-Filters-Contract.md](Twilight-Twig-Helpers-Filters-Contract.md) (عقد توافق Twig)
- [Twilight-Global-Variables-Contract.md](Twilight-Global-Variables-Contract.md) (عقد توافق المتغيرات العامة)
- [Theme-Directory-Structure-Compliance-Spec.md](Theme-Directory-Structure-Compliance-Spec.md) (عقد توافق البنية)

عند أي تعارض بين تصور داخلي ومتطلب رسمي في Salla Docs:
المتطلب الرسمي هو المرجع النهائي.
