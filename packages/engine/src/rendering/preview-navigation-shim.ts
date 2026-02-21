interface PreviewNavigationShimOptions {
  previewBasePath: string;
  viewport?: string;
  refresh?: string;
  storeId?: string;
}

export function buildPreviewNavigationShimScript(
  options: PreviewNavigationShimOptions,
): string {
  const previewBaseLiteral = JSON.stringify(
    String(options.previewBasePath || ""),
  );
  const viewportLiteral = JSON.stringify(String(options.viewport || ""));
  const refreshLiteral = JSON.stringify(String(options.refresh || ""));
  const storeIdLiteral = JSON.stringify(String(options.storeId || ""));

  return `
            <script>
            (function () {
                var previewBaseFallback = ${previewBaseLiteral};
                var viewportFallback = ${viewportLiteral};
                var refreshFallback = ${refreshLiteral};
                var storeIdFallback = ${storeIdLiteral};
                var nav = window.__VTDR_PREVIEW_NAV__ || {};

                nav.resolvePreviewBasePath = function () {
                    var match = window.location.pathname.match(/^\\/preview\\/[^/]+\\/[^/]+\\/[^/]+/);
                    return match ? match[0] : previewBaseFallback;
                };

                nav.isResourcePath = function (pathname) {
                    return pathname.startsWith('/themes') ||
                        pathname.startsWith('/preview') ||
                        /\\.[a-z0-9]{2,8}$/i.test(pathname);
                };

                nav.isStoreLikeDomain = function (hostname) {
                    return /(^|\\.)salla\\.sa$/i.test(hostname) || /(^|\\.)demo\\.sa$/i.test(hostname);
                };

                nav.isLocalDevHost = function (hostname) {
                    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
                };

                nav.resolveAnchorFromEvent = function (event) {
                    var directTarget = event && event.target && event.target.closest ? event.target.closest('a[href]') : null;
                    if (directTarget) return directTarget;
                    if (!event || typeof event.composedPath !== 'function') return null;

                    var eventPath = event.composedPath();
                    for (var i = 0; i < eventPath.length; i += 1) {
                        var node = eventPath[i];
                        if (!node) continue;
                        if (node.tagName && String(node.tagName).toLowerCase() === 'a') return node;
                        if (node.closest) {
                            var nested = node.closest('a[href]');
                            if (nested) return nested;
                        }
                    }
                    return null;
                };

                nav.toPreviewUrl = function (path, extraParams) {
                    var previewBase = nav.resolvePreviewBasePath();
                    if (!previewBase) return null;

                    var currentUrl = new URL(window.location.href);
                    var normalizedPath = String(path || '/').startsWith('/') ? String(path || '/') : '/' + String(path || '');
                    var cleanPath = normalizedPath === '/' ? '' : normalizedPath;
                    var nextUrl = new URL(window.location.origin + previewBase + cleanPath);

                    var viewport = currentUrl.searchParams.get('viewport') || viewportFallback;
                    if (viewport) nextUrl.searchParams.set('viewport', viewport);

                    var refresh = currentUrl.searchParams.get('refresh') || refreshFallback;
                    if (refresh) nextUrl.searchParams.set('refresh', refresh);

                    if (extraParams && typeof extraParams === 'object') {
                        Object.entries(extraParams).forEach(function (entry) {
                            var key = entry[0];
                            var value = entry[1];
                            if (value == null) return;
                            nextUrl.searchParams.set(String(key), String(value));
                        });
                    }

                    return nextUrl;
                };

                nav.navigate = function (path, extraParams) {
                    var nextUrl = nav.toPreviewUrl(path, extraParams);
                    if (nextUrl) {
                        window.location.href = nextUrl.toString();
                        return true;
                    }
                    window.location.href = String(path || '/');
                    return false;
                };

                window.__VTDR_PREVIEW_NAV__ = nav;

                if (window.__VTDR_NAV_SHIM__) return;
                window.__VTDR_NAV_SHIM__ = true;

                if (!window.__VTDR_API_CONTEXT_SHIM__) {
                    window.__VTDR_API_CONTEXT_SHIM__ = true;

                    var isLocalDevHost = function (hostname) {
                        return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
                    };

                    var resolveStoreId = function () {
                        var fromContext = window.vtdr_context && window.vtdr_context.storeId
                            ? String(window.vtdr_context.storeId)
                            : '';
                        return fromContext || storeIdFallback || '';
                    };

                    var shouldDecorateApiRequest = function (rawUrl) {
                        try {
                            var parsed = new URL(rawUrl, window.location.href);
                            if (!parsed.pathname.startsWith('/api/v1/')) return false;
                            if (parsed.origin === window.location.origin) return true;
                            return isLocalDevHost(parsed.hostname);
                        } catch (e) {
                            return false;
                        }
                    };

                    var normalizeApiUrl = function (rawUrl) {
                        try {
                            var parsed = new URL(rawUrl, window.location.href);
                            var pathname = String(parsed.pathname || '');
                            pathname = pathname.replace(/(\\/api\\/v1){2,}/g, '/api/v1');
                            parsed.pathname = pathname;
                            return parsed.toString();
                        } catch (e) {
                            return rawUrl;
                        }
                    };

                    var isSameOriginApiRequest = function (rawUrl) {
                        try {
                            var parsed = new URL(rawUrl, window.location.href);
                            return parsed.origin === window.location.origin;
                        } catch (e) {
                            return false;
                        }
                    };

                    var addStoreIdToUrl = function (rawUrl, storeId) {
                        try {
                            var parsed = new URL(rawUrl, window.location.href);
                            if (!parsed.searchParams.get('store_id')) {
                                parsed.searchParams.set('store_id', storeId);
                            }
                            return parsed.toString();
                        } catch (e) {
                            return rawUrl;
                        }
                    };

                    if (typeof window.fetch === 'function') {
                        var originalFetch = window.fetch.bind(window);
                        window.fetch = function (input, init) {
                            var storeId = resolveStoreId();
                            if (!storeId) return originalFetch(input, init);

                            var rawUrl = '';
                            if (typeof input === 'string' || input instanceof URL) {
                                rawUrl = String(input);
                            } else if (input && typeof input.url === 'string') {
                                rawUrl = input.url;
                            }
                            rawUrl = normalizeApiUrl(rawUrl);

                            if (!rawUrl || !shouldDecorateApiRequest(rawUrl)) {
                                return originalFetch(input, init);
                            }

                            var nextUrl = addStoreIdToUrl(rawUrl, storeId);
                            var sameOrigin = isSameOriginApiRequest(nextUrl);
                            var headers = new Headers((init && init.headers) || (input && input.headers) || {});
                            if (sameOrigin) {
                                if (!headers.has('X-VTDR-Store-Id')) headers.set('X-VTDR-Store-Id', storeId);
                            }

                            var nextInit = Object.assign({}, init || {}, { headers: headers });
                            var method = (init && init.method) || (input && input.method) || undefined;
                            if (method && !nextInit.method) nextInit.method = method;

                            if (typeof Request !== 'undefined' && input instanceof Request) {
                                return originalFetch(new Request(nextUrl, input), nextInit);
                            }

                            return originalFetch(nextUrl, nextInit);
                        };
                    }

                    if (typeof XMLHttpRequest !== 'undefined') {
                        var xhrOpen = XMLHttpRequest.prototype.open;
                        var xhrSend = XMLHttpRequest.prototype.send;

                        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                            var storeId = resolveStoreId();
                            var rawUrl = normalizeApiUrl(String(url || ''));
                            var shouldDecorate = Boolean(storeId) && shouldDecorateApiRequest(rawUrl);
                            var sameOrigin = shouldDecorate ? isSameOriginApiRequest(rawUrl) : false;

                            this.__vtdrStoreId = storeId || '';
                            this.__vtdrDecorate = shouldDecorate;
                            this.__vtdrSameOrigin = sameOrigin;
                            this.__vtdrDecoratedUrl = shouldDecorate ? addStoreIdToUrl(rawUrl, storeId) : rawUrl;

                            return xhrOpen.call(
                                this,
                                method,
                                this.__vtdrDecoratedUrl,
                                async,
                                user,
                                password
                            );
                        };

                        XMLHttpRequest.prototype.send = function (body) {
                            try {
                                if (this.__vtdrDecorate && this.__vtdrStoreId && this.__vtdrSameOrigin) {
                                    this.setRequestHeader('X-VTDR-Store-Id', this.__vtdrStoreId);
                                }
                            } catch (e) {
                                // Ignore header injection failures.
                            }

                            return xhrSend.call(this, body);
                        };
                    }
                }

                document.addEventListener('click', function (event) {
                    var link = nav.resolveAnchorFromEvent(event);
                    if (!link) return;

                    var hrefAttr = link.getAttribute('href') || '';
                    if (!hrefAttr || hrefAttr.startsWith('#') || hrefAttr.startsWith('javascript:')) return;
                    if (hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:')) return;
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    if (link.target === '_blank' || link.hasAttribute('download')) return;

                    var url = new URL(link.href, window.location.href);
                    var sameOrigin = url.origin === window.location.origin;
                    var bridgeableExternal = nav.isStoreLikeDomain(url.hostname) || nav.isLocalDevHost(url.hostname);
                    if (!sameOrigin && !bridgeableExternal) return;

                    var routePath = url.pathname || '/';
                    if (nav.isResourcePath(routePath)) return;

                    var nextUrl = nav.toPreviewUrl(routePath);
                    if (!nextUrl) return;

                    url.searchParams.forEach(function (value, key) {
                        nextUrl.searchParams.set(key, value);
                    });
                    if (url.hash) nextUrl.hash = url.hash;

                    event.preventDefault();
                    window.location.href = nextUrl.toString();
                }, true);
            })();
            </script>
    `;
}
