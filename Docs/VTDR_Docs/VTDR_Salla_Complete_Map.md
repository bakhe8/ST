# خريطة المطابقة الكاملة مع سلة (النسخة المصحّحة)

> **المصادر**: `salla.openapi.json` + `runtime.ts` + `STORE_PARITY_BACKLOG.md` + `API-ROUTES.snapshot.json` + `Docs/Specifications/` + **صور `Docs/Assets/` (فحص بصري)**
> **آخر تحديث**: 2026-02-18 — مُحدَّثة بعد استخراج المجالات من الصور
> **الهدف**: مطابقة كاملة لا تُغفل أي تفصيل

---

## ملخص الحالة الراهنة (من STORE_PARITY_BACKLOG)

| Slice        | المجال                             | الحالة            |
| ------------ | ---------------------------------- | ----------------- |
| Slice-01     | Products + Categories              | ✅ مغلق           |
| Slice-02     | Theme Settings + Page Compositions | ✅ مغلق           |
| Slice-03     | Blog Categories + Articles         | ✅ مغلق           |
| Slice-04     | Brands + Special Offers            | ✅ مغلق           |
| Slice-05     | Navigation Menus                   | ✅ مغلق           |
| Slice-06     | Reviews + Questions                | ✅ مغلق           |
| **Slice-07** | **Inventory + Merchandising**      | 🔄 **نشط حالياً** |

---

## المجال 1: المتجر (Store)

**الحالة**: ✅ أساسي موجود | ⚠️ تفاصيل ناقصة

| الكيان        | الحقول الموجودة                                                                                  | الحقول الناقصة                                        |
| ------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Store         | id, name, url, logo, description, currency, locale, plan, status, verified, domain               | favicon, cover_image                                  |
| StoreBranding | logo, primary_color, secondary_color, font_family                                                | favicon, cover_image                                  |
| StoreContacts | —                                                                                                | mobile, email, whatsapp, phone                        |
| StoreSocial   | twitter, facebook, snapchat, youtube, telegram, whatsapp, maroof, appstore_link, googleplay_link | instagram, tiktok, linkedin                           |
| StoreLicenses | tax_number, commercial_number, freelance_number                                                  | vat_number                                            |
| StoreBranch   | id, name, type, status, is_main, phone, email, location.lat/lng                                  | address, city, country, working_hours                 |
| StoreTax      | id, name, tax_number, amount, status, is_global                                                  | type (vat/custom), applied_to[]                       |
| StoreShipping | id, name, logo, description, status                                                              | type, cost, min_order_amount, estimated_days, zones[] |
| StoreCurrency | id, name, symbol, code, is_default, exchange_rate                                                | —                                                     |
| StoreLanguage | id, name, code, is_default, status                                                               | direction (ltr/rtl)                                   |

**الخطوة التالية**: إضافة `contacts` + `instagram/tiktok` في StoreSocial + `direction` في StoreLanguage

---

## المجال 2: المنتجات (Products)

**الحالة**: ✅ Slice-01 مغلق | ⚠️ حقول إضافية مكتشفة من الصور

| الكيان                          | الحقول الموجودة                                                                                                                                                                                              | الحقول الناقصة                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product                         | id, name, sku, type, price, regular_price, sale_price, description, short_description, url, slug, images[], options[], variants[], categories[], is_available, is_on_sale, rating, comments[], tags[], brand | **cost_price**, **weight**, **weight_unit**, **youtube_url**, is_featured, is_taxable, require_shipping, metadata (SEO), sale_end_date, status (hidden/deleted) |
| ProductImage                    | id, url, alt, is_default                                                                                                                                                                                     | sort_order                                                                                                                                                      |
| ProductOption                   | id, name, type (select/radio/image/text/date), values[]                                                                                                                                                      | is_required, sort_order                                                                                                                                         |
| ProductOptionValue              | id, name, price, is_default, color                                                                                                                                                                           | image, sort_order                                                                                                                                               |
| ProductVariant                  | id, sku, price, sale_price, is_available, images[], options[]                                                                                                                                                | cost_price, quantity, weight, barcode                                                                                                                           |
| ProductTag                      | id, name, url                                                                                                                                                                                                | —                                                                                                                                                               |
| ProductRating                   | stars, count                                                                                                                                                                                                 | distribution {1-5}                                                                                                                                              |
| **ProductCustomField** _(جديد)_ | —                                                                                                                                                                                                            | id, product_id, key, value, type (text/number/date/boolean)                                                                                                     |
| **ProductPricingTier** _(جديد)_ | —                                                                                                                                                                                                            | id, product_id, min_quantity, price, customer_group_id                                                                                                          |
| **ProductAttachment** _(جديد)_  | —                                                                                                                                                                                                            | id, product_id, name, file_url, file_type                                                                                                                       |
| **ProductSpec** _(جديد)_        | —                                                                                                                                                                                                            | id, product_id, key, value                                                                                                                                      |

> 📸 **مصدر الصور**: `2T9LMDfrpTA9PIcKQ3lCrvPSwWJhQ2mN7MloylQP.png` (إضافة منتج) + `IyXpHn3vNuaXDlkN8LhxZ4ZRlmENblVQ8Fm1dRhf.png` (صفحة المنتج)

**الخطوة التالية** (Slice-07): stock/quantity حقيقي + weight + is_featured + metadata SEO + CustomFields + Specs + Attachments

---

## المجال 3: الفئات (Categories)

**الحالة**: ✅ Slice-01 مغلق

| الحقل                                                          | الحالة   |
| -------------------------------------------------------------- | -------- |
| id, name, url, slug, image, description, parent_id, children[] | ✅ موجود |
| sort_order, is_active, products_count                          | ❌ ناقص  |
| metadata (SEO)                                                 | ❌ ناقص  |

---

## المجال 4: العلامات التجارية (Brands)

**الحالة**: ✅ Slice-04 مغلق

| الحقل                                     | الحالة   |
| ----------------------------------------- | -------- |
| id, name, url, slug, logo, banner, order  | ✅ موجود |
| is_active, products_count, metadata (SEO) | ❌ ناقص  |

---

## المجال 5: العملاء (Customers)

**الحالة**: ❌ غائب تماماً

| الكيان          | الحقول الناقصة                                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Customer        | id, first_name, last_name, email, mobile, avatar, gender, birthdate, status, is_verified, created_at, last_login, total_orders, total_spent, loyalty_points |
| CustomerAddress | id, customer_id, name, phone, country, city, district, street, postal_code, is_default, location                                                            |
| CustomerGroup   | id, name, discount_type, discount_value                                                                                                                     |
| CustomerAuth    | JWT tokens, OTP, social login (Google/Apple)                                                                                                                |

**الخطوة التالية**: بناء Customer model في Prisma + Auth حقيقي

---

## المجال 6: الطلبات (Orders)

**الحالة**: ⚠️ موجود كـ DataEntity JSON — لا منطق حقيقي

| الحقل                                                                                                                           | الحالة     |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| id, order_number, status, total, created_at, updated_at, customer, address, items[], history[], payment_method, shipping_method | ⚠️ في JSON |
| subtotal, discount, shipping_cost, tax_amount, coupon_code, notes, tracking_number, invoice_url, reference_id                   | ❌ ناقص    |
| **tags[]** _(مكتشف من الصور)_                                                                                                   | ❌ ناقص    |
| **assigned_employee_id** _(مكتشف من الصور)_                                                                                     | ❌ ناقص    |
| **branch_id** _(مكتشف من الصور)_                                                                                                | ❌ ناقص    |
| OrderItem.product_id, variant_id, options[], discount, tax                                                                      | ❌ ناقص    |
| OrderHistory.created_by                                                                                                         | ❌ ناقص    |

> 📸 **مصدر الصور**: `lRcUHtmQKrGp5Bw1hEMHlby5YAiGytFClB7skoNz.png` (قائمة الطلبات)

**الخطوة التالية**: بناء Order model حقيقي في Prisma مع منطق حساب الإجماليات

---

## المجال 7: العربة (Cart)

**الحالة**: ⚠️ موجود في memory — يُفقد عند restart

| الحقل                                                  | الحالة           |
| ------------------------------------------------------ | ---------------- |
| GET/POST/PATCH/DELETE cart items                       | ✅ routes موجودة |
| البيانات في DB                                         | ❌ في memory فقط |
| customer_id, session_id (للزوار)                       | ❌ ناقص          |
| subtotal, discount, shipping_cost, tax, total (محسوبة) | ❌ ناقص          |
| coupon_code, notes, expires_at                         | ❌ ناقص          |
| CartItem.variant_id, options[], image, max_quantity    | ❌ ناقص          |
| **CartItem.note** _(مكتشف من الصور)_                   | ❌ ناقص          |

> 📸 **مصدر الصور**: `xpB8M6M9F8mSxUJKN1FwW3BTygDiRBu1uyojnZiz.png` (صفحة المنتج — "إضافة ملاحظة")

**الخطوة التالية**: نقل Cart إلى Prisma DB + حساب الإجماليات

---

## المجال 8: الدفع والشحن (Checkout)

**الحالة**: ❌ غائب تماماً — P1 في BACKLOG

| الكيان          | الحقول الناقصة                                                                    |
| --------------- | --------------------------------------------------------------------------------- |
| PaymentMethod   | id, name, logo, type (card/bank/cod/wallet/bnpl), is_active, fees, min/max_amount |
| ShippingMethod  | id, name, logo, type (flat/free/calculated/pickup), cost, estimated_days, zones[] |
| ShippingZone    | id, name, countries[], cities[], cost                                             |
| CheckoutSession | address, payment_method, shipping_method, coupon, totals                          |

---

## المجال 9: التسويق (Marketing)

**الحالة**: ⚠️ جزئي

| الكيان                  | الحالة                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------- |
| SpecialOffer (Slice-04) | ✅ CRUD كامل مع title/slug/discount_type/discount_value/starts_at/ends_at/is_active |
| Coupon                  | ⚠️ في runtime.ts فقط — لا CRUD، لا منطق تطبيق                                       |
| Affiliate               | ⚠️ في runtime.ts فقط — لا CRUD                                                      |
| Loyalty                 | ⚠️ في runtime.ts فقط — لا منطق حقيقي                                                |

**الحقول الناقصة في Coupon**: min_order_amount, max_uses, used_count, applies_to, products[], categories[], customer_groups[], is_active
**الحقول الناقصة في SpecialOffer**: buy_quantity, get_quantity (اشتري X احصل على Y)

---

## المجال 10: المحتوى (Content)

**الحالة**: ✅ معظمه موجود

| الكيان                  | الحالة                                              |
| ----------------------- | --------------------------------------------------- |
| StaticPage (Slice-03)   | ✅ CRUD كامل                                        |
| BlogArticle (Slice-03)  | ✅ CRUD مع title/slug/summary/url/image/category_id |
| BlogCategory (Slice-03) | ✅ CRUD مع id/name/title/slug/url/order             |
| Menu (Slice-05)         | ✅ header/footer مع nested children                 |

**الحقول الناقصة في BlogArticle**: author, tags[], is_published, published_at, views_count, metadata SEO
**الحقول الناقصة في Menu**: location enum (sidebar), item.type (page/category/product/custom), item.target

---

## المجال 11: التقييمات والأسئلة (Reviews & Questions)

**الحالة**: ✅ Slice-06 مغلق

| الكيان                                                                               | الحالة   |
| ------------------------------------------------------------------------------------ | -------- |
| Review: id, stars, content, customer_name, is_published, is_verified, product_id     | ✅ موجود |
| Question: id, question, answer, customer_name, is_answered, is_published, product_id | ✅ موجود |
| product.rating recomputation                                                         | ✅ موجود |
| product.comments[] recomputation                                                     | ✅ موجود |

**الحقول الناقصة في Review**: reply (رد المتجر), images[], helpful_count, status (pending/approved/rejected)
**الحقول الناقصة في Question**: created_at

---

## المجال 12: الثيمات والصفحات (Theme & Pages)

**الحالة**: ✅ Slice-02 مغلق | ⚠️ حقول إضافية مكتشفة من الصور

| الكيان                                                              | الحالة                   |
| ------------------------------------------------------------------- | ------------------------ |
| Theme: id, name, version, author, preview_url, thumbnail, is_active | ✅ موجود                 |
| ThemeSettings: merge updates, per-store                             | ✅ موجود                 |
| PageComposition: per-store, per-page                                | ✅ موجود                 |
| ComponentInstance: type, settings, visibility (enabled/viewport)    | ✅ موجود                 |
| Page routing (product/category/search/cart...)                      | ❌ ناقص — index.twig فقط |

**حقول ThemeSettings الناقصة** _(مكتشفة من الصور)_:

| الحقل                     | النوع                        | المصدر                                      |
| ------------------------- | ---------------------------- | ------------------------------------------- |
| use_arabic_numerals       | boolean                      | "استخدام الأرقام العربية"                   |
| show_salla_badge          | boolean                      | "عرض عبارة صنع بإتقان على منصة سلة"         |
| store_color               | string (hex)                 | "لون المتجر"                                |
| font_type                 | enum (default/google/custom) | "اختر الخط"                                 |
| font_family               | string                       | "الخطوط الإفتراضية"                         |
| breadcrumb_enabled        | boolean                      | "ميزة مسار التنقل"                          |
| unify_card_height         | boolean                      | "توحيد ارتفاع المنتجات"                     |
| product_image_display     | enum (cover/contain)         | "عرض صورة المنتج"                           |
| header_dark               | boolean                      | "شريط علوي داكن"                            |
| show_header_links         | boolean                      | "عرض روابط الصفحات الهامة في الشريط العلوي" |
| footer_dark               | boolean                      | "الوضع الداكن" (footer)                     |
| product_sticky_cta        | boolean                      | "تثبيت زر الإضافة أسفل شاشة الجوال"         |
| show_product_tags         | boolean                      | "اظهار الوسوم"                              |
| product_image_slider_type | enum                         | "طريقة عرض الصور في سليدر صور المنتج"       |

**ThemeFeature** _(جديد — مكتشف من الصور)_:

| الحقل        | النوع                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| id, theme_id | string                                                                                                                   |
| feature_key  | enum (mega_menu / store_fonts / store_colors / breadcrumb / unite_cards_height / featured_products / fixed_banner / ...) |
| is_enabled   | boolean                                                                                                                  |

> 📸 **مصدر الصور**: `O9e5cGosJzUNk7pgkMFTlgCRS9mpXObnjPMmrpwq.png` (Theme Settings) + `14.png` (Theme Features 15 items)

**الصفحات الناقصة في Routing**:

- product.twig, category.twig, search.twig, cart.twig, checkout.twig
- orders.twig, order.twig, profile.twig, wishlist.twig
- brand.twig, blog.twig, blog-article.twig, page.twig, 404.twig

---

## المجال 13: بطاقة الهدية (Gift Card)

**الحالة**: ❌ غائب تماماً

| الحقل                                                               | النوع           |
| ------------------------------------------------------------------- | --------------- |
| id, code (unique), amount, balance, currency                        | string/number   |
| status (active/used/expired), expiry_date                           | enum/datetime   |
| sender_name, sender_email, recipient_name, recipient_email, message | string          |
| customer_id, order_id, created_at, used_at                          | string/datetime |

---

## المجال 14: المحفظة (Wallet)

**الحالة**: ❌ غائب تماماً

| الكيان            | الحقول                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| CustomerWallet    | id, customer_id, balance, currency, is_active                                                                |
| WalletTransaction | id, wallet_id, type (credit/debit/refund/cashback), amount, balance_after, description, order_id, created_at |

---

## المجال 15: المفضلة (Wishlist)

**الحالة**: ❌ غائب تماماً _(مؤكد بصرياً — أيقونة ♡ على كل بطاقة منتج)_

| الحقل                                                   | النوع           |
| ------------------------------------------------------- | --------------- |
| id, customer_id, product_id, variant_id, added_at, note | string/datetime |

> 📸 **مصدر الصور**: `QLHHS9QNUU7uIHjlqabptGBJEvAdwokoiosNOEYp.png` + `hdfcyElqBpdlKb5Uvnaq8FxjuynMVEdEIOOxRx2a.png`

---

## المجال 16: السلة المتروكة (Abandoned Cart)

**الحالة**: ❌ غائب _(مؤكد بصرياً — widget في Dashboard مع أسماء عملاء)_

| الحقل                                                                | النوع               |
| -------------------------------------------------------------------- | ------------------- |
| id, cart_id, customer_id, customer_email                             | string              |
| items_count, total, abandoned_at                                     | int/number/datetime |
| recovery_status (pending/notified/recovered/ignored)                 | enum                |
| recovery_url, notifications_sent, last_notification_at, recovered_at | string/int/datetime |

> 📸 **مصدر الصور**: `GoTthL8cOffyfxPXOs9tu16SJBx69qVKlzCMuJwV.png` (Dashboard widget)

---

## المجال 17: الاشتراكات (Subscriptions)

**الحالة**: ❌ غائب تماماً

| الكيان               | الحقول                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SubscriptionPlan     | id, product_id, name, billing_cycle (daily/weekly/monthly/yearly), billing_interval, price, trial_days, is_active                                       |
| CustomerSubscription | id, customer_id, plan_id, status (active/paused/cancelled/expired), start_date, next_billing_date, end_date, payment_method, total_paid, renewals_count |

---

## المجال 18: المخزون (Inventory)

**الحالة**: 🔄 Slice-07 نشط حالياً

| الكيان            | الحقول                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| InventoryRecord   | id, product_id, variant_id, quantity, reserved_quantity, available_quantity, low_stock_threshold, track_quantity, allow_backorder, branch_id |
| InventoryMovement | id, product_id, variant_id, type (in/out/adjustment/return), quantity, reason, order_id, created_at                                          |

**المطلوب في Slice-07**: stock rules, out-of-stock states, product sorting/filters

---

## المجال 19: الاتصالات (Communication)

**الحالة**: ❌ غائب — يُنفَّذ عبر Apps خارجية في سلة

| الكيان               | الحقول                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| NotificationTemplate | id, type (sms/email/push/whatsapp), event, subject, body, is_active, language                                         |
| NotificationLog      | id, template_id, customer_id, channel, status (sent/delivered/failed/opened), sent_at, opened_at                      |
| MarketingCampaign    | id, name, type, status (draft/scheduled/sent/cancelled), target, target_ids[], scheduled_at, sent_count, opened_count |

---

## المجال 20: المستردات والفواتير (Refunds & Invoices)

**الحالة**: ❌ غائب تماماً

| الكيان  | الحقول                                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Refund  | id, order_id, amount, reason, method (wallet/original/gift_card), status (pending/approved/rejected/completed), items[], created_at, processed_at |
| Invoice | id, order_id, invoice_number, pdf_url, issued_at, tax_amount, subtotal, total                                                                     |

---

## المجال 21: المنتجات الرقمية (Digital Products)

**الحالة**: ⚠️ type=digital موجود في enum — لا منطق خاص

| الكيان          | الحقول                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------- |
| DigitalFile     | id, product_id, name, file_url (private), file_size, file_type, download_limit, expiry_days         |
| DigitalDownload | id, order_id, customer_id, file_id, download_token, downloads_count, expires_at, last_downloaded_at |

---

## المجال 22: التقارير والتحليلات (Analytics & Reports) _(جديد)_

**الحالة**: ❌ غائب تماماً

> 📸 **مصدر الصور**: `DjtmX5Usuj86e2hap4fE8NMBs9X0lALuTB9bezed.png` + `tdPLmHMCZN0IIttTWzSHMO9niSd0wNpZbXNGoFTa.png`

| الكيان              | الحقول                                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| SalesReport         | period_start, period_end, total_sales, total_cost, total_discount, total_shipping, cod_fees, tax_amount, payment_gateway_fees, net_profit |
| ProductSalesReport  | product_id, product_name, brand_name, price, sale_price, sale_end_date, product_type                                                      |
| CategorySalesReport | category_id, category_name, total_sales, orders_count                                                                                     |
| BrandSalesReport    | brand_id, brand_name, total_sales, orders_count                                                                                           |
| CouponSalesReport   | coupon_id, code, used_count, total_discount                                                                                               |
| CitySalesReport     | city, total_sales, orders_count                                                                                                           |
| ShippingReport      | carrier, total_orders, total_cost                                                                                                         |
| InventoryReport     | product_id, current_stock, reserved, movements_count                                                                                      |
| EmployeeReport      | employee_id, orders_handled, total_sales                                                                                                  |
| WishlistReport      | product_id, wishlist_count                                                                                                                |
| AbandonedCartReport | total_abandoned, total_recovered, recovery_rate                                                                                           |

**أقسام التقارير الرئيسية** (من الصور):

- المبيعات → المنتجات / الدفع والشحن / نظام الولاء
- الزيارات
- السلات المتروكة
- أمنيات العملاء
- المدفوعات
- الشحن
- المخزون
- الموظفون
- التشغيل

---

## المجال 23: الموظفون (Employees) _(جديد)_

**الحالة**: ❌ غائب تماماً

> 📸 **مصدر الصور**: `lRcUHtmQKrGp5Bw1hEMHlby5YAiGytFClB7skoNz.png` (زر "+ الموظف" في الطلبات) + `tdPLmHMCZN0IIttTWzSHMO9niSd0wNpZbXNGoFTa.png` (قسم الموظفون في التقارير)

| الكيان                  | الحقول                                                                |
| ----------------------- | --------------------------------------------------------------------- |
| Employee                | id, store_id, name, email, role, permissions[], is_active, created_at |
| EmployeeOrderAssignment | order_id, employee_id, assigned_at                                    |

---

## المجال 24: الحجوزات (Reservations) _(جديد)_

**الحالة**: ❌ غائب تماماً

> 📸 **مصدر الصور**: `lRcUHtmQKrGp5Bw1hEMHlby5YAiGytFClB7skoNz.png` (تبويب "الحجوزات" في قائمة الطلبات)

| الكيان      | الحقول                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Reservation | id, order_id, customer_id, product_id, reserved_at, expires_at, status (active/expired/converted) |

---

## المجال 25: رابط الدفع (Payment Link) _(جديد)_

**الحالة**: ❌ غائب تماماً

> 📸 **مصدر الصور**: `lRcUHtmQKrGp5Bw1hEMHlby5YAiGytFClB7skoNz.png` (عملية "نسخ رابط الدفع" في إجراءات الطلب)

| الكيان      | الحقول                                             |
| ----------- | -------------------------------------------------- |
| PaymentLink | id, order_id, url, expires_at, is_used, created_at |

---

## المجال 26: بوليصة الشحن (Shipping Label) _(جديد)_

**الحالة**: ❌ غائب تماماً

> 📸 **مصدر الصور**: `lRcUHtmQKrGp5Bw1hEMHlby5YAiGytFClB7skoNz.png` (عملية "إصدار البوليصة" في إجراءات الطلب)

| الكيان        | الحقول                                                       |
| ------------- | ------------------------------------------------------------ |
| ShippingLabel | id, order_id, tracking_number, carrier, label_url, issued_at |

---

## المجال 27: هدف الشهر (Monthly Goal) _(جديد)_

**الحالة**: ❌ غائب تماماً

> 📸 **مصدر الصور**: `GoTthL8cOffyfxPXOs9tu16SJBx69qVKlzCMuJwV.png` (زر "إضافة هدف الشهر" في Dashboard)

| الكيان      | الحقول                                                                    |
| ----------- | ------------------------------------------------------------------------- |
| MonthlyGoal | id, store_id, month (YYYY-MM), target_amount, achieved_amount, created_at |

---

## المجال 28: الاشتري الآن وادفع لاحقاً (BNPL) _(جديد)_

**الحالة**: ❌ غائب — يُنفَّذ عبر مزودين خارجيين (MisPay, Tamara, Tabby)

> 📸 **مصدر الصور**: `IyXpHn3vNuaXDlkN8LhxZ4ZRlmENblVQ8Fm1dRhf.png` (شعار MisPay في صفحة المنتج)

| الكيان       | الحقول                                                                        |
| ------------ | ----------------------------------------------------------------------------- |
| BNPLProvider | id, name (MisPay/Tamara/Tabby), logo, is_active                               |
| BNPLOffer    | provider_id, product_id, installments, installment_amount, total_amount, fees |

---

## المجال 29: المؤثرون (Influencer) _(جديد)_

**الحالة**: ⚠️ في `runtime.ts` كـ `SallaAffiliate` — لا CRUD، لا منطق

> 📸 **مصدر الصور**: `set-up-theme-16new.png` (قسم Influencer في Partners Portal)

| الكيان             | الحقول                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Influencer         | id, name, email, commission_rate, referral_code, total_sales, total_commission, is_active |
| InfluencerReferral | id, influencer_id, order_id, commission_amount, status, created_at                        |

---

## خريطة الأولويات (مُحدَّثة)

```
✅ مكتمل (Slices 1-6):
   Products + Categories + Blog + Brands + Offers + Menus + Reviews + Questions

🔄 نشط (Slice-07):
   Inventory + Merchandising (stock rules, out-of-stock, sorting/filters)

❌ P1 — بعد Slice-07 (من BACKLOG + الصور):
   ├── Checkout simulation (shipping zones, taxes, payment methods, coupon effects)
   ├── Customer + Auth (الأعلى أثراً — يفتح: Orders/Cart/Wishlist/Wallet)
   ├── Order (منطق حقيقي + tags + employee + branch)
   ├── Cart persistence (DB بدل memory + CartItem.note)
   ├── Analytics/Reports (11 نوع تقرير)
   ├── Employees (إدارة + تعيين على الطلبات)
   ├── Page routing (15 صفحة ناقصة)
   └── ThemeSettings (14 حقل إضافي)

❌ P2 — مجالات كاملة غائبة:
   ├── Wishlist (مؤكد بصرياً)
   ├── Abandoned Cart (مؤكد بصرياً)
   ├── Reservation (تبويب في الطلبات)
   ├── PaymentLink (إجراء على الطلب)
   ├── ShippingLabel (إجراء على الطلب)
   ├── MonthlyGoal (Dashboard widget)
   ├── ProductCustomField + PricingTier + Attachment + Spec
   ├── Gift Card
   ├── Wallet
   ├── Refunds + Invoices
   └── Digital Products (منطق)

❌ P3 — مجالات متقدمة:
   ├── BNPL (MisPay/Tamara/Tabby)
   ├── Influencer (Affiliate)
   ├── Subscriptions
   ├── Communication (Notifications)
   └── ThemeFeature (15 ميزة)
```

---

## إحصائيات نهائية

| الفئة               | العدد                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| مجالات مكتملة       | 6 (Products, Categories, Blog, Brands, Menus, Reviews)                                                                                                                        |
| مجالات جزئية        | 8 (Store, Orders, Cart, Marketing, Content, Theme, Digital, Influencer)                                                                                                       |
| مجالات غائبة تماماً | 15 (Customers, Checkout, GiftCard, Wallet, Wishlist, AbandonedCart, Subscriptions, Refunds, Analytics, Employees, Reservation, PaymentLink, ShippingLabel, MonthlyGoal, BNPL) |
| **إجمالي المجالات** | **29**                                                                                                                                                                        |
