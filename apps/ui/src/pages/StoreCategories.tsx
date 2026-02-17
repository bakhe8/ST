import React, { useEffect, useState } from 'react';
import { apiUrl } from '../services/api';
import { useParams } from 'react-router-dom';


interface Category {
  id: string;
  name: string;
  url?: string;
  parentId?: string;
  order?: number;
}

const StoreCategories: React.FC = () => {
  const { storeId } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editCat, setEditCat] = useState<Partial<Category>>({ name: '', url: '', parentId: '', order: 0 });
  const [newCat, setNewCat] = useState<Partial<Category>>({ name: '', url: '', parentId: '', order: 0 });

  const fetchCategories = () => {
    setLoading(true);
    fetch(apiUrl('v1/categories'), {
      headers: { 'Context-Store-Id': storeId || 'default' }
    })
      .then(res => res.json())
      .then(data => {
        // دعم الصيغتين parentId / parent_id
        const cats = Array.isArray(data?.data) ? data.data : [];
        setCategories(
          cats.map((c: any) => ({
            ...c,
            parentId: c?.parentId ? String(c.parentId) : (c?.parent_id ? String(c.parent_id) : '')
          }))
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, [storeId]);

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditCat({ ...cat });
  };

  const handleSaveEdit = (id: string) => {
    fetch(apiUrl(`v1/categories/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Context-Store-Id': storeId || 'default' },
      body: JSON.stringify({
        ...editCat,
        parentId: editCat.parentId ? String(editCat.parentId) : ''
      })
    })
      .then(() => {
        setEditId(null);
        fetchCategories();
      });
  };

  const handleDelete = (id: string) => {
    fetch(apiUrl(`v1/categories/${id}`), {
      method: 'DELETE',
      headers: { 'Context-Store-Id': storeId || 'default' }
    })
      .then(() => fetchCategories());
  };

  const handleAdd = () => {
    if (!newCat.name) return;
    fetch(apiUrl('v1/categories'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Context-Store-Id': storeId || 'default' },
      body: JSON.stringify({
        ...newCat,
        parentId: newCat.parentId ? String(newCat.parentId) : ''
      })
    })
      .then(() => {
        setNewCat({ name: '', url: '', parentId: '', order: 0 });
        fetchCategories();
      });
  };

  // دالة عرض الأقسام بشكل شجري
  function renderCategoryTree(cats: Category[], parentId: string | null, level: number): JSX.Element[] {
    // ترتيب حسب order ثم الاسم
    const filtered = cats.filter(c => (c.parentId || '') === (parentId || ''))
      .sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name));
    return filtered.flatMap((cat: Category) => [
      <tr key={cat.id} style={{ borderBottom: '1px solid #334155' }}>
        <td style={{ padding: 12 }}>
          {editId === cat.id ? (
            <input value={editCat.name} onChange={e => setEditCat({ ...editCat, name: e.target.value })} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
          ) : <span style={{ paddingRight: level * 16 }}>{'— '.repeat(level)}{cat.name}</span>}
        </td>
        <td style={{ padding: 12 }}>
          {editId === cat.id ? (
            <input value={editCat.url} onChange={e => setEditCat({ ...editCat, url: e.target.value })} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
          ) : cat.url}
        </td>
        <td style={{ padding: 12 }}>
          {editId === cat.id ? (
            <select value={editCat.parentId || ''} onChange={e => setEditCat({ ...editCat, parentId: e.target.value })} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #334155', background: '#0f172a', color: 'white' }}>
              <option value="">بدون قسم أب</option>
              {categories.filter(c => c.id !== cat.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          ) : (cat.parentId ? (categories.find(c => c.id === cat.parentId)?.name || '-') : '-')}
        </td>
        <td style={{ padding: 12 }}>
          {editId === cat.id ? (
            <input type="number" value={editCat.order || 0} onChange={e => setEditCat({ ...editCat, order: Number(e.target.value) })} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
          ) : (typeof cat.order === 'number' ? cat.order : '-')}
        </td>
        <td style={{ padding: 12 }}>
          {editId === cat.id ? (
            <>
              <button onClick={() => handleSaveEdit(cat.id)} style={{ marginRight: 8, background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px' }}>حفظ</button>
              <button onClick={() => setEditId(null)} style={{ background: '#64748b', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px' }}>إلغاء</button>
            </>
          ) : (
            <>
              <button onClick={() => handleEdit(cat)} style={{ marginRight: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px' }}>تعديل</button>
              <button onClick={() => handleDelete(cat.id)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px' }}>حذف</button>
            </>
          )}
        </td>
      </tr>,
      ...renderCategoryTree(cats, cat.id, level + 1)
    ]);
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#1e293b', padding: 32, borderRadius: 12, color: 'white' }}>
      <h2 style={{ marginBottom: 24 }}>إدارة الأقسام</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <input placeholder="اسم القسم" value={newCat.name || ''} onChange={e => setNewCat({ ...newCat, name: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <input placeholder="الرابط" value={newCat.url || ''} onChange={e => setNewCat({ ...newCat, url: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <select value={newCat.parentId || ''} onChange={e => setNewCat({ ...newCat, parentId: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}>
          <option value="">بدون قسم أب</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input type="number" placeholder="الترتيب" value={newCat.order || 0} onChange={e => setNewCat({ ...newCat, order: Number(e.target.value) })} style={{ width: 80, padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <button onClick={handleAdd} style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 8, fontWeight: 600 }}>إضافة</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: 12 }}>اسم القسم</th>
              <th style={{ padding: 12 }}>الرابط</th>
              <th style={{ padding: 12 }}>الأب</th>
              <th style={{ padding: 12 }}>الترتيب</th>
              <th style={{ padding: 12 }}></th>
            </tr>
          </thead>
          <tbody>
            {/* ابدأ العرض من الجذر (بدون parentId) */}
            {renderCategoryTree(categories, '', 0)}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default StoreCategories;

