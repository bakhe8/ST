# Salla Contract Coverage Workflow (VTDR)

تاريخ التحديث: 2026-02-21

## الهدف

منع نسيان أي جزء من عقود سلة أثناء التنفيذ المرحلي.

## المصدر التنفيذي

1. سجل العقود الإلزامي: `Docs/VTDR_Docs/SALLA_CONTRACT_COVERAGE_REGISTRY.json`
2. بوابة التحقق: `tools/parity/salla-contract-coverage-guard.mjs`
3. التقرير الناتج: `Docs/VTDR/CONTRACT-COVERAGE.latest.json`

## قواعد العمل

1. كل بند في فهرس سلة يجب أن يكون له `id` داخل `requiredCoverageIds`.
2. كل `id` إلزامي يجب أن يكون له عقد مقابل داخل `contracts`.
3. حالة العقد تكون واحدة من: `GAP` أو `PARTIAL` أو `PASS`.
4. عقد `PASS` يجب أن يملك مراجع تنفيذ + اختبارات فعلية.
5. أي مرجع ملف غير موجود يفشل البوابة.

## التشغيل

```bash
npm run contracts:coverage:guard
```

## سياسة التحديث عند تنفيذ أي ميزة

1. تحديث حالة العقد في السجل (`GAP -> PARTIAL -> PASS`).
2. إضافة/تحديث مراجع التنفيذ والاختبار داخل نفس العقد.
3. تشغيل `contracts:coverage:guard`.
4. تشغيل الاختبارات المرتبطة.
