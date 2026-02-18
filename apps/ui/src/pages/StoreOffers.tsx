import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../services/api';

interface Offer {
  id: string;
  name?: string;
  title: string;
  slug?: string;
  description?: string;
  url?: string;
  image?: string;
  discount_type?: string;
  discount_value?: number;
  starts_at?: string;
  ends_at?: string;
  is_active?: boolean;
}

const emptyOffer: Partial<Offer> = {
  title: '',
  slug: '',
  description: '',
  url: '',
  image: '',
  discount_type: 'percentage',
  discount_value: 0,
  starts_at: '',
  ends_at: '',
  is_active: true
};

const StoreOffers: React.FC = () => {
  const { storeId } = useParams();
  const [items, setItems] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Offer>>(emptyOffer);
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Partial<Offer>>(emptyOffer);

  const headers = { 'Context-Store-Id': storeId || 'default' };

  const fetchItems = () => {
    setLoading(true);
    fetch(apiUrl('v1/offers'), { headers })
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
    if (!newItem.title?.trim()) return;
    fetch(apiUrl('v1/offers'), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    }).then(() => {
      setNewItem(emptyOffer);
      fetchItems();
    });
  };

  const handleSaveEdit = (id: string) => {
    fetch(apiUrl(`v1/offers/${id}`), {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(editItem)
    }).then(() => {
      setEditId(null);
      setEditItem(emptyOffer);
      fetchItems();
    });
  };

  const handleDelete = (id: string) => {
    fetch(apiUrl(`v1/offers/${id}`), {
      method: 'DELETE',
      headers
    }).then(() => fetchItems());
  };

  return (
    <div style={{ maxWidth: 1300, margin: '40px auto', background: '#1e293b', padding: 24, borderRadius: 12, color: 'white' }}>
      <h2 style={{ marginBottom: 16 }}>إدارة العروض الخاصة</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr 2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 18 }}>
        <input
          placeholder="العنوان"
          value={newItem.title || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="slug"
          value={newItem.slug || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, slug: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="الوصف"
          value={newItem.description || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <select
          value={newItem.discount_type || 'percentage'}
          onChange={(e) => setNewItem((prev) => ({ ...prev, discount_type: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        >
          <option value="percentage">percentage</option>
          <option value="fixed">fixed</option>
        </select>
        <input
          type="number"
          placeholder="قيمة الخصم"
          value={newItem.discount_value ?? 0}
          onChange={(e) => setNewItem((prev) => ({ ...prev, discount_value: Number(e.target.value) }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="صورة العرض"
          value={newItem.image || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, image: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          type="date"
          value={(newItem.starts_at || '').slice(0, 10)}
          onChange={(e) => setNewItem((prev) => ({ ...prev, starts_at: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          type="date"
          value={(newItem.ends_at || '').slice(0, 10)}
          onChange={(e) => setNewItem((prev) => ({ ...prev, ends_at: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <input
            type="checkbox"
            checked={Boolean(newItem.is_active)}
            onChange={(e) => setNewItem((prev) => ({ ...prev, is_active: e.target.checked }))}
          />
          نشط
        </label>
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
              <th style={{ padding: 10 }}>العنوان</th>
              <th style={{ padding: 10 }}>الخصم</th>
              <th style={{ padding: 10 }}>الوصف</th>
              <th style={{ padding: 10 }}>الصلاحية</th>
              <th style={{ padding: 10 }}>الحالة</th>
              <th style={{ padding: 10 }}>الرابط</th>
              <th style={{ padding: 10 }}>الصورة</th>
              <th style={{ padding: 10 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.title || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, title: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.title || item.name || item.id
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        value={editItem.discount_type || 'percentage'}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, discount_type: e.target.value }))}
                        style={{ padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                      >
                        <option value="percentage">percentage</option>
                        <option value="fixed">fixed</option>
                      </select>
                      <input
                        type="number"
                        value={editItem.discount_value ?? 0}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, discount_value: Number(e.target.value) }))}
                        style={{ width: 90, padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                      />
                    </div>
                  ) : (
                    `${item.discount_value ?? 0} (${item.discount_type || 'percentage'})`
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
                <td style={{ padding: 10, whiteSpace: 'nowrap' }}>
                  {editId === item.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="date"
                        value={(editItem.starts_at || '').slice(0, 10)}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, starts_at: e.target.value }))}
                        style={{ padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                      />
                      <input
                        type="date"
                        value={(editItem.ends_at || '').slice(0, 10)}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, ends_at: e.target.value }))}
                        style={{ padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                      />
                    </div>
                  ) : (
                    `${(item.starts_at || '-').slice(0, 10)} -> ${(item.ends_at || '-').slice(0, 10)}`
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <input
                        type="checkbox"
                        checked={Boolean(editItem.is_active)}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, is_active: e.target.checked }))}
                      />
                      نشط
                    </label>
                  ) : (
                    item.is_active === false ? 'غير نشط' : 'نشط'
                  )}
                </td>
                <td style={{ padding: 10, direction: 'ltr' }}>{item.url || '-'}</td>
                <td style={{ padding: 10, direction: 'ltr' }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.image || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, image: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.image || '-'
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

export default StoreOffers;

