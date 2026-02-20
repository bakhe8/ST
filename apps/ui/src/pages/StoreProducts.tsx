import React, { useEffect, useState } from 'react';
import { apiUrl } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { MoreHorizontal, Plus, Search } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: { amount?: number; currency?: string } | number;
    sku?: string;
    status?: string;
    type?: string;
    images?: { url: string }[];
    main_image?: string;
    image?: { url: string };
    thumbnail?: string;
    categories?: ({ id?: string; name?: string } | string)[];
    category_ids?: string[];
    options?: { id?: string; name?: string; type?: string; values?: any[] }[];
    variants?: { id?: string; sku?: string; quantity?: number }[];
    stock?: number;
    quantity?: number | null;
    available_quantity?: number | null;
    reserved_quantity?: number;
    max_quantity?: number;
    low_stock_threshold?: number;
    track_quantity?: boolean;
    allow_backorder?: boolean;
    inventory_status?: string;
    is_available?: boolean;
    is_infinite_quantity?: boolean;
    is_out_of_stock?: boolean;
    is_featured?: boolean;
    weight?: number;
    weight_unit?: string;
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
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('ourSuggest');
    const [stockFilter, setStockFilter] = useState('');

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearchTerm(searchTerm.trim());
        }, 300);
        return () => window.clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => {
        const headers = {
            'X-VTDR-Store-Id': storeId || ''
        };

        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
        if (selectedCategory) params.set('category_id', selectedCategory);
        if (sortBy) params.set('sort', sortBy);
        if (stockFilter) params.set('status', stockFilter);

        const endpoint = params.toString()
            ? `v1/products?${params.toString()}`
            : 'v1/products';

        setLoading(true);
        fetch(apiUrl(endpoint), { headers })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && Array.isArray(data.data)) {
                    setProducts(data.data);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setProducts([]);
                setLoading(false);
            });
    }, [storeId, debouncedSearchTerm, selectedCategory, sortBy, stockFilter]);

    useEffect(() => {
        // جلب الأقسام لعرض أسمائها
        fetch(apiUrl('v1/categories'), {
            headers: { 'X-VTDR-Store-Id': storeId || '' }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setCategories(data.data);
            });
    }, [storeId]);

    // لإظهار قائمة الخيارات المنبثقة
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const handleMenuClick = (id: string) => {
        setMenuOpen(menuOpen === id ? null : id);
    };

    // صورة افتراضية في حال فشل تحميل الصورة المحلية
    const placeholderImg = '/images/placeholder.png';
    const getProductCategoryIds = (product: Product) => {
        if (Array.isArray(product.category_ids) && product.category_ids.length > 0) {
            return product.category_ids.map(String);
        }
        if (!Array.isArray(product.categories)) return [];
        return product.categories
            .map((category: any) => {
                if (typeof category === 'string') return category;
                if (category && typeof category === 'object' && category.id != null) return String(category.id);
                return '';
            })
            .filter(Boolean);
    };
    const isExternalPlaceholder = (url?: string) => !!url && /via\.placeholder\.com/i.test(url);
    const resolveImageSrc = (url?: string) => {
        if (!url || isExternalPlaceholder(url)) return placeholderImg;
        return url;
    };
    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== window.location.origin + placeholderImg) {
            target.src = placeholderImg;
        }
    };
    const getPriceAmount = (price: Product['price']) => {
        if (typeof price === 'number') return price;
        const amount = Number(price?.amount ?? 0);
        return Number.isFinite(amount) ? amount : 0;
    };
    const getPriceCurrency = (price: Product['price']) => {
        if (price && typeof price === 'object' && typeof price.currency === 'string' && price.currency.trim()) {
            return price.currency;
        }
        return 'SAR';
    };
    const getDisplayQuantity = (product: Product) => {
        if (typeof product.available_quantity === 'number') return String(product.available_quantity);
        if (product.is_infinite_quantity) return '∞';
        if (typeof product.quantity === 'number') return String(product.quantity);
        if (typeof product.stock === 'number') return String(product.stock);
        return '-';
    };
    const getStatusView = (product: Product) => {
        const inventoryStatus = String(product.inventory_status || '').toLowerCase();
        const rawStatus = String(product.status || '').toLowerCase();
        if (rawStatus === 'hidden') return { label: 'Hidden', bg: 'rgba(148,163,184,0.2)', color: '#94a3b8' };
        if (inventoryStatus === 'backorder') return { label: 'Backorder', bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' };
        if (inventoryStatus === 'low_stock') return { label: 'Low Stock', bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
        const isOut =
            product.is_out_of_stock === true ||
            rawStatus === 'out' ||
            rawStatus === 'out-of-stock' ||
            rawStatus === 'out_of_stock' ||
            rawStatus === 'out-and-notify';
        if (isOut) return { label: rawStatus === 'out-and-notify' ? 'Out + Notify' : 'Out of Stock', bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' };
        return { label: 'Active', bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399' };
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '0 16px', minWidth: 140 }}
                >
                    <option value="">كل الحالات</option>
                    <option value="in-stock">متوفر</option>
                    <option value="low-stock">مخزون منخفض</option>
                    <option value="out-of-stock">غير متوفر</option>
                    <option value="backorder">طلب مسبق</option>
                    <option value="hidden">مخفي</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: 'white', padding: '0 16px', minWidth: 170 }}
                >
                    <option value="ourSuggest">الأفضل</option>
                    <option value="bestSell">الأكثر مبيعاً</option>
                    <option value="topRated">الأعلى تقييماً</option>
                    <option value="priceFromLowToTop">السعر: الأقل للأعلى</option>
                    <option value="priceFromTopToLow">السعر: الأعلى للأقل</option>
                    <option value="latest">الأحدث</option>
                    <option value="stockFromLowToTop">المخزون: الأقل للأعلى</option>
                    <option value="stockFromTopToLow">المخزون: الأعلى للأقل</option>
                    <option value="featured">المميزة أولاً</option>
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
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Options / Variants</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Status</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}>Categories</th>
                            <th style={{ padding: 16, borderBottom: '1px solid #334155' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={10} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={10} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No products found.</td></tr>
                        ) : products.map(product => {
                            const statusView = getStatusView(product);
                            return (
                                <tr key={product.id} style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 40, height: 40, background: '#334155', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {(
                                                product.main_image ? (
                                                    <img src={resolveImageSrc(product.main_image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                                                ) : product.image?.url ? (
                                                    <img src={resolveImageSrc(product.image.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                                                ) : product.images?.[0] ? (
                                                    <img src={resolveImageSrc(product.images[0].url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                                                ) : (
                                                    <img src={placeholderImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                )
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <span style={{ fontWeight: 500 }}>{product.name}</span>
                                            {product.is_featured && (
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: 'fit-content',
                                                    background: 'rgba(59,130,246,0.25)',
                                                    color: '#93c5fd',
                                                    borderRadius: 8,
                                                    padding: '2px 8px',
                                                    fontSize: 11
                                                }}>
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {(product.images || []).slice(0, 3).map((img, idx) => (
                                                <img key={idx} src={resolveImageSrc(img.url)} alt="img" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6, border: '1px solid #334155', background: '#0f172a' }} onError={handleImgError} />
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: 16, color: '#94a3b8', fontFamily: 'monospace' }}>{product.sku || '-'}</td>
                                    <td style={{ padding: 16 }}>
                                        {getPriceAmount(product.price)} <span style={{ fontSize: 12, color: '#94a3b8' }}>{getPriceCurrency(product.price)}</span>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <span>{getDisplayQuantity(product)}</span>
                                            {typeof product.low_stock_threshold === 'number' && product.low_stock_threshold > 0 && (
                                                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                                    low {'<='} {product.low_stock_threshold}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        {(product.properties && product.properties.length > 0)
                                            ? product.properties.map((prop, idx) => (
                                                <span key={idx} style={{ display: 'inline-block', background: '#334155', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 12, marginRight: 4 }}>{prop.key}: {prop.value}</span>
                                            ))
                                            : <span style={{ color: '#94a3b8', fontSize: 12 }}>-</span>}
                                        {typeof product.weight === 'number' && product.weight > 0 && (
                                            <span style={{ display: 'inline-block', background: '#334155', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 12, marginLeft: 4 }}>
                                                {product.weight} {product.weight_unit || 'kg'}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <span style={{ display: 'inline-block', background: '#334155', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 12, marginRight: 6 }}>
                                            options: {Array.isArray(product.options) ? product.options.length : 0}
                                        </span>
                                        <span style={{ display: 'inline-block', background: '#334155', color: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 12 }}>
                                            variants: {Array.isArray(product.variants) ? product.variants.length : 0}
                                        </span>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: 12,
                                            background: statusView.bg,
                                            color: statusView.color,
                                            fontSize: 12
                                        }}>
                                            {statusView.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        {(getProductCategoryIds(product).length > 0)
                                            ? getProductCategoryIds(product).map(catId => {
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreProducts;
