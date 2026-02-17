import React, { useState, useEffect } from 'react';
import { apiUrl } from '../services/api';

interface PageComponent {
  id: string;
  name: string;
  icon?: string;
  propsSchema: any;
  defaultProps: any;
  isThemeSpecial?: boolean;
  path?: string;
  fields?: any[];
}

interface PageElement {
  id: string;
  componentId: string;
  props: any;
}

// Utility to parse fields from twilight.json component schema
function parsePropsSchema(fields: any[]): { [key: string]: any } {
  const schema: any = {};
  fields?.forEach(field => {
    if (field.type === 'static') return;
    schema[field.id] = field.format || field.type || 'string';
  });
  return schema;
}

function pickLocalizedText(value: any): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && !Array.isArray(value)) {
    if (typeof value.ar === 'string' && value.ar.trim()) return value.ar;
    if (typeof value.en === 'string' && value.en.trim()) return value.en;
    const firstString = Object.values(value).find((entry: any) => typeof entry === 'string' && entry.trim());
    if (typeof firstString === 'string') return firstString;
  }
  return String(value);
}

function normalizeItemsFieldValue(value: any): string[] {
  const source = Array.isArray(value) ? value : [value];
  return Array.from(
    new Set(
      source
        .map((entry: any) => {
          if (typeof entry === 'string' || typeof entry === 'number') return String(entry);
          if (entry && typeof entry === 'object') {
            if (entry.id != null) return String(entry.id);
            if (entry.value != null) return String(entry.value);
          }
          return '';
        })
        .map((id: string) => id.trim())
        .filter(Boolean)
    )
  );
}

function normalizeVariableListValue(value: any): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const first = value.find((entry) => entry != null);
    return normalizeVariableListValue(first);
  }
  if (value && typeof value === 'object') {
    const candidate = (value as any).url ?? (value as any).value ?? (value as any).path ?? '';
    return typeof candidate === 'string' ? candidate : String(candidate || '');
  }
  return '';
}

function getCollectionFieldPathTail(fieldId: string): string {
  const normalized = String(fieldId || '');
  const parts = normalized.split('.');
  return parts[parts.length - 1] || normalized;
}

function normalizeCollectionItems(value: any): Record<string, any>[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({ ...entry }));
}

function getCollectionItemValue(item: any, fieldId: string): any {
  if (!item || typeof item !== 'object') return undefined;
  if (item[fieldId] != null) return item[fieldId];
  const shortKey = getCollectionFieldPathTail(fieldId);
  return item[shortKey];
}

function setCollectionItemValue(item: any, fieldId: string, value: any) {
  const next = { ...(item || {}) };
  next[fieldId] = value;
  const shortKey = getCollectionFieldPathTail(fieldId);
  if (shortKey !== fieldId && Object.prototype.hasOwnProperty.call(next, shortKey)) {
    delete next[shortKey];
  }
  return next;
}

function getCollectionSubFieldDefaultValue(subField: any): any {
  if (subField?.type === 'boolean') return Boolean(subField.value);
  if (subField?.type === 'number' || subField?.format === 'integer') {
    const parsed = Number(subField?.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (subField?.type === 'items' && subField?.format === 'variable-list') {
    return normalizeVariableListValue(subField?.value);
  }
  if (typeof subField?.value !== 'undefined') return pickLocalizedText(subField.value);
  return '';
}

function createCollectionItemTemplate(field: any): Record<string, any> {
  const template: Record<string, any> = {};
  (field?.fields ?? []).forEach((subField: any) => {
    if (!subField?.id) return;
    template[subField.id] = getCollectionSubFieldDefaultValue(subField);
  });
  return template;
}

type VariableListSourceEntry = {
  key: string;
  value: string;
  label: string;
};

type VariableListOption = {
  value: string;
  label: string;
  url?: string;
};

type VariableListSelection = {
  source: string;
  value: string;
  url: string;
};

function getStaticVariableSourceUrl(source: string): string {
  const normalized = String(source || '').trim().toLowerCase();
  if (normalized === 'offers_link') return '/offers';
  if (normalized === 'brands_link') return '/brands';
  if (normalized === 'blog_link') return '/blog';
  return '';
}

function getVariableListSources(field: any): VariableListSourceEntry[] {
  const raw = Array.isArray(field?.variableSources)
    ? field.variableSources
    : Array.isArray(field?.sources)
      ? field.sources
      : [];

  return raw
    .map((entry: any) => {
      const value = String(entry?.value ?? entry?.key ?? '').trim().toLowerCase();
      if (!value) return null;
      return {
        key: String(entry?.key || value),
        value,
        label: pickLocalizedText(entry?.label || value)
      };
    })
    .filter(Boolean) as VariableListSourceEntry[];
}

function getVariableListOptionsBySource(field: any): Record<string, VariableListOption[]> {
  const raw = field?.variableOptions;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const result: Record<string, VariableListOption[]> = {};
  Object.entries(raw).forEach(([sourceKey, options]) => {
    const key = String(sourceKey || '').trim().toLowerCase();
    if (!key || !Array.isArray(options)) return;
    result[key] = options
      .map((option: any) => ({
        value: String(option?.value ?? option?.id ?? '').trim(),
        label: pickLocalizedText(option?.label || option?.name || option?.value || option?.id || ''),
        url: typeof option?.url === 'string' ? option.url : ''
      }))
      .filter((option: VariableListOption) => Boolean(option.value));
  });

  return result;
}

function parseVariableListSelection(rawValue: any, fallbackSource?: any, fallbackValue?: any): VariableListSelection {
  const hintSource = String(fallbackSource || '').trim().toLowerCase();
  const hintValue = String(fallbackValue || '').trim();

  if (typeof rawValue === 'string') {
    return {
      source: hintSource || 'custom',
      value: hintValue || rawValue,
      url: rawValue
    };
  }

  if (Array.isArray(rawValue)) {
    const first = rawValue.find((entry) => entry != null);
    return parseVariableListSelection(first, hintSource, hintValue);
  }

  if (rawValue && typeof rawValue === 'object') {
    const source = String((rawValue as any).type ?? (rawValue as any).source ?? (rawValue as any).__type ?? hintSource ?? '')
      .trim()
      .toLowerCase();
    const value = String((rawValue as any).value ?? (rawValue as any).id ?? (rawValue as any).__value ?? hintValue ?? '').trim();
    const url = normalizeVariableListValue(rawValue);
    return {
      source: source || 'custom',
      value,
      url
    };
  }

  return {
    source: hintSource || '',
    value: hintValue || '',
    url: ''
  };
}

function buildVariableListStoreValue(selection: VariableListSelection) {
  const source = String(selection.source || '').trim().toLowerCase();
  const value = String(selection.value || '').trim();
  const url = String(selection.url || '').trim();
  const staticUrl = getStaticVariableSourceUrl(source);

  if (!source) return url || '';
  if (source === 'custom') {
    return {
      type: 'custom',
      value: url || value,
      url: url || value
    };
  }
  if (staticUrl) {
    return {
      type: source,
      value: value || source,
      url: staticUrl
    };
  }
  return {
    type: source,
    value,
    url
  };
}

function filterVariableOptions(
  options: VariableListOption[],
  query: string,
  selectedValue?: string
): VariableListOption[] {
  const normalizedQuery = String(query || '').trim().toLowerCase();
  if (!normalizedQuery) return options;

  return options.filter((option) => {
    if (selectedValue && option.value === selectedValue) return true;
    const haystack = `${option.label} ${option.value} ${option.url || ''}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function getCollectionItemMetaValue(item: any, fieldId: string, suffix: 'type' | 'value') {
  if (!item || typeof item !== 'object') return '';
  const fullKey = `${fieldId}__${suffix}`;
  if (item[fullKey] != null) return item[fullKey];
  const shortKey = `${getCollectionFieldPathTail(fieldId)}__${suffix}`;
  return item[shortKey];
}

function setCollectionItemMetaValue(item: any, fieldId: string, suffix: 'type' | 'value', value: any) {
  const next = { ...(item || {}) };
  const fullKey = `${fieldId}__${suffix}`;
  next[fullKey] = value;
  const shortKey = `${getCollectionFieldPathTail(fieldId)}__${suffix}`;
  if (shortKey !== fullKey && Object.prototype.hasOwnProperty.call(next, shortKey)) {
    delete next[shortKey];
  }
  return next;
}

function applyVariableSelectionToCollectionItem(item: any, fieldId: string, selection: VariableListSelection) {
  let next = setCollectionItemValue(item, fieldId, buildVariableListStoreValue(selection));
  next = setCollectionItemMetaValue(next, fieldId, 'type', selection.source);
  next = setCollectionItemMetaValue(next, fieldId, 'value', selection.value || selection.url || '');
  return next;
}

function getFieldDefaultValue(field: any) {
  if (field.type === 'boolean') return Boolean(field.value);
  if (field.type === 'collection' || field.format === 'collection') {
    return Array.isArray(field.value) ? field.value : [];
  }
  if (field.type === 'items' && field.format === 'dropdown-list') {
    const selected = Array.isArray(field.selected) ? field.selected : [];
    if (selected.length > 0) return normalizeItemsFieldValue(selected);
    return normalizeItemsFieldValue(field.value);
  }
  if (field.type === 'items' && field.format === 'variable-list') {
    return field.value ?? '';
  }
  if (typeof field.value !== 'undefined') {
    return pickLocalizedText(field.value);
  }
  return '';
}

function getDefaultProps(fields: any[]): { [key: string]: any } {
  const defaults: any = {};
  fields?.forEach(field => {
    if (field.type === 'static') return;
    defaults[field.id] = getFieldDefaultValue(field);
  });
  return defaults;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

const PAGES = [
  { id: 'home', name: 'الرئيسية (index.twig)', path: 'home' },
  { id: 'product-single', name: 'منتج مفرد (product/single.twig)', path: 'product.single' },
  { id: 'product-list', name: 'قائمة المنتجات (product/index.twig)', path: 'product' },
  { id: 'category', name: 'تصنيف (category/index.twig)', path: 'category' },
  { id: 'cart', name: 'السلة (cart.twig)', path: 'cart' },
  { id: 'profile', name: 'الملف الشخصي (customer/profile.twig)', path: 'customer.profile' },
  { id: 'orders-list', name: 'قائمة الطلبات (customer/orders/index.twig)', path: 'customer.orders' },
  { id: 'order-details', name: 'تفاصيل الطلب (customer/orders/single.twig)', path: 'customer.orders.single' },
  { id: 'wishlist', name: 'المفضلة (customer/wishlist.twig)', path: 'customer.wishlist' },
  { id: 'notifications', name: 'الإشعارات (customer/notifications.twig)', path: 'customer.notifications' },
  { id: 'blog-list', name: 'قائمة المدونة (blog/index.twig)', path: 'blog' },
  { id: 'blog-single', name: 'مقالة مدونة (blog/single.twig)', path: 'blog.single' },
  { id: 'brands-list', name: 'قائمة الماركات (brands/index.twig)', path: 'brands' },
  { id: 'brand-single', name: 'ماركة مفردة (brands/single.twig)', path: 'brands.single' },
  { id: 'thank-you', name: 'صفحة الشكر (thank-you.twig)', path: 'thank-you' },
  { id: 'landing-page', name: 'صفحة هبوط (landing-page.twig)', path: 'landing-page' },
  { id: 'page-single', name: 'صفحة ثابتة (page-single.twig)', path: 'page-single' },
];

type PageElementsMap = { [pageId: string]: PageElement[] };

const createEmptyElementsMap = (): PageElementsMap =>
  PAGES.reduce((acc, page) => {
    acc[page.id] = [];
    return acc;
  }, {} as PageElementsMap);


interface PageComponentsEditorProps {
  selectedStoreId: string | null;
}

const PageComponentsEditor: React.FC<PageComponentsEditorProps> = ({ selectedStoreId }) => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [elementsMap, setElementsMap] = useState<PageElementsMap>(createEmptyElementsMap());
  const [showAdd, setShowAdd] = useState(false);
  const [editingElement, setEditingElement] = useState<PageElement | null>(null);
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, string>>({});
  const [jsonDraftErrors, setJsonDraftErrors] = useState<Record<string, string>>({});
  const [variableOptionSearches, setVariableOptionSearches] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [availableComponents, setAvailableComponents] = useState<PageComponent[]>([]);

  // Load theme components from API (store scoped)
  useEffect(() => {
    if (!selectedStoreId) {
      setAvailableComponents([]);
      return;
    }

    fetch(apiUrl('v1/theme/components'), {
      headers: {
        'X-VTDR-Store-Id': selectedStoreId,
        'Context-Store-Id': selectedStoreId
      }
    })
      .then(res => res.json())
      .then((response) => {
        const components = response?.data?.components || [];
        const comps = components.map((comp: any) => ({
          id: comp.key,
          name: comp.title?.ar || comp.title?.en || comp.key,
          icon: comp.icon || '🧩',
          propsSchema: parsePropsSchema(comp.fields),
          defaultProps: getDefaultProps(comp.fields),
          isThemeSpecial: true,
          path: comp.path || '',
          fields: comp.fields || [],
        }));
        setAvailableComponents(comps);
      })
      .catch(() => {
        setAvailableComponents([]);
      });
  }, [selectedStoreId]);

  // Load existing saved page compositions from theme settings
  useEffect(() => {
    if (!selectedStoreId) {
      setElementsMap(createEmptyElementsMap());
      return;
    }

    fetch(apiUrl('v1/theme/settings'), {
      headers: {
        'X-VTDR-Store-Id': selectedStoreId,
        'Context-Store-Id': selectedStoreId
      }
    })
      .then(res => res.json())
      .then((response) => {
        const saved = response?.data?.values?.page_compositions;
        const nextMap = createEmptyElementsMap();
        if (saved && typeof saved === 'object') {
          Object.entries(saved).forEach(([pageId, value]) => {
            if (!Array.isArray(value)) return;
            nextMap[pageId] = value.map((entry: any) => ({
              id: String(entry?.id || randomId()),
              componentId: String(entry?.componentId || entry?.id || ''),
              props: entry?.props && typeof entry.props === 'object' ? entry.props : {}
            })).filter((entry: PageElement) => Boolean(entry.componentId));
          });
        }
        setElementsMap(nextMap);
      })
      .catch(() => {
        setElementsMap(createEmptyElementsMap());
      });
  }, [selectedStoreId]);

  useEffect(() => {
    if (!editingElement) {
      setJsonDrafts({});
      setJsonDraftErrors({});
      setVariableOptionSearches({});
      return;
    }

    const component = availableComponents.find(c => c.id === editingElement.componentId);
    if (!component) {
      setJsonDrafts({});
      setJsonDraftErrors({});
      setVariableOptionSearches({});
      return;
    }

    const nextDrafts: Record<string, string> = {};
    (component.fields ?? []).forEach((field: any) => {
      if (field.type === 'collection' || field.format === 'collection') {
        const value = editingElement.props[field.id];
        const normalizedValue = Array.isArray(value) ? value : [];
        nextDrafts[field.id] = JSON.stringify(normalizedValue, null, 2);
      }
    });
    setJsonDrafts(nextDrafts);
    setJsonDraftErrors({});
    setVariableOptionSearches({});
  }, [editingElement, availableComponents]);

  // Filter components for the selected page only
  const selectedPageObj = PAGES.find(p => p.id === selectedPage);
  const pagePath = selectedPageObj?.path || '';
  const pageComponents = availableComponents.filter(c => (c.path || '').startsWith(pagePath));
  const elements = elementsMap[selectedPage] || [];

  const setElements = (els: PageElement[]) => setElementsMap(map => ({ ...map, [selectedPage]: els }));

  const handleAddComponent = (comp: PageComponent) => {
    setElements([...elements, { id: randomId(), componentId: comp.id, props: { ...comp.defaultProps } }]);
    setShowAdd(false);
  };

  const handleEditProps = (el: PageElement, newProps: any) => {
    setElements(elements.map(e => e.id === el.id ? { ...e, props: newProps } : e));
    setEditingElement(null);
  };

  const handleDelete = (id: string) => {
    setElements(elements.filter(e => e.id !== id));
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= elements.length) return;
    const arr = [...elements];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setElements(arr);
  };

  const setEditingProp = (fieldId: string, value: any) => {
    setEditingElement((current) => {
      if (!current) return current;
      return {
        ...current,
        props: { ...current.props, [fieldId]: value }
      };
    });
  };

  const updateEditingCollection = (
    fieldId: string,
    updater: (items: Record<string, any>[]) => Record<string, any>[]
  ) => {
    setEditingElement((current) => {
      if (!current) return current;
      const currentItems = normalizeCollectionItems(current.props?.[fieldId]);
      const nextItems = updater(currentItems);
      return {
        ...current,
        props: { ...current.props, [fieldId]: nextItems }
      };
    });
  };

  const getVariableSearch = (key: string) => variableOptionSearches[key] || '';
  const setVariableSearch = (key: string, value: string) => {
    setVariableOptionSearches((current) => ({ ...current, [key]: value }));
  };
  const clearVariableSearch = (key: string) => {
    setVariableOptionSearches((current) => {
      if (!Object.prototype.hasOwnProperty.call(current, key)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleSavePageState = async () => {
    if (!selectedStoreId) {
      alert('يرجى اختيار متجر أولاً');
      return;
    }
    const storeId = selectedStoreId;
    try {
      await fetch(apiUrl('v1/theme/settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-VTDR-Store-Id': storeId,
          'Context-Store-Id': storeId
        },
        body: JSON.stringify({
          page_compositions: elementsMap
        })
      });
      alert('تم حفظ ترتيب وخصائص المكونات بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', direction: 'rtl' }}>
      {/* Pages Sidebar */}
      <div style={{ minWidth: 180, background: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 16, height: '100%' }}>
        <h4 style={{ marginBottom: 16, fontSize: 16 }}>الصفحات</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PAGES.map(page => (
            <li key={page.id}>
              <button
                onClick={() => setSelectedPage(page.id)}
                style={{
                  width: '100%',
                  background: selectedPage === page.id ? '#e0f7fa' : 'none',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 12px',
                  marginBottom: 6,
                  fontWeight: selectedPage === page.id ? 700 : 400,
                  color: selectedPage === page.id ? '#2196f3' : '#222',
                  cursor: 'pointer',
                  textAlign: 'right',
                }}
              >
                {page.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Add Component Drawer */}
      {showAdd && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 24, minWidth: 340 }}>
          <h3 style={{ marginBottom: 16 }}>إضافة عنصر جديد</h3>
          <input
            type="text"
            placeholder="اسم العنصر..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #eee' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {pageComponents.filter(c => c.name.includes(search)).map(comp => (
              <button
                key={comp.id}
                onClick={() => handleAddComponent(comp)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, border: '1px solid #eee', borderRadius: 8, background: comp.isThemeSpecial ? '#e0f7fa' : '#f9f9f9', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 32 }}>{comp.icon}</span>
                <span style={{ fontSize: 14, marginTop: 8 }}>{comp.name}</span>
                {comp.isThemeSpecial && <span style={{ color: '#f59e0b', fontSize: 12 }}>★ خاص بالثيم</span>}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAdd(false)} style={{ marginTop: 16 }}>إغلاق</button>
        </div>
      )}
      {/* Main Editor */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 24 }}>
        <h2 style={{ marginBottom: 16 }}>عناصر {PAGES.find(p => p.id === selectedPage)?.name}</h2>
        <button onClick={() => setShowAdd(true)} style={{ marginBottom: 16, background: '#e0f7fa', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600 }}>+ إضافة عنصر جديد</button>
        {elements.length === 0 && <div style={{ color: '#888', margin: '32px 0' }}>لا توجد عناصر مضافة بعد.</div>}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {elements.map((el, idx) => {
            const comp = availableComponents.find(c => c.id === el.componentId);
            if (!comp) return null;
            return (
              <li key={el.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, background: '#f9f9f9', borderRadius: 8, padding: 12 }}>
                <span style={{ fontSize: 24 }}>{comp.icon}</span>
                <span style={{ flex: 1 }}>{comp.name}</span>
                <button onClick={() => setEditingElement(el)} style={{ background: 'none', border: 'none', color: '#2196f3', cursor: 'pointer' }}>تعديل</button>
                <button onClick={() => handleDelete(el.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>حذف</button>
                <button onClick={() => handleMove(idx, idx - 1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>↑</button>
                <button onClick={() => handleMove(idx, idx + 1)} disabled={idx === elements.length - 1} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>↓</button>
              </li>
            );
          })}
        </ul>
        <button style={{ marginTop: 24, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 16 }} onClick={handleSavePageState}>حفظ التغييرات</button>
      </div>
      {/* Edit Props Drawer */}
      {editingElement && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 24, minWidth: 340 }}>
          <h3 style={{ marginBottom: 16 }}>تعديل خصائص العنصر</h3>
          {(() => {
            const comp = availableComponents.find(c => c.id === editingElement.componentId);
            if (!comp) return null;
            return (comp.fields ?? []).map((field: any) => {
              if (field.type === 'static') return null;
              if (field.format === 'dropdown-list' && Array.isArray(field.options)) {
                if (field.type === 'items') {
                  const selectedValues = normalizeItemsFieldValue(editingElement.props[field.id]);
                  return (
                    <div key={field.id} style={{ marginBottom: 12 }}>
                      <label>{field.label}</label>
                      <select
                        multiple
                        value={selectedValues}
                        onChange={e => {
                          const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                          setEditingProp(field.id, selected);
                        }}
                        style={{ width: '100%', minHeight: 120, padding: 8, borderRadius: 6, border: '1px solid #eee' }}
                      >
                        {field.options.map((opt: any) => (
                          <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div style={{ marginTop: 4, color: '#64748b', fontSize: 12 }}>اختيار متعدد</div>
                    </div>
                  );
                }

                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <label>{field.label}</label>
                    <select
                      value={String(editingElement.props[field.id] || '')}
                      onChange={e => setEditingProp(field.id, e.target.value)}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee' }}
                    >
                      {field.options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'collection' || field.format === 'collection') {
                const subFields = Array.isArray(field.fields)
                  ? field.fields.filter((subField: any) => Boolean(subField?.id))
                  : [];

                if (subFields.length > 0) {
                  const items = normalizeCollectionItems(editingElement.props[field.id]);
                  const minLength = Number(field.minLength ?? 0);
                  const maxLength = Number(field.maxLength ?? 0);
                  const canAdd = !Number.isFinite(maxLength) || maxLength <= 0 || items.length < maxLength;

                  return (
                    <div key={field.id} style={{ marginBottom: 16, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontWeight: 600 }}>{field.label || field.id}</label>
                        <span style={{ color: '#64748b', fontSize: 12 }}>
                          {items.length}{maxLength > 0 ? ` / ${maxLength}` : ''}
                        </span>
                      </div>

                      {items.length === 0 && (
                        <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>
                          لا توجد عناصر مضافة بعد.
                        </div>
                      )}

                      {items.map((item: Record<string, any>, rowIndex: number) => (
                        <div key={`${field.id}-${rowIndex}`} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 10, background: '#fafafa' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <strong style={{ fontSize: 13 }}>
                              {(field.item_label || 'عنصر')} #{rowIndex + 1}
                            </strong>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => updateEditingCollection(field.id, (currentItems) => {
                                  if (rowIndex <= 0) return currentItems;
                                  const next = [...currentItems];
                                  const [moved] = next.splice(rowIndex, 1);
                                  next.splice(rowIndex - 1, 0, moved);
                                  return next;
                                })}
                                disabled={rowIndex === 0}
                                style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '2px 8px', background: '#fff', cursor: rowIndex === 0 ? 'not-allowed' : 'pointer' }}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => updateEditingCollection(field.id, (currentItems) => {
                                  if (rowIndex >= currentItems.length - 1) return currentItems;
                                  const next = [...currentItems];
                                  const [moved] = next.splice(rowIndex, 1);
                                  next.splice(rowIndex + 1, 0, moved);
                                  return next;
                                })}
                                disabled={rowIndex === items.length - 1}
                                style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '2px 8px', background: '#fff', cursor: rowIndex === items.length - 1 ? 'not-allowed' : 'pointer' }}
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => updateEditingCollection(field.id, (currentItems) => currentItems.filter((_, idx) => idx !== rowIndex))}
                                disabled={items.length <= minLength}
                                style={{ border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 6, padding: '2px 8px', background: '#fff', cursor: items.length <= minLength ? 'not-allowed' : 'pointer' }}
                              >
                                حذف
                              </button>
                            </div>
                          </div>

                          {subFields.map((subField: any) => {
                            const currentValue = getCollectionItemValue(item, subField.id);
                            const currentText = currentValue == null ? '' : pickLocalizedText(currentValue);

                            if (subField.type === 'boolean') {
                              return (
                                <div key={subField.id} style={{ marginBottom: 10 }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input
                                      type="checkbox"
                                      checked={Boolean(currentValue)}
                                      onChange={(e) => updateEditingCollection(field.id, (currentItems) => (
                                        currentItems.map((entry, idx) => (
                                          idx === rowIndex ? setCollectionItemValue(entry, subField.id, e.target.checked) : entry
                                        ))
                                      ))}
                                    />
                                    <span>{subField.label || getCollectionFieldPathTail(subField.id)}</span>
                                  </label>
                                </div>
                              );
                            }

                            if (subField.type === 'number' || subField.format === 'integer') {
                              return (
                                <div key={subField.id} style={{ marginBottom: 10 }}>
                                  <label>{subField.label || getCollectionFieldPathTail(subField.id)}</label>
                                  <input
                                    type="number"
                                    value={Number.isFinite(Number(currentValue)) ? Number(currentValue) : 0}
                                    min={subField.minimum}
                                    max={subField.maximum}
                                    onChange={(e) => {
                                      const nextValue = Number(e.target.value);
                                      updateEditingCollection(field.id, (currentItems) => (
                                        currentItems.map((entry, idx) => (
                                          idx === rowIndex ? setCollectionItemValue(entry, subField.id, Number.isFinite(nextValue) ? nextValue : 0) : entry
                                        ))
                                      ));
                                    }}
                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee' }}
                                  />
                                </div>
                              );
                            }

                            if (subField.type === 'items' && subField.format === 'variable-list') {
                              const sourceEntries = getVariableListSources(subField);
                              const optionsBySource = getVariableListOptionsBySource(subField);
                              const metaSource = getCollectionItemMetaValue(item, subField.id, 'type');
                              const metaValue = getCollectionItemMetaValue(item, subField.id, 'value');
                              const parsedSelection = parseVariableListSelection(currentValue, metaSource, metaValue);
                              const selectedSource = parsedSelection.source || sourceEntries[0]?.value || 'custom';
                              const activeOptions = optionsBySource[selectedSource] || [];
                              const staticUrl = getStaticVariableSourceUrl(selectedSource);
                              const isStaticSource = Boolean(staticUrl);
                              const isCustomSource = selectedSource === 'custom';
                              const shouldUseSelect = !isCustomSource && !isStaticSource && activeOptions.length > 0;
                              const optionSearchKey = `${field.id}:${rowIndex}:${subField.id}`;
                              const optionSearchQuery = getVariableSearch(optionSearchKey);
                              const filteredOptions = shouldUseSelect
                                ? filterVariableOptions(activeOptions, optionSearchQuery, parsedSelection.value)
                                : [];

                              return (
                                <div key={subField.id} style={{ marginBottom: 10 }}>
                                  <label>{subField.label || getCollectionFieldPathTail(subField.id)}</label>
                                  {sourceEntries.length > 0 && (
                                    <select
                                      value={selectedSource}
                                      onChange={(e) => {
                                        const nextSource = e.target.value;
                                        const nextOptions = optionsBySource[nextSource] || [];
                                        const nextStaticUrl = getStaticVariableSourceUrl(nextSource);
                                        const nextSelection: VariableListSelection = nextStaticUrl
                                          ? { source: nextSource, value: nextSource, url: nextStaticUrl }
                                          : nextSource === 'custom'
                                            ? { source: 'custom', value: '', url: '' }
                                            : nextOptions.length > 0
                                              ? { source: nextSource, value: nextOptions[0].value, url: nextOptions[0].url || '' }
                                              : { source: nextSource, value: '', url: '' };

                                        updateEditingCollection(field.id, (currentItems) => (
                                          currentItems.map((entry, idx) => (
                                            idx === rowIndex
                                              ? applyVariableSelectionToCollectionItem(entry, subField.id, nextSelection)
                                              : entry
                                          ))
                                        ));
                                        clearVariableSearch(optionSearchKey);
                                      }}
                                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginBottom: 8 }}
                                    >
                                      {sourceEntries.map((entry) => (
                                        <option key={entry.value} value={entry.value}>{entry.label}</option>
                                      ))}
                                    </select>
                                  )}

                                  {shouldUseSelect ? (
                                    <>
                                      <input
                                        type="text"
                                        placeholder="ابحث عن خيار..."
                                        value={optionSearchQuery}
                                        onChange={(e) => setVariableSearch(optionSearchKey, e.target.value)}
                                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginBottom: 6 }}
                                      />
                                      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 6 }}>
                                        النتائج: {filteredOptions.length} / {activeOptions.length}
                                      </div>
                                      <select
                                        value={parsedSelection.value}
                                        onChange={(e) => {
                                          const nextValue = e.target.value;
                                          const selectedOption = activeOptions.find((option) => option.value === nextValue);
                                          const nextSelection: VariableListSelection = {
                                            source: selectedSource,
                                            value: nextValue,
                                            url: selectedOption?.url || ''
                                          };
                                          updateEditingCollection(field.id, (currentItems) => (
                                            currentItems.map((entry, idx) => (
                                              idx === rowIndex
                                                ? applyVariableSelectionToCollectionItem(entry, subField.id, nextSelection)
                                                : entry
                                            ))
                                          ));
                                        }}
                                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', direction: 'ltr' }}
                                      >
                                        {filteredOptions.length > 0 ? (
                                          filteredOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                          ))
                                        ) : (
                                          <option value={parsedSelection.value || ''}>لا توجد نتائج</option>
                                        )}
                                      </select>
                                    </>
                                  ) : (
                                    <input
                                      type="text"
                                      value={isStaticSource ? staticUrl : (parsedSelection.url || parsedSelection.value)}
                                      onChange={(e) => {
                                        const nextText = e.target.value;
                                        const nextSelection: VariableListSelection = {
                                          source: selectedSource || 'custom',
                                          value: nextText,
                                          url: nextText
                                        };
                                        updateEditingCollection(field.id, (currentItems) => (
                                          currentItems.map((entry, idx) => (
                                            idx === rowIndex
                                              ? applyVariableSelectionToCollectionItem(entry, subField.id, nextSelection)
                                              : entry
                                          ))
                                        ));
                                      }}
                                      disabled={isStaticSource}
                                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', direction: 'ltr', background: isStaticSource ? '#f8fafc' : '#fff' }}
                                    />
                                  )}
                                </div>
                              );
                            }

                            if (subField.format === 'textarea') {
                              return (
                                <div key={subField.id} style={{ marginBottom: 10 }}>
                                  <label>{subField.label || getCollectionFieldPathTail(subField.id)}</label>
                                  <textarea
                                    value={currentText}
                                    onChange={(e) => updateEditingCollection(field.id, (currentItems) => (
                                      currentItems.map((entry, idx) => (
                                        idx === rowIndex ? setCollectionItemValue(entry, subField.id, e.target.value) : entry
                                      ))
                                    ))}
                                    style={{ width: '100%', minHeight: 80, padding: 8, borderRadius: 6, border: '1px solid #eee' }}
                                  />
                                </div>
                              );
                            }

                            return (
                              <div key={subField.id} style={{ marginBottom: 10 }}>
                                <label>{subField.label || getCollectionFieldPathTail(subField.id)}</label>
                                <input
                                  type="text"
                                  value={currentText}
                                  onChange={(e) => updateEditingCollection(field.id, (currentItems) => (
                                    currentItems.map((entry, idx) => (
                                      idx === rowIndex ? setCollectionItemValue(entry, subField.id, e.target.value) : entry
                                    ))
                                  ))}
                                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', direction: subField.format === 'image' ? 'ltr' : 'inherit' }}
                                />
                                {subField.format === 'image' && currentText && (
                                  <div style={{ marginTop: 6 }}>
                                    <img
                                      src={currentText}
                                      alt=""
                                      style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover', border: '1px solid #e5e7eb' }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => updateEditingCollection(field.id, (currentItems) => (
                          [...currentItems, createCollectionItemTemplate(field)]
                        ))}
                        disabled={!canAdd}
                        style={{ marginTop: 4, background: '#ecfeff', border: '1px solid #99f6e4', borderRadius: 8, padding: '8px 14px', cursor: canAdd ? 'pointer' : 'not-allowed', color: '#0f766e', fontWeight: 600 }}
                      >
                        + إضافة {(field.item_label || 'عنصر')}
                      </button>
                    </div>
                  );
                }

                const draft = jsonDrafts[field.id] ?? JSON.stringify(
                  Array.isArray(editingElement.props[field.id]) ? editingElement.props[field.id] : [],
                  null,
                  2
                );
                const error = jsonDraftErrors[field.id];
                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <label>{field.label}</label>
                    <textarea
                      value={draft}
                      onChange={e => {
                        const nextText = e.target.value;
                        setJsonDrafts(prev => ({ ...prev, [field.id]: nextText }));
                        try {
                          const parsed = JSON.parse(nextText);
                          const normalized = Array.isArray(parsed) ? parsed : [];
                          setJsonDraftErrors(prev => {
                            const next = { ...prev };
                            delete next[field.id];
                            return next;
                          });
                          setEditingProp(field.id, normalized);
                        } catch {
                          setJsonDraftErrors(prev => ({ ...prev, [field.id]: 'صيغة JSON غير صالحة' }));
                        }
                      }}
                      style={{ width: '100%', minHeight: 140, padding: 8, borderRadius: 6, border: '1px solid #eee', fontFamily: 'monospace', direction: 'ltr' }}
                    />
                    {error && <div style={{ marginTop: 4, color: '#ef4444', fontSize: 12 }}>{error}</div>}
                  </div>
                );
              }

              if (field.format === 'variable-list') {
                const sourceEntries = getVariableListSources(field);
                const optionsBySource = getVariableListOptionsBySource(field);
                const parsedSelection = parseVariableListSelection(editingElement.props[field.id]);
                const selectedSource = parsedSelection.source || sourceEntries[0]?.value || 'custom';
                const activeOptions = optionsBySource[selectedSource] || [];
                const staticUrl = getStaticVariableSourceUrl(selectedSource);
                const isStaticSource = Boolean(staticUrl);
                const isCustomSource = selectedSource === 'custom';
                const shouldUseSelect = !isCustomSource && !isStaticSource && activeOptions.length > 0;
                const optionSearchKey = `${field.id}:top`;
                const optionSearchQuery = getVariableSearch(optionSearchKey);
                const filteredOptions = shouldUseSelect
                  ? filterVariableOptions(activeOptions, optionSearchQuery, parsedSelection.value)
                  : [];

                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <label>{field.label}</label>
                    {sourceEntries.length > 0 && (
                      <select
                        value={selectedSource}
                        onChange={e => {
                          const nextSource = e.target.value;
                          const nextOptions = optionsBySource[nextSource] || [];
                          const nextStaticUrl = getStaticVariableSourceUrl(nextSource);
                          const nextSelection: VariableListSelection = nextStaticUrl
                            ? { source: nextSource, value: nextSource, url: nextStaticUrl }
                            : nextSource === 'custom'
                              ? { source: 'custom', value: '', url: '' }
                              : nextOptions.length > 0
                                ? { source: nextSource, value: nextOptions[0].value, url: nextOptions[0].url || '' }
                                : { source: nextSource, value: '', url: '' };
                          setEditingProp(field.id, buildVariableListStoreValue(nextSelection));
                          clearVariableSearch(optionSearchKey);
                        }}
                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginBottom: 8 }}
                      >
                        {sourceEntries.map((entry) => (
                          <option key={entry.value} value={entry.value}>{entry.label}</option>
                        ))}
                      </select>
                    )}

                    {shouldUseSelect ? (
                      <>
                        <input
                          type="text"
                          placeholder="ابحث عن خيار..."
                          value={optionSearchQuery}
                          onChange={e => setVariableSearch(optionSearchKey, e.target.value)}
                          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginBottom: 6 }}
                        />
                        <div style={{ color: '#64748b', fontSize: 11, marginBottom: 6 }}>
                          النتائج: {filteredOptions.length} / {activeOptions.length}
                        </div>
                        <select
                          value={parsedSelection.value}
                          onChange={e => {
                            const nextValue = e.target.value;
                            const selectedOption = activeOptions.find((option) => option.value === nextValue);
                            setEditingProp(field.id, buildVariableListStoreValue({
                              source: selectedSource,
                              value: nextValue,
                              url: selectedOption?.url || ''
                            }));
                          }}
                          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', direction: 'ltr' }}
                        >
                          {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))
                          ) : (
                            <option value={parsedSelection.value || ''}>لا توجد نتائج</option>
                          )}
                        </select>
                      </>
                    ) : (
                      <input
                        type="text"
                        value={isStaticSource ? staticUrl : (parsedSelection.url || parsedSelection.value)}
                        onChange={e => {
                          const nextText = e.target.value;
                          setEditingProp(field.id, buildVariableListStoreValue({
                            source: selectedSource || 'custom',
                            value: nextText,
                            url: nextText
                          }));
                        }}
                        disabled={isStaticSource}
                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', direction: 'ltr', background: isStaticSource ? '#f8fafc' : '#fff' }}
                      />
                    )}
                  </div>
                );
              }

              if (field.type === 'boolean') {
                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <label>{field.label}</label>
                    <input
                      type="checkbox"
                      checked={!!editingElement.props[field.id]}
                      onChange={e => setEditingProp(field.id, e.target.checked)}
                    />
                  </div>
                );
              }
              // Default: text input
              const currentValue = editingElement.props[field.id];
              return (
                <div key={field.id} style={{ marginBottom: 12 }}>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={currentValue == null ? '' : pickLocalizedText(currentValue)}
                    onChange={e => setEditingProp(field.id, e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee' }}
                  />
                </div>
              );
            });
          })()}
          <button
            onClick={() => {
              if (Object.keys(jsonDraftErrors).length > 0) {
                alert('تحقق من حقول JSON قبل الحفظ');
                return;
              }
              if (editingElement) {
                handleEditProps(editingElement, editingElement.props);
              }
            }}
            style={{ marginTop: 16, background: '#2196f3', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600 }}
          >
            حفظ
          </button>
          <button onClick={() => setEditingElement(null)} style={{ marginTop: 16, marginRight: 8 }}>إلغاء</button>
        </div>
      )}
    </div>
  );
};

export default PageComponentsEditor;
