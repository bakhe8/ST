import React, { useEffect, useState } from 'react';
import { apiUrl } from '../services/api';
import { useParams } from 'react-router-dom';

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
}

const StoreStaticPages = () => {
  const { storeId } = useParams();
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPage, setNewPage] = useState({ title: '', slug: '', content: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editPage, setEditPage] = useState({ title: '', slug: '', content: '' });

  const fetchPages = () => {
    setLoading(true);
    fetch(apiUrl('v1/static-pages'), {
      headers: { 'Context-Store-Id': storeId || 'default' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setPages(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPages();
  }, [storeId]);

  const handleAdd = () => {
    if (!newPage.title || !newPage.slug) return;
    fetch(apiUrl('v1/static-pages'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Context-Store-Id': storeId || 'default' },
      body: JSON.stringify({ ...newPage })
    })
      .then(() => {
        setNewPage({ title: '', slug: '', content: '' });
        fetchPages();
      });
  };

  const handleEdit = (page: StaticPage) => {
    setEditId(page.id);
    setEditPage({ title: page.title, slug: page.slug, content: page.content });
  };

  const handleSaveEdit = (id: string) => {
    fetch(apiUrl(`v1/static-pages/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Context-Store-Id': storeId || 'default' },
      body: JSON.stringify({ ...editPage })
    })
      .then(() => {
        setEditId(null);
        fetchPages();
      });
  };

  const handleDelete = (id: string) => {
    fetch(apiUrl(`v1/static-pages/${id}`), {
      method: 'DELETE',
      headers: { 'Context-Store-Id': storeId || 'default' }
    })
      .then(() => fetchPages());
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#1e293b', padding: 32, borderRadius: 12, color: 'white' }}>
      <h2 style={{ marginBottom: 24 }}>إدارة الصفحات الثابتة</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input placeholder="العنوان" value={newPage.title} onChange={e => setNewPage({ ...newPage, title: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <input placeholder="المعرف (slug)" value={newPage.slug} onChange={e => setNewPage({ ...newPage, slug: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <input placeholder="المحتوى" value={newPage.content} onChange={e => setNewPage({ ...newPage, content: e.target.value })} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <button onClick={handleAdd} style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 8, fontWeight: 600 }}>إضافة</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: 12 }}>العنوان</th>
              <th style={{ padding: 12 }}>المعرف (slug)</th>
              <th style={{ padding: 12 }}>المحتوى</th>
              <th style={{ padding: 12 }}></th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: 12 }}>
                  {editId === page.id ? (
                    <input value={editPage.title} onChange={e => setEditPage({ ...editPage, title: e.target.value })} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                  ) : page.title}
                </td>
                <td style={{ padding: 12 }}>
                  {editId === page.id ? (
                    <input value={editPage.slug} onChange={e => setEditPage({ ...editPage, slug: e.target.value })} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                  ) : page.slug}
                </td>
                <td style={{ padding: 12 }}>
                  {editId === page.id ? (
                    <input value={editPage.content} onChange={e => setEditPage({ ...editPage, content: e.target.value })} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                  ) : (page.content.length > 60 ? page.content.slice(0, 60) + '...' : page.content)}
                </td>
                <td style={{ padding: 12 }}>
                  {editId === page.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(page.id)} style={{ marginRight: 8, background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px' }}>حفظ</button>
                      <button onClick={() => setEditId(null)} style={{ background: '#64748b', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px' }}>إلغاء</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(page)} style={{ marginRight: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px' }}>تعديل</button>
                      <button onClick={() => handleDelete(page.id)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px' }}>حذف</button>
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

export default StoreStaticPages;
