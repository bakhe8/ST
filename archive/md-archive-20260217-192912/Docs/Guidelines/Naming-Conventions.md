# Naming Conventions

تاريخ: 2026-02-14
مرجع مصطلح PascalCase: https://techterms.com/definition/pascalcase

---

## 1) PascalCase (المعتمد للأسماء النوعية)

التعريف:
- PascalCase يعني كتابة الاسم المركب بحيث تبدأ **كل كلمة** بحرف كبير.
- أمثلة: `RuntimeContext`, `ThemeVersion`, `BuildPreviewResult`.

الفرق عن camelCase:
- PascalCase: `NewObject`
- camelCase: `newObject`

---

## 2) القاعدة المعتمدة في مشروع ST

### استخدم PascalCase في:
1. أسماء `types` و`interfaces`
2. أسماء `classes`
3. أسماء React Components
4. أسماء DTOs/Contracts (مثل: `ThemeContract`, `ValidationResult`)

### استخدم camelCase في:
1. أسماء المتغيرات المحلية
2. أسماء الدوال
3. أسماء الخصائص داخل الكائنات

### استخدم kebab-case في:
1. أسماء الملفات غير النوعية (يفضل في الواجهات والأصول)
2. مسارات URLs

---

## 3) أمثلة سريعة من نطاق المشروع

- ✅ PascalCase: `VirtualStoreState`, `RuntimeContextBuilder`
- ✅ camelCase: `buildRuntimeContext()`, `activeScenarioId`
- ✅ kebab-case: `theme-compatibility-checklist.md`

---

## 4) قاعدة منع التضارب

إذا كان الاسم يمثل **نوعًا/كيانًا ثابتًا** -> PascalCase.
إذا كان الاسم يمثل **قيمة متغيرة أو فعل** -> camelCase.

---

## 5) قرار التنفيذ

أي أسماء جديدة في العقود داخل `packages/contracts` أو الأنواع داخل `apps/api` يجب أن تتبع هذه القاعدة مباشرة.
