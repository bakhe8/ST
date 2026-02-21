# Salla Source of Truth Registry (VTDR)

تاريخ التحديث: 2026-02-21

## المصادر الرسمية المعتمدة

1. تحديث خيارات المنتج (API): `https://docs.salla.dev/5394196e0`
2. فهرس منصة الشركاء للثيمات: `https://salla.partners/themes`
3. دليل متاجر التطوير: `https://salla.dev/tutorial/arabic-showcase-your-work-with-development-stores/`
4. مركز المساعدة (تشغيل متاجر التطوير): `https://help.salla.sa/article/544057905`

## ما تم تثبيته تقنيًا في VTDR

1. حقول `Product Option` في طبقة المحاكاة أصبحت تُطبع بأسماء الحقول الرسمية:
   `display_type`, `associated_with_order_time`, `not_same_day_order`,
   `availability_range`, `from_date_time`, `to_date_time`,
   `visibility_condition_type`, `visibility_condition_option`, `visibility_condition_value`, `advance`.
2. نفس الحقول أصبحت تمر إلى Runtime Preview Context بدون إسقاط حتى تستهلكها الثيمات مباشرة.
3. نوع `SallaProductOptionTemplate` في العقود المشتركة تم توسيعه ليحمل هذه الحقول.

## ملاحظة تشغيلية

1. بعض صفحات `salla.dev` و`help.salla.sa` قد تُرجع محتوى ديناميكي/مقيّد حسب البيئة (Anti-bot/JS rendering).
2. عند تعذّر الاستخراج الآلي من هذه الصفحات، يبقى `docs.salla.dev` هو المصدر النصي الرسمي الأول للعقود البرمجية.
