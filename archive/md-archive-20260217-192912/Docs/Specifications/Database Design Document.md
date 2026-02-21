Database Design Document
VTDR – Virtual Theme Development Runtime
DB Engine: SQLite
الهدف: تخزين “State + Data + Scenarios + Snapshots” (الثيمات كملفات على القرص)

1. مبادئ التخزين

ملفات الثيم (templates/assets) تبقى على File System

قاعدة البيانات تخزن:

تعريفات الثيم (metadata + capabilities + schemas)

المتاجر الافتراضية وحالتها

السيناريوهات (Profiles)

بيانات المحتوى (Products/…)

ربط البيانات بالكومبوننتات

النسخ/اللقطات (Snapshots)

سجل الأحداث (Audit)

2. ERD مختصر نصيًا

Theme (1) ── (N) ThemeVersion

VirtualStore (1) ── (N) Scenario

Scenario (1) ── (1) StoreState

Scenario (1) ── (N) DataEntity

Scenario (1) ── (N) DataBinding

Scenario (1) ── (N) Snapshot

StoreState (1) ── (N) ComponentState

ThemeVersion (1) ── (N) ComponentRegistryItem (اختياري للتسريع)

3. الجداول الأساسية
   3.1 themes

يمثل الثيم ككيان عام.

Columns

id TEXT PK (مثل: raed)

name_ar TEXT

name_en TEXT

repository TEXT

author_email TEXT

support_url TEXT

description_ar TEXT

description_en TEXT

created_at INTEGER

updated_at INTEGER

Indexes

idx_themes_updated_at

3.2 theme_versions

نسخ الثيم (Versioned Contract).

Columns

id TEXT PK (uuid)

theme_id TEXT FK → themes.id

version TEXT (مثل: 1.0.0)

fs_path TEXT (مسار ملفات النسخة على القرص)

contract_json TEXT (JSON) ← capabilities + settings schema + components schema

capabilities_json TEXT (JSON) ← اختياري لفصل سريع

schema_hash TEXT (للتأكد من التطابق)

created_at INTEGER

Constraints

UNIQUE(theme_id, version)

Indexes

idx_theme_versions_theme_id

idx_theme_versions_version

3.3 virtual_stores

يمثل متجر افتراضي (كيان مستقل).

Columns

id TEXT PK (uuid)

title TEXT

default_locale TEXT (ar-SA مثلاً)

default_currency TEXT (SAR)

created_at INTEGER

updated_at INTEGER

3.4 scenarios

يمثل Profile/Scenario داخل متجر افتراضي (Electronics/Empty/Heavy Data).

Columns

id TEXT PK (uuid)

store_id TEXT FK → virtual_stores.id

name TEXT

is_active INTEGER (0/1) (نشط داخل المتجر)

meta_json TEXT (JSON) (اختياري: وصف/تاجز/ملاحظات)

created_at INTEGER

updated_at INTEGER

Indexes

idx_scenarios_store_id

idx_scenarios_active (store_id, is_active)

4. طبقة الحالة (State)
   4.1 store_state

الحالة العامة المرتبطة بالسيناريو (Theme/Version/Page/Viewport…).

Columns

scenario_id TEXT PK FK → scenarios.id

theme_id TEXT FK → themes.id

theme_version_id TEXT FK → theme_versions.id

active_page TEXT (home/product/category/custom…)

viewport TEXT (desktop/mobile/tablet)

settings_json TEXT (JSON) ← إعدادات الثيم (Theme Settings) كمجموعة

updated_at INTEGER

ملاحظة: settings_json هنا هو “Theme Settings State” كسجل واحد.

4.2 component_state

حالة كل كومبوننت/مسار داخل السيناريو.

Columns

id TEXT PK (uuid)

scenario_id TEXT FK → scenarios.id

component_path TEXT (مثل: home.enhanced-slider)

component_key TEXT (اختياري)

instance_order INTEGER (للترتيب في الصفحة)

settings_json TEXT (JSON) ← إعدادات الكومبوننت

visibility_json TEXT (JSON) ← قواعد الظهور

updated_at INTEGER

Constraints

UNIQUE(scenario_id, component_path, instance_order)

Indexes

idx_component_state_scenario

idx_component_state_path (scenario_id, component_path)

4.3 page_composition

تركيب الصفحة (sections/slots/layout) لكل سيناريو.

Columns

id TEXT PK (uuid)

scenario_id TEXT FK → scenarios.id

page TEXT (home/product/…)

composition_json TEXT (JSON) ← شجرة الأقسام + المكونات + slots

updated_at INTEGER

Constraints

UNIQUE(scenario_id, page)

Indexes

idx_page_composition_scenario_page

5. طبقة البيانات (DATA_SCHEMA_SPEC)
   5.1 data_entities

تخزين كل بيانات المحتوى (Products/Categories/Brands/Media/Reviews/…)
بنموذج موحد مرن.

Columns

id TEXT PK (uuid)

scenario_id TEXT FK → scenarios.id

entity_type TEXT (product/category/brand/media/content/user/interaction/collection…)

entity_key TEXT (اختياري: p1, c-featured, … لتسهيل الربط اليدوي)

payload_json TEXT (JSON) ← الكائن الكامل

created_at INTEGER

updated_at INTEGER

Constraints

UNIQUE(scenario_id, entity_type, entity_key) (إذا استخدمت entity_key)

Indexes

idx_data_entities_scenario_type (scenario_id, entity_type)

idx_data_entities_scenario_key (scenario_id, entity_key)

هذا الجدول يسمح بتخزين “منتج له جدول مواصفات” و “منتج له ألوان” بدون تغيير schema.

5.2 collections

تجميعات عرض (يدوية أو عبر قواعد).

Columns

id TEXT PK (uuid)

scenario_id TEXT FK → scenarios.id

name TEXT

source TEXT (manual/rule)

rules_json TEXT (JSON) (اختياري)

created_at INTEGER

updated_at INTEGER

Indexes

idx_collections_scenario

5.3 collection_items

ربط المنتجات داخل Collection.

Columns

collection_id TEXT FK → collections.id

entity_id TEXT FK → data_entities.id (عادة product)

sort_order INTEGER

PK

(collection_id, entity_id)

Indexes

idx_collection_items_collection

5.4 data_bindings

ربط بيانات بمسارات كومبوننت (Data Binding).

Columns

id TEXT PK (uuid)

scenario_id TEXT FK → scenarios.id

component_path TEXT

binding_key TEXT (مثل: products / categories / banners / slides / custom)

source_type TEXT (entity/collection/query/manual)

source_ref TEXT (id أو expression)

binding_json TEXT (JSON) ← تفاصيل الربط (filters, limits, mapping)

updated_at INTEGER

Indexes

idx_bindings_scenario_component (scenario_id, component_path)

6. Snapshots / Versions داخل النظام
   6.1 snapshots

لقطات من حالة السيناريو (للاسترجاع والمقارنة).

Columns

id TEXT PK (uuid)

scenario_id TEXT FK → scenarios.id

label TEXT

snapshot_json TEXT (JSON)
يحتوي نسخة مجمدة من:

store_state

component_state

page_composition

data_bindings

(اختياري) ملخص data_entities

created_at INTEGER

Indexes

idx_snapshots_scenario_created

7. Preview Cache (اختياري لكنه عملي)
   7.1 preview_cache

تخزين ناتج render للصفحات لتسريع المعاينة.

Columns

id TEXT PK (uuid)

scenario_id TEXT

page TEXT

viewport TEXT

context_hash TEXT

html TEXT

created_at INTEGER

Indexes

idx_preview_cache_lookup (scenario_id, page, viewport, context_hash)

8. Audit / Events
   8.1 runtime_events

سجل تغييرات المستخدم/النظام.

Columns

id TEXT PK (uuid)

scenario_id TEXT

event_type TEXT (SETTING_CHANGED / COMPONENT_UPDATED / DATA_UPDATED / SNAPSHOT_CREATED / THEME_SWITCHED …)

ref TEXT (component_path أو entity_id أو page…)

payload_json TEXT (JSON) (diff أو بيانات مختصرة)

created_at INTEGER

Indexes

idx_events_scenario_time (scenario_id, created_at)

9. ملاحظات تنفيذية مختصرة (ملزمة)

كل حقول JSON تُخزن كـ TEXT في SQLite

الـ API تتعامل مع JSON كما هو (encode/decode)

أي “تطابق 100%” يعتمد على:

contract_json في theme_versions

settings_json + component_state + data_bindings + data_entities

10. الحد الأدنى للتشغيل MVP (أقل مجموعة جداول)

لو أردت MVP سريع جدًا، يكفي:

themes

theme_versions

virtual_stores

scenarios

store_state

component_state

data_entities

data_bindings

والباقي (snapshots/cache/audit) يضاف لاحقًا.
