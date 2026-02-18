import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Save, Trash2 } from 'lucide-react';
import { apiUrl } from '../services/api';

type MenuType = 'header' | 'footer';

interface MenuItem {
    id: string;
    title: string;
    url: string;
    order: number;
    type?: string;
    children: MenuItem[];
}

function createMenuItem(prefix: string, order: number): MenuItem {
    const id = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return {
        id,
        title: 'رابط جديد',
        url: '#',
        order,
        type: 'link',
        children: []
    };
}

function normalizeMenuItems(items: any[]): MenuItem[] {
    if (!Array.isArray(items)) return [];
    return items
        .map((item: any, index: number) => ({
            id: String(item?.id || `menu-${index + 1}`),
            title: String(item?.title || item?.name || `رابط ${index + 1}`),
            url: String(item?.url || item?.href || '#'),
            order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index + 1,
            type: String(item?.type || 'link'),
            children: normalizeMenuItems(Array.isArray(item?.children) ? item.children : [])
        }))
        .sort((a, b) => a.order - b.order);
}

function mapTree(items: MenuItem[], targetId: string, updater: (item: MenuItem) => MenuItem): MenuItem[] {
    return items.map((item) => {
        if (item.id === targetId) return updater(item);
        if (item.children.length === 0) return item;
        return {
            ...item,
            children: mapTree(item.children, targetId, updater)
        };
    });
}

function removeFromTree(items: MenuItem[], targetId: string): MenuItem[] {
    return items
        .filter((item) => item.id !== targetId)
        .map((item) => ({
            ...item,
            children: removeFromTree(item.children, targetId)
        }));
}

const StoreMenus = () => {
    const { storeId } = useParams();
    const [menuType, setMenuType] = useState<MenuType>('header');
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string>('');

    const headers = useMemo(
        () => ({
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId || '',
            'Context-Store-Id': storeId || ''
        }),
        [storeId]
    );

    const loadMenus = useCallback(() => {
        setLoading(true);
        setMessage('');
        fetch(apiUrl(`v1/menus/${menuType}`), { headers })
            .then((res) => res.json())
            .then((result) => {
                if (!result.success) {
                    setItems([]);
                    setMessage('تعذر تحميل القائمة.');
                    return;
                }
                setItems(normalizeMenuItems(result.data || []));
            })
            .catch(() => setMessage('حدث خطأ أثناء تحميل القائمة.'))
            .finally(() => setLoading(false));
    }, [headers, menuType]);

    useEffect(() => {
        loadMenus();
    }, [loadMenus]);

    const updateItem = (targetId: string, patch: Partial<MenuItem>) => {
        setItems((prev) =>
            mapTree(prev, targetId, (item) => ({
                ...item,
                ...patch
            }))
        );
    };

    const addRootItem = () => {
        setItems((prev) => [...prev, createMenuItem(`root-${menuType}`, prev.length + 1)]);
    };

    const addChildItem = (parentId: string) => {
        setItems((prev) =>
            mapTree(prev, parentId, (item) => ({
                ...item,
                children: [...item.children, createMenuItem(`child-${parentId}`, item.children.length + 1)]
            }))
        );
    };

    const removeItem = (targetId: string) => {
        setItems((prev) => removeFromTree(prev, targetId));
    };

    const saveMenus = () => {
        setSaving(true);
        setMessage('');
        fetch(apiUrl(`v1/menus/${menuType}`), {
            method: 'PUT',
            headers,
            body: JSON.stringify({ items })
        })
            .then((res) => res.json())
            .then((result) => {
                if (!result.success) {
                    setMessage('فشل حفظ القائمة.');
                    return;
                }
                setItems(normalizeMenuItems(result.data || []));
                setMessage('تم حفظ القائمة بنجاح.');
            })
            .catch(() => setMessage('حدث خطأ أثناء الحفظ.'))
            .finally(() => setSaving(false));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>القوائم</h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={addRootItem}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                        <Plus size={16} />
                        إضافة عنصر
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={saveMenus}
                        disabled={saving}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}
                    >
                        <Save size={16} />
                        {saving ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <select
                    value={menuType}
                    onChange={(event) => setMenuType(event.target.value as MenuType)}
                    style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: 'white',
                        borderRadius: 8,
                        padding: '10px 12px',
                        minWidth: 180
                    }}
                >
                    <option value="header">القائمة الرئيسية (Header)</option>
                    <option value="footer">قائمة التذييل (Footer)</option>
                </select>
            </div>

            {message && (
                <div
                    style={{
                        marginBottom: 16,
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: 'rgba(59,130,246,0.15)',
                        color: '#93c5fd',
                        border: '1px solid rgba(59,130,246,0.35)'
                    }}
                >
                    {message}
                </div>
            )}

            {loading ? (
                <div style={{ color: '#94a3b8' }}>جاري تحميل القائمة...</div>
            ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                border: '1px solid #334155',
                                borderRadius: 12,
                                background: '#1e293b',
                                padding: 14
                            }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px auto', gap: 10, alignItems: 'center' }}>
                                <input
                                    value={item.title}
                                    onChange={(event) => updateItem(item.id, { title: event.target.value })}
                                    placeholder="العنوان"
                                    style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '10px 12px' }}
                                />
                                <input
                                    value={item.url}
                                    onChange={(event) => updateItem(item.id, { url: event.target.value })}
                                    placeholder="/path"
                                    style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '10px 12px' }}
                                />
                                <input
                                    type="number"
                                    value={item.order}
                                    onChange={(event) => updateItem(item.id, { order: Number(event.target.value || 0) })}
                                    style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '10px 12px' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                    <button
                                        type="button"
                                        onClick={() => addChildItem(item.id)}
                                        style={{ border: '1px solid #334155', background: '#0f172a', color: '#cbd5e1', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}
                                    >
                                        عنصر فرعي
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        style={{ border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {item.children.length > 0 && (
                                <div style={{ marginTop: 10, paddingInlineStart: 16, borderInlineStart: '2px solid #334155', display: 'grid', gap: 8 }}>
                                    {item.children.map((child) => (
                                        <div key={child.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px auto', gap: 10, alignItems: 'center' }}>
                                            <input
                                                value={child.title}
                                                onChange={(event) => updateItem(child.id, { title: event.target.value })}
                                                placeholder="عنوان فرعي"
                                                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '8px 10px' }}
                                            />
                                            <input
                                                value={child.url}
                                                onChange={(event) => updateItem(child.id, { url: event.target.value })}
                                                placeholder="/sub-path"
                                                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '8px 10px' }}
                                            />
                                            <input
                                                type="number"
                                                value={child.order}
                                                onChange={(event) => updateItem(child.id, { order: Number(event.target.value || 0) })}
                                                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '8px 10px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItem(child.id)}
                                                style={{ justifySelf: 'end', border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoreMenus;
