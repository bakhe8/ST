/**
 * Salla Twilight SDK Bridge
 * Redirects core SDK behavior to VTDR simulator endpoints in preview mode.
 */
(function () {
    console.log('[VTDR Bridge] Initializing');

    const salla = window.salla;
    if (!salla) {
        console.error('[VTDR Bridge] window.salla not found');
        return;
    }

    const cartUpdatedHandlers = [];
    const cartItemUpdatedHandlers = [];
    const cartItemUpdatedFailedHandlers = [];
    const orderInvoiceSentHandlers = [];
    const wishlistAddedHandlers = [];
    const wishlistRemovedHandlers = [];

    const getStoreId = () => window.vtdr_context?.storeId || window.__VTDR_STORE_ID__ || '';
    const getPreviewNav = () => window.__VTDR_PREVIEW_NAV__ || {};

    const resolvePreviewBasePath = () => {
        const previewNav = getPreviewNav();
        if (typeof previewNav.resolvePreviewBasePath === 'function') {
            return previewNav.resolvePreviewBasePath();
        }
        const match = window.location.pathname.match(/^\/preview\/[^/]+\/[^/]+\/[^/]+/);
        return match ? match[0] : '';
    };

    const toPreviewUrl = (path, extraParams) => {
        const previewNav = getPreviewNav();
        if (typeof previewNav.toPreviewUrl === 'function') {
            return previewNav.toPreviewUrl(path, extraParams);
        }
        const previewBase = resolvePreviewBasePath();
        if (!previewBase) return null;
        const normalizedPath = String(path || '/').startsWith('/') ? String(path || '/') : `/${String(path || '')}`;
        const cleanPath = normalizedPath === '/' ? '' : normalizedPath;
        return new URL(`${window.location.origin}${previewBase}${cleanPath}`);
    };

    const navigateInPreview = (path, extraParams) => {
        const previewNav = getPreviewNav();
        if (typeof previewNav.navigate === 'function') {
            previewNav.navigate(path, extraParams);
            return;
        }
        const previewUrl = toPreviewUrl(path, extraParams);
        if (previewUrl) {
            window.location.href = previewUrl.toString();
            return;
        }
        window.location.href = String(path || '/');
    };

    const isResourcePath = (pathname) => {
        const previewNav = getPreviewNav();
        if (typeof previewNav.isResourcePath === 'function') {
            return previewNav.isResourcePath(pathname);
        }
        return pathname.startsWith('/themes') ||
            pathname.startsWith('/preview') ||
            /\.[a-z0-9]{2,8}$/i.test(pathname);
    };

    const isStoreLikeDomain = (hostname) => {
        const previewNav = getPreviewNav();
        if (typeof previewNav.isStoreLikeDomain === 'function') {
            return previewNav.isStoreLikeDomain(hostname);
        }
        return /(^|\.)salla\.sa$/i.test(hostname) || /(^|\.)demo\.sa$/i.test(hostname);
    };

    const isLocalDevHost = (hostname) => {
        const previewNav = getPreviewNav();
        if (typeof previewNav.isLocalDevHost === 'function') {
            return previewNav.isLocalDevHost(hostname);
        }
        return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    };

    const resolveAnchorFromEvent = (event) => {
        const previewNav = getPreviewNav();
        if (typeof previewNav.resolveAnchorFromEvent === 'function') {
            return previewNav.resolveAnchorFromEvent(event);
        }
        const directTarget = event?.target?.closest?.('a[href]');
        if (directTarget) return directTarget;
        if (typeof event?.composedPath !== 'function') return null;

        const eventPath = event.composedPath();
        for (const node of eventPath) {
            if (!node) continue;
            if (String(node?.tagName || '').toLowerCase() === 'a') return node;
            const nested = node?.closest?.('a[href]');
            if (nested) return nested;
        }
        return null;
    };

    const parseFormPayload = (event) => {
        const form = event?.target?.closest?.('form') || event?.currentTarget?.closest?.('form') || event?.target;
        if (!(form instanceof HTMLFormElement)) return {};

        const formData = new FormData(form);
        const payload = {};
        formData.forEach((value, key) => {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                const current = payload[key];
                if (Array.isArray(current)) {
                    current.push(value);
                    payload[key] = current;
                } else {
                    payload[key] = [current, value];
                }
                return;
            }
            payload[key] = value;
        });
        return payload;
    };

    async function callLocalApi(path, method = 'POST', body = null) {
        const storeId = getStoreId();
        const headers = {
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };
        if (method !== 'GET') headers['Content-Type'] = 'application/json';

        const response = await fetch(path, {
            method,
            headers,
            body: method === 'GET' ? null : (body ? JSON.stringify(body) : null)
        });

        let payload = null;
        try {
            payload = await response.json();
        } catch {
            payload = null;
        }

        if (!response.ok || (payload && payload.success === false)) {
            const apiMessage =
                payload?.error?.message ||
                payload?.error ||
                payload?.message ||
                response.statusText ||
                'Unknown API error';
            const error = new Error(`API Error: ${apiMessage}`);
            error.response = payload || { status: response.status };
            throw error;
        }

        return payload;
    }

    const readWishlistIds = () => {
        try {
            if (salla.storage?.get) {
                const value = salla.storage.get('salla::wishlist', []);
                if (Array.isArray(value)) {
                    return Array.from(new Set(value.map((entry) => String(entry).trim()).filter(Boolean)));
                }
            }
        } catch {
            // Ignore storage access errors and fallback to localStorage
        }

        try {
            const raw = window.localStorage.getItem('salla::wishlist');
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return Array.from(new Set(parsed.map((entry) => String(entry).trim()).filter(Boolean)));
        } catch {
            return [];
        }
    };

    const writeWishlistIds = (ids) => {
        const normalized = Array.from(new Set((ids || []).map((entry) => String(entry).trim()).filter(Boolean)));
        try {
            if (salla.storage?.set) {
                salla.storage.set('salla::wishlist', normalized);
            } else {
                window.localStorage.setItem('salla::wishlist', JSON.stringify(normalized));
            }
        } catch {
            // Ignore storage write failures in preview.
        }
        return normalized;
    };

    const emitWishlistAdded = (productId, payload) => {
        wishlistAddedHandlers.forEach((handler) => {
            try {
                handler(payload, productId);
            } catch (err) {
                console.error('[VTDR Bridge] wishlist added handler error', err);
            }
        });
        if (salla.event?.dispatch) {
            salla.event.dispatch('wishlist::added', { id: productId, data: payload });
        }
    };

    const emitWishlistRemoved = (productId, payload) => {
        wishlistRemovedHandlers.forEach((handler) => {
            try {
                handler(payload, productId);
            } catch (err) {
                console.error('[VTDR Bridge] wishlist removed handler error', err);
            }
        });
        if (salla.event?.dispatch) {
            salla.event.dispatch('wishlist::removed', { id: productId, data: payload });
        }
    };

    const emitCartUpdated = (cartData) => {
        cartUpdatedHandlers.forEach((handler) => {
            try {
                handler(cartData);
            } catch (err) {
                console.error('[VTDR Bridge] cart updated handler error', err);
            }
        });
        if (salla.event?.dispatch) {
            salla.event.dispatch('cart::updated', cartData);
        }
    };

    const emitCartItemUpdated = (cartData, itemId) => {
        cartItemUpdatedHandlers.forEach((handler) => {
            try {
                handler(cartData, itemId);
            } catch (err) {
                console.error('[VTDR Bridge] cart item updated handler error', err);
            }
        });
        if (salla.event?.dispatch) {
            salla.event.dispatch('cart::item-updated', { data: cartData, itemId });
        }
    };

    const emitCartItemUpdateFailed = (error, itemId) => {
        cartItemUpdatedFailedHandlers.forEach((handler) => {
            try {
                handler(error, itemId);
            } catch (err) {
                console.error('[VTDR Bridge] cart item update failed handler error', err);
            }
        });
        if (salla.event?.dispatch) {
            salla.event.dispatch('cart::item-updated-failed', { error, itemId });
        }
    };

    const emitOrderInvoiceSent = (responseData) => {
        orderInvoiceSentHandlers.forEach((handler) => {
            try {
                handler(responseData);
            } catch (err) {
                console.error('[VTDR Bridge] order invoice handler error', err);
            }
        });
        if (salla.event?.dispatch) {
            salla.event.dispatch('order::invoice-sent', responseData);
        }
    };

    if (salla.event?.cart && typeof salla.event.cart.onUpdated === 'function') {
        const originalOnUpdated = salla.event.cart.onUpdated.bind(salla.event.cart);
        salla.event.cart.onUpdated = (handler) => {
            if (typeof handler === 'function') cartUpdatedHandlers.push(handler);
            try {
                return originalOnUpdated(handler);
            } catch {
                return undefined;
            }
        };
    } else {
        salla.event = salla.event || {};
        salla.event.cart = salla.event.cart || {};
        salla.event.cart.onUpdated = (handler) => {
            if (typeof handler === 'function') cartUpdatedHandlers.push(handler);
        };
    }

    salla.cart = salla.cart || {};
    salla.cart.event = salla.cart.event || {};
    salla.cart.event.onItemUpdated = (handler) => {
        if (typeof handler === 'function') cartItemUpdatedHandlers.push(handler);
    };
    salla.cart.event.onItemUpdatedFailed = (handler) => {
        if (typeof handler === 'function') cartItemUpdatedFailedHandlers.push(handler);
    };

    salla.order = salla.order || {};
    salla.order.event = salla.order.event || {};
    salla.order.event.onInvoiceSent = (handler) => {
        if (typeof handler === 'function') orderInvoiceSentHandlers.push(handler);
    };
    salla.checkout = salla.checkout || {};

    const normalizeCartItemPayload = (payload) => {
        const input = payload && typeof payload === 'object' ? payload : {};
        const toNumber = (value, fallback = 1) => {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : fallback;
        };
        const normalizeString = (value) => String(value == null ? '' : value).trim();

        const productId =
            normalizeString(input.product_id) ||
            normalizeString(input.id) ||
            normalizeString(input.productId);
        const quantity = Math.max(1, Math.floor(toNumber(input.quantity, 1)));
        const price = toNumber(input.price ?? input.unit_price ?? input.sale_price, 0);

        return {
            ...input,
            product_id: productId,
            id: normalizeString(input.id) || productId,
            quantity,
            price
        };
    };

    const cartProxy = {
        details: async () => {
            const result = await callLocalApi('/api/v1/cart', 'GET');
            if (result?.data) emitCartUpdated(result.data);
            return result;
        },
        getCurrentCartId: async () => 'default',
        addItem: async (params) => {
            const payload = normalizeCartItemPayload(params);
            const result = await callLocalApi('/api/v1/cart/items', 'POST', payload);
            if (result?.data) {
                emitCartUpdated(result.data);
                if (salla.event?.dispatch) salla.event.dispatch('cart::item-added', result);
            }
            return result;
        },
        updateItem: async (itemIdOrPayload, quantityArg) => {
            const payloadInput =
                itemIdOrPayload && typeof itemIdOrPayload === 'object'
                    ? itemIdOrPayload
                    : { id: itemIdOrPayload, quantity: quantityArg };
            const payload = normalizeCartItemPayload(payloadInput);
            const itemId = String(payload.id || payload.product_id || '').trim();
            if (!itemId) throw new Error('Cart item id is required');

            try {
                const result = await callLocalApi(`/api/v1/cart/items/${encodeURIComponent(itemId)}`, 'PATCH', {
                    quantity: payload.quantity
                });
                if (result?.data) {
                    emitCartUpdated(result.data);
                    emitCartItemUpdated(result.data, itemId);
                }
                return result;
            } catch (error) {
                emitCartItemUpdateFailed(error, itemId);
                throw error;
            }
        },
        deleteItem: async (itemId) => {
            const normalizedId = String(itemId || '').trim();
            if (!normalizedId) throw new Error('Cart item id is required');
            const result = await callLocalApi(`/api/v1/cart/items/${encodeURIComponent(normalizedId)}`, 'DELETE');
            if (result?.data) {
                emitCartUpdated(result.data);
                if (salla.event?.dispatch) salla.event.dispatch('cart::item-removed', result);
            }
            return result;
        },
        addCoupon: async (couponCode) => {
            const result = await callLocalApi('/api/v1/cart/coupon', 'POST', { coupon: String(couponCode || '').trim() });
            if (result?.data) emitCartUpdated(result.data);
            return result;
        },
        deleteCoupon: async () => {
            const result = await callLocalApi('/api/v1/cart/coupon', 'DELETE');
            if (result?.data) emitCartUpdated(result.data);
            return result;
        },
        submit: async () => {
            return salla.checkout.start({});
        }
    };

    const checkoutProxy = {
        details: async () => {
            return callLocalApi('/api/v1/checkout', 'GET');
        },
        start: async (payload) => {
            const result = await callLocalApi('/api/v1/checkout/start', 'POST', payload || {});
            const step = String(result?.data?.step || 'address').trim().toLowerCase();
            navigateInPreview('/checkout', step ? { step } : null);
            return result;
        },
        updateAddress: async (payload) => {
            const result = await callLocalApi('/api/v1/checkout/address', 'PATCH', payload || {});
            const step = String(result?.data?.step || 'shipping').trim().toLowerCase();
            navigateInPreview('/checkout', step ? { step } : null);
            return result;
        },
        updateShipping: async (payload) => {
            const result = await callLocalApi('/api/v1/checkout/shipping', 'PATCH', payload || {});
            const step = String(result?.data?.step || 'payment').trim().toLowerCase();
            navigateInPreview('/checkout', step ? { step } : null);
            return result;
        },
        updatePayment: async (payload) => {
            const result = await callLocalApi('/api/v1/checkout/payment', 'PATCH', payload || {});
            const step = String(result?.data?.step || 'review').trim().toLowerCase();
            navigateInPreview('/checkout', step ? { step } : null);
            return result;
        },
        confirm: async (payload) => {
            const result = await callLocalApi('/api/v1/checkout/confirm', 'POST', payload || {});
            const redirectPath = result?.data?.redirect_url || '/thank-you';
            const orderId = result?.data?.order?.id;
            navigateInPreview(redirectPath, orderId ? { order_id: orderId } : null);
            return result;
        }
    };

    salla.wishlist = salla.wishlist || {};
    salla.wishlist.event = salla.wishlist.event || {};
    salla.wishlist.event.onAdded = (handler) => {
        if (typeof handler === 'function') wishlistAddedHandlers.push(handler);
    };
    salla.wishlist.event.onRemoved = (handler) => {
        if (typeof handler === 'function') wishlistRemovedHandlers.push(handler);
    };

    const persistWishlistFromApiResponse = (result, fallbackIds = []) => {
        const apiIds = Array.isArray(result?.data?.product_ids) ? result.data.product_ids : fallbackIds;
        return writeWishlistIds(apiIds);
    };

    const wishlistProxy = {
        details: async () => {
            const result = await callLocalApi('/api/v1/wishlist', 'GET');
            persistWishlistFromApiResponse(result, readWishlistIds());
            return result;
        },
        list: async () => {
            const result = await callLocalApi('/api/v1/wishlist', 'GET');
            persistWishlistFromApiResponse(result, readWishlistIds());
            return result;
        },
        add: async (productId) => {
            const payload = { product_id: String(productId || '').trim() };
            if (!payload.product_id) throw new Error('Product id is required');
            const result = await callLocalApi('/api/v1/wishlist/items', 'POST', payload);
            const ids = persistWishlistFromApiResponse(result, [...readWishlistIds(), payload.product_id]);
            emitWishlistAdded(payload.product_id, result);
            return {
                ...result,
                data: {
                    ...(result?.data || {}),
                    product_ids: ids
                }
            };
        },
        remove: async (productId) => {
            const targetId = String(productId || '').trim();
            if (!targetId) throw new Error('Product id is required');
            const result = await callLocalApi(`/api/v1/wishlist/items/${encodeURIComponent(targetId)}`, 'DELETE');
            const ids = persistWishlistFromApiResponse(result, readWishlistIds().filter((id) => id !== targetId));
            emitWishlistRemoved(targetId, result);
            return {
                ...result,
                data: {
                    ...(result?.data || {}),
                    product_ids: ids
                }
            };
        },
        toggle: async (productId) => {
            const payload = { product_id: String(productId || '').trim() };
            if (!payload.product_id) throw new Error('Product id is required');
            const result = await callLocalApi('/api/v1/wishlist/toggle', 'POST', payload);
            const nextIds = persistWishlistFromApiResponse(result, readWishlistIds());
            const action = String(result?.data?.action || '').trim().toLowerCase();
            if (action === 'removed') {
                emitWishlistRemoved(payload.product_id, result);
            } else {
                emitWishlistAdded(payload.product_id, result);
            }
            return {
                ...result,
                data: {
                    ...(result?.data || {}),
                    product_ids: nextIds
                }
            };
        },
        has: (productId) => {
            const targetId = String(productId || '').trim();
            if (!targetId) return false;
            return readWishlistIds().includes(targetId);
        },
        isInWishlist: (productId) => {
            const targetId = String(productId || '').trim();
            if (!targetId) return false;
            return readWishlistIds().includes(targetId);
        }
    };

    const authProxy = {
        login: async (payload) => {
            const result = await callLocalApi('/api/v1/auth/login', 'POST', payload || {});
            if (salla.event?.dispatch) salla.event.dispatch('auth::code-sent', result);
            return result;
        }
    };

    const orderProxy = {
        details: async (orderId) => {
            const targetId = String(orderId || '').trim();
            if (!targetId) return callLocalApi('/api/v1/orders', 'GET');
            return callLocalApi(`/api/v1/orders/${encodeURIComponent(targetId)}`, 'GET');
        },
        list: async (query = {}) => {
            const params = new URLSearchParams();
            if (query && typeof query === 'object') {
                Object.entries(query).forEach(([key, value]) => {
                    if (value == null || value === '') return;
                    params.set(String(key), String(value));
                });
            }
            const suffix = params.toString() ? `?${params.toString()}` : '';
            return callLocalApi(`/api/v1/orders${suffix}`, 'GET');
        },
        show: (payload) => {
            const orderId = String(payload?.order_id || payload?.id || '').trim();
            const target = payload?.url || (orderId ? `/customer/orders/${orderId}` : '/customer/orders');
            navigateInPreview(target);
            return Promise.resolve({ success: true });
        },
        sendInvoice: async (payload) => {
            const result = await callLocalApi('/api/v1/orders/send-invoice', 'POST', payload || {});
            emitOrderInvoiceSent(result);
            return result;
        },
        createCartFromOrder: async () => {
            navigateInPreview('/cart');
            return { success: true };
        },
        cancel: async () => ({ success: true })
    };

    Object.assign(salla.cart, cartProxy);
    Object.assign(salla.checkout, checkoutProxy);
    Object.assign(salla.wishlist, wishlistProxy);
    Object.assign(salla.auth || {}, authProxy);
    salla.auth = salla.auth || {};
    Object.assign(salla.auth, authProxy);
    Object.assign(salla.order, orderProxy);

    salla.api = salla.api || {};
    salla.api.cart = salla.api.cart || {};
    salla.api.cart.getCurrentCartId = async () => 'default';
    salla.api.cart.details = (...args) => salla.cart.details(...args);
    salla.api.checkout = salla.api.checkout || {};
    salla.api.checkout.details = (...args) => salla.checkout.details(...args);
    salla.api.checkout.start = (...args) => salla.checkout.start(...args);
    salla.api.wishlist = salla.api.wishlist || {};
    salla.api.wishlist.details = (...args) => salla.wishlist.details(...args);
    salla.api.wishlist.toggle = (...args) => salla.wishlist.toggle(...args);
    salla.api.orders = salla.api.orders || {};
    salla.api.orders.list = (...args) => salla.order.list(...args);
    salla.api.orders.details = (...args) => salla.order.details(...args);

    const originalForm = salla.form || {};
    const originalOnSubmit = typeof originalForm.onSubmit === 'function' ? originalForm.onSubmit.bind(originalForm) : null;
    const originalOnChange = typeof originalForm.onChange === 'function' ? originalForm.onChange.bind(originalForm) : null;
    salla.form = salla.form || {};

    salla.form.onSubmit = function (action, event) {
        const run = async () => {
            const normalizedAction = String(action || '').trim();

            if (normalizedAction === 'cart.addItem') {
                if (event?.preventDefault) event.preventDefault();
                const payload = normalizeCartItemPayload(parseFormPayload(event));
                await salla.cart.addItem(payload);
                await salla.cart.details();
                return false;
            }

            if (normalizedAction === 'order.sendInvoice') {
                if (event?.preventDefault) event.preventDefault();
                const formPayload = parseFormPayload(event);
                const currentUrl = new URL(window.location.href);
                const orderId = String(formPayload.order_id || currentUrl.searchParams.get('order_id') || '').trim();
                const payload = {
                    ...formPayload,
                    order_id: orderId || undefined
                };
                await salla.order.sendInvoice(payload);
                return false;
            }

            if (normalizedAction === 'checkout.start') {
                if (event?.preventDefault) event.preventDefault();
                const formPayload = parseFormPayload(event);
                await salla.checkout.start(formPayload);
                return false;
            }

            if (normalizedAction === 'checkout.updateAddress') {
                if (event?.preventDefault) event.preventDefault();
                const formPayload = parseFormPayload(event);
                await salla.checkout.updateAddress(formPayload);
                return false;
            }

            if (normalizedAction === 'checkout.updateShipping') {
                if (event?.preventDefault) event.preventDefault();
                const formPayload = parseFormPayload(event);
                await salla.checkout.updateShipping(formPayload);
                return false;
            }

            if (normalizedAction === 'checkout.updatePayment') {
                if (event?.preventDefault) event.preventDefault();
                const formPayload = parseFormPayload(event);
                await salla.checkout.updatePayment(formPayload);
                return false;
            }

            if (normalizedAction === 'checkout.confirm') {
                if (event?.preventDefault) event.preventDefault();
                const formPayload = parseFormPayload(event);
                await salla.checkout.confirm(formPayload);
                return false;
            }

            if (originalOnSubmit) return originalOnSubmit(action, event);
            return false;
        };

        return run();
    };

    salla.form.onChange = function (action, event) {
        const run = async () => {
            const normalizedAction = String(action || '').trim();
            if (normalizedAction === 'cart.updateItem') {
                if (event?.preventDefault) event.preventDefault();
                const payload = parseFormPayload(event);
                const itemId = String(payload.id || payload.item_id || payload.product_id || '').trim();
                const quantity = Number(payload.quantity || 1);
                if (!itemId) return false;
                await salla.cart.updateItem(itemId, quantity);
                return false;
            }

            if (originalOnChange) return originalOnChange(action, event);
            return false;
        };

        return run();
    };

    document.addEventListener('click', (event) => {
        const toggleBtn = event.target?.closest?.('.s-product-card-wishlist-btn[data-id], .btn--wishlist[data-id]');
        if (toggleBtn) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
            const productId = String(toggleBtn.getAttribute('data-id') || '').trim();
            if (!productId) return;
            salla.wishlist.toggle(productId).catch((error) => {
                const message = error?.response?.error?.message || error?.message || 'فشل تحديث المفضلة';
                if (window.salla?.notify?.error) window.salla.notify.error(message);
            });
            return;
        }

        const removeBtn = event.target?.closest?.('#wishlist .btn--delete');
        if (removeBtn) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
            const wishlistItem = removeBtn.closest('[id^="wishlist-product-"]');
            const productId = String(wishlistItem?.id || '').replace(/^wishlist-product-/, '').trim();
            if (!productId) return;
            salla.wishlist.remove(productId).catch((error) => {
                const message = error?.response?.error?.message || error?.message || 'فشل حذف العنصر من المفضلة';
                if (window.salla?.notify?.error) window.salla.notify.error(message);
            });
        }
    }, true);

    document.addEventListener('click', (event) => {
        const link = resolveAnchorFromEvent(event);
        if (!link) return;

        const hrefAttr = link.getAttribute('href') || '';
        if (!hrefAttr || hrefAttr.startsWith('#') || hrefAttr.startsWith('javascript:')) return;
        if (hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:')) return;

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (link.target === '_blank' || link.hasAttribute('download')) return;

        const previewBase = resolvePreviewBasePath();
        if (!previewBase) return;

        const currentUrl = new URL(window.location.href);
        const url = new URL(link.href, window.location.href);
        const sameOrigin = url.origin === window.location.origin;
        const externalStoreLike = !sameOrigin && (isStoreLikeDomain(url.hostname) || isLocalDevHost(url.hostname));
        if (!sameOrigin && !externalStoreLike) return;

        const path = url.pathname || '/';
        if (isResourcePath(path)) return;

        event.preventDefault();
        const nextUrl = toPreviewUrl(path);
        if (!nextUrl) return;

        url.searchParams.forEach((value, key) => {
            nextUrl.searchParams.set(key, value);
        });

        const viewport = currentUrl.searchParams.get('viewport');
        if (viewport) nextUrl.searchParams.set('viewport', viewport);

        const refresh = currentUrl.searchParams.get('refresh');
        if (refresh) nextUrl.searchParams.set('refresh', refresh);

        if (url.hash) nextUrl.hash = url.hash;

        window.location.href = nextUrl.toString();
    });

    callLocalApi('/api/v1/wishlist', 'GET')
        .then((result) => {
            persistWishlistFromApiResponse(result, readWishlistIds());
        })
        .catch(() => {
            // Keep preview browsing resilient even if wishlist bootstrap fails.
        });

    console.log('[VTDR Bridge] Ready');
})();
