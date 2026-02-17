/**
 * Salla Twilight SDK Bridge
 * This script intercepts Salla SDK calls and redirects them to the local simulator.
 */
(function () {
    console.log('🚀 Salla SDK Bridge Active');

    const originalSalla = window.salla;
    if (!originalSalla) {
        console.error('❌ Salla SDK not found. Bridge failed to initialize.');
        return;
    }

    // --- Utility: Local API Fetch ---
    async function callLocalApi(path, method = 'POST', body = null) {
        // Store-First context: resolve current store ID from runtime context.
        const storeId = window.vtdr_context?.storeId || window.__VTDR_STORE_ID__;

        const response = await fetch(path, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-VTDR-Store-Id': storeId || '',
                'Context-Store-Id': storeId || ''
            },
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    }

    // --- Intercept: Cart ---
    const cartProxy = {
        addItem: async (params) => {
            console.log('🛒 Bridge: Cart.addItem', params);
            try {
                const result = await callLocalApi('/api/v1/cart/items', 'POST', params);
                salla.event.dispatch('cart::item-added', result);
                return result;
            } catch (e) {
                salla.event.dispatch('cart::item-added-failed', { error: e.message });
                throw e;
            }
        },
        updateItem: async (itemId, quantity) => {
            console.log('🛒 Bridge: Cart.updateItem', { itemId, quantity });
            return await callLocalApi(`/api/v1/cart/items/${itemId}`, 'PATCH', { quantity });
        },
        deleteItem: async (itemId) => {
            console.log('🛒 Bridge: Cart.deleteItem', itemId);
            return await callLocalApi(`/api/v1/cart/items/${itemId}`, 'DELETE');
        },
        details: async () => {
            console.log('🛒 Bridge: Cart.details');
            return await callLocalApi('/api/v1/cart', 'GET');
        }
    };

    // --- Intercept: Auth ---
    const authProxy = {
        login: async (payload) => {
            console.log('🔑 Bridge: Auth.login', payload);
            try {
                const result = await callLocalApi('/api/v1/auth/login', 'POST', payload);
                salla.event.dispatch('auth::code-sent', result);
                return result;
            } catch (e) {
                salla.event.dispatch('auth::code-not-sent', { error: e.message });
                throw e;
            }
        }
    };

    // --- Apply Proxies ---
    // Note: Salla SDK is usually initialized. We override the instances.
    Object.assign(salla.cart, cartProxy);
    Object.assign(salla.auth, authProxy);

    // --- Universal Navigation Interceptor ---
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
            const url = new URL(link.href);
            // If it's a relative link to our own origin but NOT a preview or theme asset link
            if (url.origin === window.location.origin) {
                const path = url.pathname;
                if (!path.startsWith('/preview') && !path.startsWith('/themes') && path !== '/' && !path.includes('.')) {
                    e.preventDefault();
                    console.log('🔗 Bridge: Intercepted Navigation to', path);

                    const pageId = path.startsWith('/') ? path.slice(1) : path;
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('page', pageId);

                    window.location.href = currentUrl.toString();
                }
            }
        }
    });

    console.log('✅ Salla SDK Methods Instrumented & Navigation Interceptor Active');
})();
