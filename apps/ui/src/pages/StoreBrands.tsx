import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../services/api';

interface Brand {
  id: string;
  name: string;
  title?: string;
  slug?: string;
  url?: string;
  description?: string;
  logo?: string;
  banner?: string;
  order?: number;
}

const emptyBrand: Partial<Brand> = {
  name: '',
  slug: '',
  url: '',
  description: '',
  logo: '',
  banner: '',
  order: 0
};

const StoreBrands: React.FC = () => {
  const { storeId } = useParams();
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Brand>>(emptyBrand);
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Partial<Brand>>(emptyBrand);

  const headers = { 'Context-Store-Id': storeId || 'default' };

  const fetchItems = () => {
    setLoading(true);
    fetch(apiUrl('v1/brands'), { headers })
      .then((res) => res.json())
      .then((json) => {
        if (json?.success) {
          setItems(Array.isArray(json.data) ? json.data : []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [storeId]);

  const handleAdd = () => {
    if (!newItem.name?.trim()) return;
    fetch(apiUrl('v1/brands'), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    }).then(() => {
      setNewItem(emptyBrand);
      fetchItems();
    });
  };

  const handleSaveEdit = (id: string) => {
    fetch(apiUrl(`v1/brands/${id}`), {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(editItem)
    }).then(() => {
      setEditId(null);
      setEditItem(emptyBrand);
      fetchItems();
    });
  };

  const handleDelete = (id: string) => {
    fetch(apiUrl(`v1/brands/${id}`), {
      method: 'DELETE',
      headers
    }).then(() => fetchItems());
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', background: '#1e293b', padding: 24, borderRadius: 12, color: 'white' }}>
      <h2 style={{ marginBottom: 16 }}>إدارة الماركات</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 2fr 2fr 2fr 1fr auto', gap: 8, marginBottom: 18 }}>
        <input
          placeholder="الاسم"
          value={newItem.name || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="slug"
          value={newItem.slug || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, slug: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="الرابط"
          value={newItem.url || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, url: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="الشعار Logo URL"
          value={newItem.logo || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, logo: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="صورة البانر Banner URL"
          value={newItem.banner || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, banner: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="الوصف"
          value={newItem.description || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          type="number"
          placeholder="ترتيب"
          value={newItem.order ?? 0}
          onChange={(e) => setNewItem((prev) => ({ ...prev, order: Number(e.target.value) }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <button
          onClick={handleAdd}
          style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600 }}
        >
          إضافة
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: 10 }}>الاسم</th>
              <th style={{ padding: 10 }}>slug</th>
              <th style={{ padding: 10 }}>الرابط</th>
              <th style={{ padding: 10 }}>الشعار</th>
              <th style={{ padding: 10 }}>البانر</th>
              <th style={{ padding: 10 }}>الوصف</th>
              <th style={{ padding: 10 }}>الترتيب</th>
              <th style={{ padding: 10 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.name || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.slug || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, slug: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.slug || '-'
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.url || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, url: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.url || '-'
                  )}
                </td>
                <td style={{ padding: 10, direction: 'ltr' }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.logo || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, logo: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.logo || '-'
                  )}
                </td>
                <td style={{ padding: 10, direction: 'ltr' }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.banner || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, banner: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.banner || '-'
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.description || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, description: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.description || '-'
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      type="number"
                      value={editItem.order ?? 0}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, order: Number(e.target.value) }))}
                      style={{ width: 80, padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.order ?? 0
                  )}
                </td>
                <td style={{ padding: 10, whiteSpace: 'nowrap' }}>
                  {editId === item.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        style={{ marginInlineEnd: 8, background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px' }}
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        style={{ background: '#64748b', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px' }}
                      >
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(item.id);
                          setEditItem(item);
                        }}
                        style={{ marginInlineEnd: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px' }}
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px' }}
                      >
                        حذف
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StoreBrands;

