import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SystemLayout from './layouts/SystemLayout';
import StoreLayout from './layouts/StoreLayout';
import SystemHome from './pages/SystemHome';
import StoreDashboard from './pages/StoreDashboard';
import StoreSettingsPanel from './components/StoreSettingsPanel';
import ThemeSettingsPanel from './components/ThemeSettingsPanel';
import StoreProducts from './pages/StoreProducts';
import StorePreview from './pages/StorePreview';
import EditProduct from './pages/EditProduct';
import StoreCategories from './pages/StoreCategories';
import StoreStaticPages from './pages/StoreStaticPages';
import StoreThemeComponents from './pages/StoreThemeComponents';
import StoreBlogCategories from './pages/StoreBlogCategories';
import StoreBlogArticles from './pages/StoreBlogArticles';
import StoreBrands from './pages/StoreBrands';
import StoreOffers from './pages/StoreOffers';
import StoreMenus from './pages/StoreMenus';

const App = () => {
    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <Routes>
                {/* System Admin Routes */}
                <Route path="/" element={<SystemLayout />}>
                    <Route index element={<SystemHome />} />
                    <Route path="settings" element={<div>System Settings (Coming Soon)</div>} />
                </Route>

                {/* Store Admin Routes */}
                <Route path="/store/:storeId" element={<StoreLayout />}>
                    <Route index element={<StoreDashboard />} />
                    <Route path="products" element={<StoreProducts />} />
                    <Route path="products/:productId/edit" element={<EditProduct />} />
                    <Route path="brands" element={<StoreBrands />} />
                    <Route path="offers" element={<StoreOffers />} />
                    <Route path="categories" element={<StoreCategories />} />
                    <Route path="static-pages" element={<StoreStaticPages />} />
                    <Route path="menus" element={<StoreMenus />} />
                    <Route path="blog/categories" element={<StoreBlogCategories />} />
                    <Route path="blog/articles" element={<StoreBlogArticles />} />
                    <Route path="settings" element={<StoreSettingsPanel />} />
                    <Route path="theme" element={<ThemeSettingsPanel />} />
                    <Route path="theme-components" element={<StoreThemeComponents />} />
                    <Route path="preview" element={<StorePreview />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
