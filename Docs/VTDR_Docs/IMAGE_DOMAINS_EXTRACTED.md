# المجالات المستخرجة من صور Docs/Assets

> ⚠️ كل ما يلي مستنتج بصرياً من الصور — فرضيات تحتاج تحقق، وليست مواصفات رسمية.
> المصدر: فحص 20+ صورة من `Docs/Assets/`

---

## 1. لوحة التحكم (Dashboard) — `GoTthL8cOffyfxPXOs9tu16SJBx69qVKlzCMuJwV.png`

### كيانات مستنتجة

#### 1.1 DashboardSummary

| الحقل | النوع | المصدر |
|-------|-------|---------|
| period | enum (daily/monthly) | تبويب "يومي / شهري" |
| total_sales | number | "المبيعات: 203.90 ﷼" |
| total_visits | integer | "الزيارات: 0" |
| total_orders | integer | "الطلبات: 1" |
| monthly_goal | number | زر "إضافة هدف الشهر" |
| store_balance | number | "رصيد المتجر (0.80 ﷼)" |

#### 1.2 MonthlyGoal

| الحقل | النوع |
|-------|-------|
| id | string |
| store_id | string |
| month | string (YYYY-MM) |
| target_amount | number |
| achieved_amount | number |
| created_at | datetime |

#### 1.3 AbandonedCartWidget (widget في Dashboard)

- يظهر: customer_name, avatar, amount, time_ago
- يؤكد وجود كيان `AbandonedCart` مرتبط بعميل حقيقي

#### 1.4 RecentOrders (widget)

- يظهر: order_number, customer_name, status, amount, time_ago
- حالات ظاهرة: "بانتظار الدفع", "مسترجع", "طلب عرض سعر"

---

## 2. التقارير والتحليلات (Analytics) — `DjtmX5Usuj86e2hap4fE8NMBs9X0lALuTB9bezed.png` + `tdPLmHMCZN0IIttTWzSHMO9niSd0wNpZbXNGoFTa.png`

### أقسام التقارير المرئية

| القسم | الأقسام الفرعية |
|-------|----------------|
| **المبيعات** | المنتجات، الدفع والشحن، نظام الولاء |
| **خيارات المنتجات** | مبيعات التصنيفات، مبيعات المنتجات، مبيعات الأكواد، مبيعات الماركات، مبيعات كوبونات التخفيض، مبيعات المدن، مبيعات محلي، مبيعات التبرعات، التبرع السريع |
| **ملخص أداء المتجر** | إجمالي المبيعات، تكلفة المنتجات، التخفيضات والكوبونات، الشحن، رسوم الدفع عند الاستلام، الضرائب، رسوم الدفع الإلكتروني، إجمالي التكاليف، صافي الأرباح |
| **الزيارات** | — |
| **السلات المتروكة** | — |
| **أمنيات العملاء** | — |
| **المدفوعات** | — |
| **الشحن** | — |
| **المخزون** | — |
| **الموظفون** | — |
| **التشغيل** | — |

### كيانات مستنتجة

#### 2.1 SalesReport

| الحقل | النوع |
|-------|-------|
| period_start | datetime |
| period_end | datetime |
| total_sales | number |
| total_cost | number |
| total_discount | number |
| total_shipping | number |
| cod_fees | number |
| tax_amount | number |
| payment_gateway_fees | number |
| net_profit | number |

#### 2.2 ProductSalesReport

| الحقل | النوع |
|-------|-------|
| product_id | string |
| product_name | string |
| brand_name | string |
| price | number |
| sale_price | number |
| sale_end_date | datetime |
| product_type | enum (product/...) |

#### 2.3 WishlistReport

- "أمنيات العملاء" كقسم تقارير منفصل → يؤكد وجود Wishlist كمجال حقيقي

---

## 3. الطلبات (Orders) — `lRcUHtmQKrGp5Bw1hEMHlby5YAiGytFClB7skoNz.png`

### كيانات مستنتجة

#### 3.1 Order (حقول إضافية)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| status | enum | "بانتظار الدفع / بانتظار المراجعة / قيد التنفيذ / محذوف" |
| branch_id | string | فلتر "جميع الفروع" |
| tags[] | string[] | زر "+ وسم" |
| assigned_employee_id | string | زر "+ الموظف" |

#### 3.2 OrderActions (عمليات على الطلب)

| العملية | الوصف |
|---------|--------|
| تغيير حالة الطلب | status workflow |
| الشحن → إصدار البوليصة | ShippingLabel entity |
| تحصيل المبلغ → نسخ رابط الدفع | PaymentLink entity |
| فاتورة الطلب | Invoice entity |
| أخرى → تعديل الطلب | Order edit |

#### 3.3 Reservation (حجوزات)

- تبويب "الحجوزات" في قائمة الطلبات → كيان منفصل
| الحقل | النوع |
|-------|-------|
| id | string |
| order_id | string |
| customer_id | string |
| product_id | string |
| reserved_at | datetime |
| expires_at | datetime |
| status | enum (active/expired/converted) |

#### 3.4 PaymentLink

| الحقل | النوع |
|-------|-------|
| id | string |
| order_id | string |
| url | string |
| expires_at | datetime |
| is_used | boolean |

#### 3.5 ShippingLabel

| الحقل | النوع |
|-------|-------|
| id | string |
| order_id | string |
| tracking_number | string |
| carrier | string |
| label_url | string |
| issued_at | datetime |

---

## 4. المنتجات (Products Admin) — `2T9LMDfrpTA9PIcKQ3lCrvPSwWJhQ2mN7MloylQP.png`

### حقول إضافية مستنتجة

#### 4.1 Product (حقول إضافية)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| cost_price | number | "سعر التكلفة" |
| youtube_url | string | "أو أضف رابط يوتيوب" |
| image.alt | string | حقل ALT في رفع الصورة |

#### 4.2 ProductCustomField

| الحقل | النوع | المصدر |
|-------|-------|---------|
| id | string | قسم "الحقول المخصصة" |
| product_id | string | — |
| key | string | — |
| value | string | — |
| type | enum (text/number/date/boolean) | — |

#### 4.3 ProductPricingTier (الإسعارات)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| id | string | قسم "الإسعارات" |
| product_id | string | — |
| min_quantity | integer | — |
| price | number | — |
| customer_group_id | string (nullable) | — |

#### 4.4 ProductAttachment (المرفقات)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| id | string | "المرفقات" في صفحة المنتج |
| product_id | string | — |
| name | string | — |
| file_url | string | — |
| file_type | string | — |

#### 4.5 ProductSpec (مواصفات المنتج)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| id | string | "مواصفات المنتج" جدول |
| product_id | string | — |
| key | string | "ملحقات المنتج" |
| value | string | "بلاستيك" |

---

## 5. صفحة المنتج (Product Page) — `xpB8M6M9F8mSxUJKN1FwW3BTygDiRBu1uyojnZiz.png` + `IyXpHn3vNuaXDlkN8LhxZ4ZRlmENblVQ8Fm1dRhf.png`

### كيانات مستنتجة

#### 5.1 Breadcrumb

- الرئيسية > أدوات العناية > سيروم الشاي الأخضر
- يؤكد: `product.breadcrumb[]` = [{name, url}]

#### 5.2 ProductNote (ملاحظة العميل)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| note | string | "إضافة ملاحظة" في صفحة المنتج |
| → يُحفظ في CartItem.note | — | — |

#### 5.3 BNPL (اشتري الآن وادفع لاحقاً)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| provider | string (MisPay) | شعار MisPay |
| installments | integer (3) | "3 مدفوعات شهرية" |
| installment_amount | number (95.83) | — |
| total_amount | number (287.5) | — |
| fees | number | — |

#### 5.4 Product.weight

| الحقل | النوع | المصدر |
|-------|-------|---------|
| weight | number (10) | "الوزن: 10 كجم" |
| weight_unit | enum (kg/g/lb) | — |

#### 5.5 ProductTag (وسوم)

- "طبيعي", "عناية" → يؤكد وجود tags[] في المنتج

---

## 6. الموظفون (Employees) — `lRcUHtmQKrGp5Bw1hEMHlby5YAiGytFClB7skoNz.png` + `tdPLmHMCZN0IIttTWzSHMO9niSd0wNpZbXNGoFTa.png`

### كيانات مستنتجة

#### 6.1 Employee

| الحقل | النوع | المصدر |
|-------|-------|---------|
| id | string | — |
| store_id | string | — |
| name | string | — |
| email | string | — |
| role | enum | — |
| permissions[] | string[] | — |
| is_active | boolean | — |

#### 6.2 EmployeeOrderAssignment

| الحقل | النوع | المصدر |
|-------|-------|---------|
| order_id | string | زر "+ الموظف" في الطلبات |
| employee_id | string | — |
| assigned_at | datetime | — |

---

## 7. الثيم والمكونات (Theme) — `unnamed.png` + `b8hfrq6x2si...` + `nSLue58BU9mZ...` + `set-up-theme-16new.png` + `2.webp`

### كيانات مستنتجة

#### 7.1 ThemeComponent (أنواع مكونات الصفحة)

| اسم المكون | المسار |
|-----------|--------|
| صور متحركة (محسنة) | home.enhanced-slider |
| روابط سريعة | home.main-links |
| الماركات التجارية | home.brands |
| منتجات متحركة مع خلفية | home.slider-products-with-header |
| صور مربعة (محسنة) | home.enhanced-square-banners |
| منتجات مميزة | — |
| آراء العملاء | — |
| مميزات المتجر | — |
| فيديو يوتيوب | — |
| بانر عريض | — |
| قائمة عناصر | — |
| خلفية ثابتة | — |
| منتجات ثابتة | — |
| منتجات متحركة | — |

#### 7.2 ThemeField (Schema للحقول)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| unique_id | string | "Unique ID: vertical_fixed_products" |
| type | enum (static/string/numeric/boolean/list/collection) | — |
| is_required | boolean | "Required" checkbox |
| is_public | boolean | "Public" checkbox |
| default_value | any | "Default Value: false" |
| helper_text | string | "Helper Text" |
| label_html | string | "Label HTML" |

#### 7.3 ThemeSettings (إعدادات إضافية)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| use_arabic_numerals | boolean | "استخدام الأرقام العربية" |
| show_salla_badge | boolean | "عرض عبارة صنع بإتقان على منصة سلة" |
| store_color | string (hex) | "لون المتجر" |
| font_type | enum (default/google/custom) | "اختر الخط" |
| font_family | string | "الخطوط الإفتراضية" |
| breadcrumb_enabled | boolean | "ميزة مسار التنقل" |
| unify_card_height | boolean | "توحيد ارتفاع المنتجات" |
| product_image_display | enum (cover/contain/...) | "عرض صورة المنتج" |
| header_dark | boolean | "شريط علوي داكن" |
| show_header_links | boolean | "عرض روابط الصفحات الهامة في الشريط العلوي" |
| footer_dark | boolean | "الوضع الداكن" (footer) |
| product_sticky_cta | boolean | "تثبيت زر الإضافة والكمية أسفل شاشة الجوال" |
| show_product_tags | boolean | "اظهار الوسوم" |
| product_image_slider_type | enum | "طريقة عرض الصور في سليدر صور المنتج" |

---

## 8. Partners Portal — `set-up-theme-16new.png`

### كيانات مستنتجة

#### 8.1 PartnerApp

| الحقل | النوع | المصدر |
|-------|-------|---------|
| id | string | — |
| name | string | — |
| type | enum (app/theme/service) | My Apps / My Themes / My Services |
| status | enum (active/pending/rejected) | — |

#### 8.2 Influencer

| الحقل | النوع | المصدر |
|-------|-------|---------|
| id | string | قسم "Influencer" في Partners |
| name | string | — |
| commission_rate | number | — |
| referral_code | string | — |
| total_sales | number | — |

#### 8.3 ThemeFeature (ميزات الثيم)

| الحقل | النوع | المصدر |
|-------|-------|---------|
| id | string | — |
| theme_id | string | — |
| feature_key | enum (mega_menu/store_fonts/store_colors/breadcrumb/unite_cards_height/featured_products/fixed_banner/...) | "Features (15)" |
| is_enabled | boolean | — |

---

## 9. الواجهة الأمامية (Storefront) — `QLHHS9...` + `hdfcyElq...` + `xpB8M6...`

### كيانات مستنتجة

#### 9.1 Wishlist (مؤكد بصرياً)

- أيقونة ♡ على كل بطاقة منتج + في صفحة المنتج
- يؤكد: `WishlistItem` كيان حقيقي

#### 9.2 ProductShare

| الحقل | النوع | المصدر |
|-------|-------|---------|
| → زر مشاركة في صفحة المنتج | — | أيقونة share في صفحة المنتج |

#### 9.3 CurrencySelector

- "ر.س" مع علم السعودية → يؤكد multi-currency في الواجهة

#### 9.4 CartBadge

- أيقونة عربة مع رقم "1" → يؤكد cart_items_count في header

---

## 10. ملخص المجالات الجديدة المكتشفة

| المجال | الأولوية | الحالة في الخريطة الحالية |
|--------|---------|--------------------------|
| **Analytics/Reports** | P1 | ❌ غائب تماماً |
| **MonthlyGoal** | P2 | ❌ غائب |
| **Reservation** | P1 | ❌ غائب |
| **PaymentLink** | P1 | ❌ غائب |
| **ShippingLabel** | P1 | ❌ غائب |
| **Employee + Assignment** | P1 | ❌ غائب |
| **ProductCustomField** | P1 | ❌ غائب |
| **ProductPricingTier** | P2 | ❌ غائب |
| **ProductAttachment** | P1 | ❌ غائب |
| **ProductSpec** | P1 | ❌ غائب |
| **BNPL** | P2 | ❌ غائب |
| **ThemeFeature** | P1 | ⚠️ جزئي |
| **ThemeField Schema** | P1 | ⚠️ جزئي |
| **ThemeSettings** (حقول إضافية) | P1 | ⚠️ جزئي |
| **Influencer** | P2 | ⚠️ في runtime.ts فقط |
| **PartnerApp** | P3 | ❌ غائب |
| **Wishlist** | P1 | ❌ غائب (مؤكد الآن) |
| **AbandonedCart** | P1 | ❌ غائب (مؤكد الآن) |
| **Order.tags** | P1 | ❌ ناقص |
| **Order.assigned_employee** | P1 | ❌ ناقص |
| **CartItem.note** | P1 | ❌ ناقص |
| **Product.weight** | P1 | ❌ ناقص |
| **Product.breadcrumb** | P1 | ❌ ناقص |
| **Product.youtube_url** | P2 | ❌ ناقص |
| **SalesReport** | P1 | ❌ غائب |
