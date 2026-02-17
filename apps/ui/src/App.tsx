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

const App = () => {
    return (
        <BrowserRouter>
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
                    <Route path="categories" element={<StoreCategories />} />
                    <Route path="static-pages" element={<StoreStaticPages />} />
                    <Route path="settings" element={<StoreSettingsPanel />} />
                    <Route path="theme" element={<ThemeSettingsPanel />} />
                    <Route path="preview" element={<StorePreview />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
