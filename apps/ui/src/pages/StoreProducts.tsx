import React, { useEffect, useState } from 'react';
import { apiUrl } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MoreHorizontal, Plus, Search } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: { amount: number; currency: string };
    sku?: string;
    status?: string;
    type?: string;
    images?: { url: string }[];
    main_image?: string;
    image?: { url: string };
    thumbnail?: string;
    categories?: string[];
    stock?: number;
    properties?: { key: string; value: string }[];
}

interface Category {
    id: string;
    name: string;
}

const StoreProducts = () => {
    const navigate = useNavigate();
    // دالة إغلاق القائمة المنبثقة
    const handleMenuClose = () => setMenuOpen(null);
    const { storeId } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        fetch(apiUrl('v1/products'), {
            headers: {
                'Context-Store-Id': storeId || 'default'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
        // جلب الأقسام لعرض أسمائها
        fetch(apiUrl('v1/categories'), {
            headers: { 'Context-Store-Id': storeId || 'default' }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setCategories(data.data);
            });
    }, [storeId]);

    // لإظهار قائمة الخيارات المنبثقة
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const handleMenuClick = (id: string) => {
        setMenuOpen(menuOpen === id ? null : id);
    };

    // صورة افتراضية في حال فشل تحميل الصورة المحلية
    const placeholderImg = '/images/products/placeholder.png';
    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== window.location.origin + placeholderImg) {
            target.src = placeholderImg;
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>Products</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                    <Plus size={18} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 12 }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        style={{ width: '100%', padding: '10px 10px 10px 36px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: 'white' }}
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '0 16px', minWidth: 120 }}
                >
                    <option value="">كل الأقسام</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Product</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Images</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>SKU</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Price</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Stock</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Properties</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Status</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Categories</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No products found.</td></tr>
                        ) : products
                            .filter(product => !selectedCategory || (product.categories && product.categories.includes(selectedCategory)))
                            .map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 40, height: 40, background: '#334155', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {(
                                                product.main_image && product.main_image !== placeholderImg ? (
                                                    <img src={product.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                                                ) : product.image?.url && product.image.url !== placeholderImg ? (
                                                    <img src={product.image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                                                ) : product.images?.[0] && product.images[0].url !== placeholderImg ? (
                                                    <img src={product.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                                                ) : (
                                                    <img src={placeholderImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                )
                                            )}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{product.name}</span>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {(product.images || []).slice(0, 3).map((img, idx) => (
                                                <img key={idx} src={img.url} alt="img" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6, border: '1px solid #334155', background: '#0f172a' }} />
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: 16, color: '#94a3b8', fontFamily: 'monospace' }}>{product.sku || '-'}</td>
                                    <td style={{ padding: 16 }}>
                                        {product.price.amount} <span style={{ fontSize: 12, color: '#94a3b8' }}>{product.price.currency}</span>
                                    </td>
                                    <td style={{ padding: 16 }}>{typeof product.stock === 'number' ? product.stock : '-'}</td>
                                    <td style={{ padding: 16 }}>
                                        {(product.properties && product.properties.length > 0)
                                            ? product.properties.map((prop, idx) => (
                                                <span key={idx} style={{ display: 'inline-block', background: '#334155', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 12, marginRight: 4 }}>{prop.key}: {prop.value}</span>
                                            ))
                                            : <span style={{ color: '#94a3b8', fontSize: 12 }}>-</span>}
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: 12,
                                            background: product.status === 'hidden' ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.2)',
                                            color: product.status === 'hidden' ? '#94a3b8' : '#34d399',
                                            fontSize: 12
                                        }}>
                                            {product.status || 'Active'}
                                        </span>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        {(product.categories && product.categories.length > 0)
                                            ? product.categories.map(catId => {
                                                const cat = categories.find(c => c.id === catId);
                                                return cat ? (
                                                    <span key={cat.id} style={{
                                                        display: 'inline-block',
                                                        background: '#334155',
                                                        color: '#fff',
                                                        borderRadius: 8,
                                                        padding: '2px 10px',
                                                        fontSize: 12,
                                                        marginRight: 4
                                                    }}>{cat.name}</span>
                                                ) : null;
                                            })
                                            : <span style={{ color: '#94a3b8', fontSize: 12 }}>-</span>}
                                    </td>
                                    <td style={{ padding: 16, textAlign: 'right', position: 'relative' }}>
                                        <button
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: '#94a3b8' }}
                                            onClick={() => handleMenuClick(product.id)}
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        {menuOpen === product.id && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 36,
                                                    right: 0,
                                                    background: '#1e293b',
                                                    border: '1px solid #334155',
                                                    borderRadius: 8,
                                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                                    zIndex: 10,
                                                    minWidth: 120
                                                }}
                                            >
                                                <button
                                                    style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: 'white', padding: 12, textAlign: 'left', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        handleMenuClose();
                                                        navigate(`/store/${storeId}/products/${product.id}/edit`);
                                                    }}
                                                >
                                                    تعديل المنتج
                                                </button>
                                                <button style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: 'white', padding: 12, textAlign: 'left', cursor: 'pointer' }} onClick={handleMenuClose}>حذف المنتج</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreProducts;
