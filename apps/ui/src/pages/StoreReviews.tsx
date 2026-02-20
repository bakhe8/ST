import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../services/api';

interface Product {
  id: string;
  name?: string;
  title?: string;
}

interface Review {
  id: string;
  product_id: string;
  stars: number;
  content: string;
  customer_name?: string;
  customer_avatar?: string;
  is_published?: boolean;
  created_at?: string;
}

const emptyReview: Partial<Review> = {
  product_id: '',
  stars: 5,
  content: '',
  customer_name: '',
  customer_avatar: '',
  is_published: true
};

const StoreReviews: React.FC = () => {
  const { storeId } = useParams();
  const [items, setItems] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Review>>(emptyReview);
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Partial<Review>>(emptyReview);

  const headers = { 'X-VTDR-Store-Id': storeId || '' };

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch(apiUrl('v1/reviews'), { headers }).then((res) => res.json()),
      fetch(apiUrl('v1/products'), { headers }).then((res) => res.json())
    ])
      .then(([reviewsJson, productsJson]) => {
        if (reviewsJson?.success) {
          setItems(Array.isArray(reviewsJson.data) ? reviewsJson.data : []);
        }
        if (productsJson?.success) {
          setProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, [storeId]);

  const handleAdd = () => {
    if (!newItem.content?.trim()) return;
    fetch(apiUrl('v1/reviews'), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    }).then(() => {
      setNewItem(emptyReview);
      fetchAll();
    });
  };

  const handleSaveEdit = (id: string) => {
    fetch(apiUrl(`v1/reviews/${id}`), {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(editItem)
    }).then(() => {
      setEditId(null);
      setEditItem(emptyReview);
      fetchAll();
    });
  };

  const handleDelete = (id: string) => {
    fetch(apiUrl(`v1/reviews/${id}`), {
      method: 'DELETE',
      headers
    }).then(() => fetchAll());
  };

  const productLabel = (productId: string) =>
    products.find((entry) => String(entry.id) === String(productId))?.name || productId || '-';

  return (
    <div style={{ maxWidth: 1300, margin: '40px auto', background: '#1e293b', padding: 24, borderRadius: 12, color: 'white' }}>
      <h2 style={{ marginBottom: 16 }}>إدارة التقييمات</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr 2fr 1fr auto', gap: 8, marginBottom: 18 }}>
        <select
          value={newItem.product_id || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, product_id: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        >
          <option value="">اختر منتجًا</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name || product.title || product.id}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          max={5}
          placeholder="النجوم"
          value={newItem.stars ?? 5}
          onChange={(e) => setNewItem((prev) => ({ ...prev, stars: Number(e.target.value) }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="اسم العميل"
          value={newItem.customer_name || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, customer_name: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="صورة العميل"
          value={newItem.customer_avatar || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, customer_avatar: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="نص التقييم"
          value={newItem.content || ''}
          onChange={(e) => setNewItem((prev) => ({ ...prev, content: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <input
            type="checkbox"
            checked={Boolean(newItem.is_published)}
            onChange={(e) => setNewItem((prev) => ({ ...prev, is_published: e.target.checked }))}
          />
          منشور
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
              <th style={{ padding: 10 }}>المنتج</th>
              <th style={{ padding: 10 }}>العميل</th>
              <th style={{ padding: 10 }}>النجوم</th>
              <th style={{ padding: 10 }}>التقييم</th>
              <th style={{ padding: 10 }}>الحالة</th>
              <th style={{ padding: 10 }}>التاريخ</th>
              <th style={{ padding: 10 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <select
                      value={editItem.product_id || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, product_id: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    >
                      <option value="">اختر منتجًا</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name || product.title || product.id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    productLabel(item.product_id)
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.customer_name || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, customer_name: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.customer_name || '-'
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={editItem.stars ?? 5}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, stars: Number(e.target.value) }))}
                      style={{ width: 80, padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.stars
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editItem.content || ''}
                      onChange={(e) => setEditItem((prev) => ({ ...prev, content: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.content || '-'
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <input
                        type="checkbox"
                        checked={Boolean(editItem.is_published)}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, is_published: e.target.checked }))}
                      />
                      منشور
                    </label>
                  ) : (
                    item.is_published === false ? 'مخفي' : 'منشور'
                  )}
                </td>
                <td style={{ padding: 10 }}>{String(item.created_at || '-').slice(0, 10)}</td>
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

export default StoreReviews;
