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
                          setEditingElement({
                            ...editingElement,
                            props: { ...editingElement.props, [field.id]: selected }
                          });
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
                      onChange={e => setEditingElement({ ...editingElement, props: { ...editingElement.props, [field.id]: e.target.value } })}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee' }}
                    >
                      {field.options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
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
                      onChange={e => setEditingElement({ ...editingElement, props: { ...editingElement.props, [field.id]: e.target.checked } })}
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
                    onChange={e => setEditingElement({ ...editingElement, props: { ...editingElement.props, [field.id]: e.target.value } })}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee' }}
                  />
                </div>
              );
            });
          })()}
          <button onClick={() => editingElement && handleEditProps(editingElement, editingElement.props)} style={{ marginTop: 16, background: '#2196f3', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600 }}>حفظ</button>
          <button onClick={() => setEditingElement(null)} style={{ marginTop: 16, marginRight: 8 }}>إلغاء</button>
        </div>
      )}
    </div>
  );
};

export default PageComponentsEditor;
