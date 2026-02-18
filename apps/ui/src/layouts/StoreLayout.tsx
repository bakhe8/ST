import React from 'react';
import { Outlet, Link, useParams, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Palette, Settings, ArrowLeft, Book, Folder, Newspaper, Tags, Gem, BadgePercent, ListTree } from 'lucide-react';

const StoreLayout = () => {
    const { storeId } = useParams();
    const location = useLocation();

    const menu = [
        { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, path: `/store/${storeId}` },
        { id: 'preview', label: 'المعاينة المباشرة', icon: Palette, path: `/store/${storeId}/preview` },
        { id: 'products', label: 'المنتجات', icon: ShoppingBag, path: `/store/${storeId}/products` },
        { id: 'brands', label: 'الماركات', icon: Gem, path: `/store/${storeId}/brands` },
        { id: 'categories', label: 'الأقسام', icon: Folder, path: `/store/${storeId}/categories` },
        { id: 'offers', label: 'العروض الخاصة', icon: BadgePercent, path: `/store/${storeId}/offers` },
        { id: 'static-pages', label: 'الصفحات الثابتة', icon: Book, path: `/store/${storeId}/static-pages` },
        { id: 'menus', label: 'قوائم التنقل', icon: ListTree, path: `/store/${storeId}/menus` },
        { id: 'blog-categories', label: 'تصنيفات المدونة', icon: Tags, path: `/store/${storeId}/blog/categories` },
        { id: 'blog-articles', label: 'مقالات المدونة', icon: Newspaper, path: `/store/${storeId}/blog/articles` },
        { id: 'theme', label: 'تخصيص الثيم', icon: Palette, path: `/store/${storeId}/theme` },
        { id: 'theme-components', label: 'مكونات الصفحات', icon: Book, path: `/store/${storeId}/theme-components` },
        { id: 'settings', label: 'إعدادات المتجر', icon: Settings, path: `/store/${storeId}/settings` },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex' }}>
            {/* Store Sidebar */}
            <aside style={{ width: 260, borderLeft: '1px solid #1e293b', background: '#1e293b', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 24, paddingBottom: 12 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', textDecoration: 'none', marginBottom: 24, fontSize: 14 }}>
                        <ArrowLeft size={16} />
                        عودة للمتاجر
                    </Link>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>متجر التميز</h2>
                    <div style={{ fontSize: 12, color: '#64748b' }}>ID: {storeId}</div>
                </div>

                <nav style={{ flex: 1, padding: '0 12px' }}>
                    {menu.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '12px 16px',
                                    borderRadius: 8,
                                    marginBottom: 4,
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : '#94a3b8',
                                    background: isActive ? '#3b82f6' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <item.icon size={18} />
                                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Topbar */}
                <header style={{ height: 60, borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', padding: '0 24px', background: 'rgba(30, 41, 59, 0.5)', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 14, color: '#94a3b8' }}>Visual Store Simulator</div>
                    <Link to={`/store/${storeId}/preview`} style={{ fontSize: 14, color: '#3b82f6', textDecoration: 'none' }}>
                        فتح المعاينة ↗
                    </Link>
                </header>

                <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default StoreLayout;
