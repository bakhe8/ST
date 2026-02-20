import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../services/api';

interface BlogCategory {
  id: string;
  name: string;
  title?: string;
}

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  url?: string;
  image?: string;
  category_id?: string;
  published_at?: string;
  is_published?: boolean;
}

const emptyArticle: Partial<BlogArticle> = {
  title: '',
  slug: '',
  summary: '',
  url: '',
  image: '',
  category_id: '',
  is_published: true
};

const StoreBlogArticles: React.FC = () => {
  const { storeId } = useParams();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [newArticle, setNewArticle] = useState<Partial<BlogArticle>>(emptyArticle);
  const [editId, setEditId] = useState<string | null>(null);
  const [editArticle, setEditArticle] = useState<Partial<BlogArticle>>(emptyArticle);

  const headers = { 'X-VTDR-Store-Id': storeId || '' };

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch(apiUrl('v1/blog/articles'), { headers }).then((res) => res.json()),
      fetch(apiUrl('v1/blog/categories'), { headers }).then((res) => res.json())
    ])
      .then(([articlesJson, categoriesJson]) => {
        if (articlesJson?.success) {
          setArticles(Array.isArray(articlesJson.data) ? articlesJson.data : []);
        }
        if (categoriesJson?.success) {
          setCategories(Array.isArray(categoriesJson.data) ? categoriesJson.data : []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, [storeId]);

  const handleAdd = () => {
    if (!newArticle.title?.trim()) return;
    fetch(apiUrl('v1/blog/articles'), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle)
    }).then(() => {
      setNewArticle(emptyArticle);
      fetchAll();
    });
  };

  const handleSaveEdit = (id: string) => {
    fetch(apiUrl(`v1/blog/articles/${id}`), {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(editArticle)
    }).then(() => {
      setEditId(null);
      setEditArticle(emptyArticle);
      fetchAll();
    });
  };

  const handleDelete = (id: string) => {
    fetch(apiUrl(`v1/blog/articles/${id}`), {
      method: 'DELETE',
      headers
    }).then(() => fetchAll());
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', background: '#1e293b', padding: 24, borderRadius: 12, color: 'white' }}>
      <h2 style={{ marginBottom: 16 }}>إدارة مقالات المدونة</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 2fr 2fr 1fr auto', gap: 8, marginBottom: 18 }}>
        <input
          placeholder="العنوان"
          value={newArticle.title || ''}
          onChange={(e) => setNewArticle((prev) => ({ ...prev, title: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="slug"
          value={newArticle.slug || ''}
          onChange={(e) => setNewArticle((prev) => ({ ...prev, slug: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="الملخص"
          value={newArticle.summary || ''}
          onChange={(e) => setNewArticle((prev) => ({ ...prev, summary: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="الرابط"
          value={newArticle.url || ''}
          onChange={(e) => setNewArticle((prev) => ({ ...prev, url: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input
          placeholder="الصورة"
          value={newArticle.image || ''}
          onChange={(e) => setNewArticle((prev) => ({ ...prev, image: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <select
          value={newArticle.category_id || ''}
          onChange={(e) => setNewArticle((prev) => ({ ...prev, category_id: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        >
          <option value="">بدون تصنيف</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name || cat.title || cat.id}
            </option>
          ))}
        </select>
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
              <th style={{ padding: 10 }}>slug</th>
              <th style={{ padding: 10 }}>الملخص</th>
              <th style={{ padding: 10 }}>التصنيف</th>
              <th style={{ padding: 10 }}>الرابط</th>
              <th style={{ padding: 10 }}>الصورة</th>
              <th style={{ padding: 10 }} />
            </tr>
          </thead>
          <tbody>
            {articles.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editArticle.title || ''}
                      onChange={(e) => setEditArticle((prev) => ({ ...prev, title: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.title
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editArticle.slug || ''}
                      onChange={(e) => setEditArticle((prev) => ({ ...prev, slug: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.slug
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editArticle.summary || ''}
                      onChange={(e) => setEditArticle((prev) => ({ ...prev, summary: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.summary || '-'
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <select
                      value={editArticle.category_id || ''}
                      onChange={(e) => setEditArticle((prev) => ({ ...prev, category_id: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    >
                      <option value="">بدون تصنيف</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name || cat.title || cat.id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    categories.find((cat) => cat.id === item.category_id)?.name || '-'
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editArticle.url || ''}
                      onChange={(e) => setEditArticle((prev) => ({ ...prev, url: e.target.value }))}
                      style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                    />
                  ) : (
                    item.url || '-'
                  )}
                </td>
                <td style={{ padding: 10 }}>
                  {editId === item.id ? (
                    <input
                      value={editArticle.image || ''}
                      onChange={(e) => setEditArticle((prev) => ({ ...prev, image: e.target.value }))}
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
                          setEditArticle(item);
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

export default StoreBlogArticles;

