import { createRequire } from 'module';
import { RuntimeContext } from '@vtdr/contracts';
import * as path from 'path';
import { AsyncLocalStorage } from 'async_hooks';
import { SchemaService } from '../core/schema-service.js';
import { IFileSystem } from '../infra/file-system.interface.js';


const require = createRequire(import.meta.url);
const Twig = require('twig');

export class RendererService {
    private isInitialized = false;
    private storage = new AsyncLocalStorage<{
        translations: Record<string, string>,
        themeFolder: string,
        viewsPath: string,
        context?: RuntimeContext,
        renderContext?: any
    }>();

    constructor(private themesBaseDir: string, private fs: IFileSystem, private schemaService: SchemaService) {
        this.initializeTwigOnce();
    }

    private initializeTwigOnce() {
        if (this.isInitialized) return;
        (Twig as any).cache(false);

        // ... [OMITTING FILTERS FOR BREVITY IN TargetContent BUT REPLACING IN REPLACEMENTCONTENT]
        // Actually, I should probably keep the filters and just change the file usage.
        // Let's use multi_replace to target specifically the FS usage.

        // --- SCHEMATIC FILTERS ---
        Twig.extendFilter('number', (val: any) => {
            if (val === undefined || val === null) return '';
            // Basic Arabic number conversion for demo (not full map)
            return String(val);
        });

        const getCurrencySymbol = (code: string) => {
            const symbols: Record<string, string> = { 'SAR': 'ر.س', 'USD': '$', 'EUR': '€', 'GBP': '£' };
            return symbols[code] || code;
        };

        Twig.extendFilter('currency', (val: any) => {
            const store = this.storage.getStore();
            const currencyCode = store?.context?.store?.currency || 'SAR';
            const symbol = getCurrencySymbol(currencyCode);
            return currencyCode === 'SAR' ? `${val} ${symbol}` : `${symbol}${val}`;
        });

        Twig.extendFilter('money', (val: any) => {
            const store = this.storage.getStore();
            const currencyCode = store?.context?.store?.currency || 'SAR';
            const symbol = getCurrencySymbol(currencyCode);
            return currencyCode === 'SAR' ? `${val} ${symbol}` : `${symbol}${val}`;
        });

        Twig.extendFilter('snake_case', (val: string) => {
            return val?.replace(/\s+/g, '_').toLowerCase() || '';
        });

        Twig.extendFilter('camel_case', (val: string) => {
            return val?.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '') || '';
        });

        Twig.extendFilter('kabab_case', (val: string) => {
            return val?.replace(/\s+/g, '-').toLowerCase() || '';
        });

        Twig.extendFilter('time_ago', (val: any) => 'منذ وقت قصير');

        Twig.extendFilter('map', (arr: any[], callback: any) => {
            if (!Array.isArray(arr)) return [];
            if (typeof callback === 'function') {
                return arr.map(callback);
            }
            return arr;
        });

        Twig.extendFilter('asset', (value: any) => {
            const store = this.storage.getStore();
            const themeFolder = store?.themeFolder || 'current';
            return `/themes/${themeFolder}/public/${value}`;
        });
        Twig.extendFilter('cdn', (value: any) => value);
        Twig.extendFilter('trans', (value: any) => {
            const store = this.storage.getStore();
            const translations = (store?.translations || {}) as Record<string, string>;
            return translations[String(value)] || value;
        });

        (Twig as any).extendFunction('salla_url', (path: string) => `/${path}`);
        (Twig as any).extendFunction('is_page', (name: string) => {
            const store = this.storage.getStore();
            return store?.context?.page?.id === name;
        });
        (Twig as any).extendFunction('link', (val: string) => `/${val}`);

        (Twig as any).extendFunction('pluralize', (key: string, count: number) => {
            const store = this.storage.getStore();
            const translations = (store?.translations || {}) as Record<string, string>;
            const lang = store?.context?.store?.locale?.split('-')[0] || 'ar';

            // Basic Arabic pluralization logic (Zero, One, Two, 3-10, 11-99, 100+)
            if (lang === 'ar') {
                if (count === 0) return translations[`${key}.zero`] || translations[key] || key;
                if (count === 1) return translations[`${key}.one`] || translations[key] || key;
                if (count === 2) return translations[`${key}.two`] || translations[key] || key;
                if (count >= 3 && count <= 10) return translations[`${key}.few`] || translations[key] || key;
                return translations[`${key}.many`] || translations[key] || key;
            }

            const base = translations[key] || key;
            return `${count} ${base}`;
        });

        (Twig as any).extendFunction('is_link', (pattern: string) => {
            const store = this.storage.getStore();
            const pageId = store?.context?.page?.id || '';
            return pageId.includes(pattern);
        });

        (Twig as any).extendFunction('old', (key: string) => '');

        const renderComponent = (val: any) => {
            const store = this.storage.getStore();
            const viewsPath = store?.viewsPath;

            if (!viewsPath) {
                console.error('[Renderer] Component Error: No views path available');
                return '<!-- Error: No views path available -->';
            }

            const renderFile = (filePath: string, data: any = {}) => {
                const parts = filePath.split('.');
                const fullPath = path.join(viewsPath, 'components', ...parts) + '.twig';
                try {
                    if (this.fs.existsSync(fullPath)) {
                        let content = this.fs.readFileSync(fullPath, 'utf8');

                        // Preprocess component content for map filter and internal components
                        // Replace custom component tag with our unique one to avoid collisions
                        content = content.replace(/\{%\s*component\s+/g, '{% salla_component ');

                        // Improved regex to handle both 'something.products' and just 'products'
                        if (content.includes('|map(')) {
                            content = content.replace(/(\b[a-zA-Z0-9._]*products)\|\s*map\(.*?\)[\s|]*join\(.*?\)/g, (match, p1) => p1 + '.product_ids_mock_str');
                        }

                        const template = (Twig as any).twig({
                            data: content,
                            path: fullPath,
                            async: false
                        });
                        const out = template.render({
                            ...(this.storage.getStore()?.renderContext || {}),
                            component: data,
                            ...data
                        });
                        return out;
                    } else {
                        console.warn(`[Renderer] Component file NOT found: ${fullPath}`);
                        return `<!-- Component Not Found: ${filePath} -->`;
                    }
                } catch (e) {
                    console.error('[Renderer] Component Render Error: ' + filePath, e);
                    return `<!-- Component Render Error: ${filePath} -->`;
                }
            };

            if (typeof val === 'string') return renderFile(val);
            if (Array.isArray(val)) return val.map(item => renderFile(item.path || item.name, item.data || {})).join('\n');
            if (val && typeof val === 'object') return renderFile(val.path || val.name, val.data || {});
            return '';
        };

        const evaluateExpression = (expr: string, context: any): any => {
            const originalExpr = expr;
            expr = expr.trim();
            if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) return expr.slice(1, -1);
            if (expr === 'true') return true;
            if (expr === 'false') return false;
            if (!isNaN(Number(expr))) return Number(expr);

            const parts = expr.split('.');
            let value = context;

            if (parts[0] === 'home' && context['home'] !== undefined) {
                value = context['home'];
                if (parts.length === 1) return value;
                for (let i = 1; i < parts.length; i++) {
                    if (value && typeof value === 'object' && parts[i] in value) {
                        value = value[parts[i]];
                    } else {
                        return undefined;
                    }
                }
                return value;
            }

            for (const part of parts) {
                if (value && typeof value === 'object' && part in value) {
                    value = value[part];
                } else {
                    return undefined;
                }
            }
            return value;
        };

        (Twig as any).extendTag({
            type: 'hook',
            regex: /^hook\s+(.+)$/,
            next: [],
            open: true,
            compile: function (token: any) {
                token.expression = token.match[1].trim();
                delete token.match;
                return token;
            },
            parse: function (token: any, context: any, chain: any) {
                let hookName = '';
                try {
                    hookName = evaluateExpression(token.expression, context);
                } catch (e) {
                    hookName = 'error';
                }
                const hooks = (context.hooks || {}) as Record<string, string>;
                return { chain: chain, output: hooks[hookName] || '' };
            }
        });

        (Twig as any).extendTag({
            type: 'salla_component',
            regex: /^salla_component\s+(.+)$/,
            next: [],
            open: true,
            compile: function (token: any) {
                token.expression = token.match[1].trim();
                delete token.match;
                return token;
            },
            parse: function (token: any, context: any, chain: any) {
                let output = '';
                try {
                    const val = evaluateExpression(token.expression, context);
                    output = renderComponent(val);
                } catch (e) {
                    console.error('[Renderer] Component Tag Error:', e);
                }
                return { chain: chain, output: output };
            }
        });

        this.isInitialized = true;
    }

    public async renderPage(context: RuntimeContext, themeFolder: string): Promise<string> {
        const themePath = path.join(this.themesBaseDir, themeFolder);
        const viewsPath = path.join(themePath, 'src', 'views');
        let pageName = context.page.id;
        let templatePath = path.join(viewsPath, 'pages', `${pageName}.twig`);
        const twilightPath = path.join(themePath, 'twilight.json');

        // Salla standard: Home page can be home.twig or index.twig
        if ((pageName === 'home' || pageName === 'index') && !this.fs.existsSync(templatePath)) {
            const alternative = pageName === 'home' ? 'index' : 'home';
            const alternativePath = path.join(viewsPath, 'pages', `${alternative}.twig`);
            if (this.fs.existsSync(alternativePath)) {
                templatePath = alternativePath;
                pageName = alternative;
            }
        }

        try {
            const templateContent = await this.fs.readFile(templatePath, 'utf8');

            const isHomePage = context.page.id === 'index' || context.page.id === 'home';
            if (isHomePage && !(context as any)['home']) {
                try {
                    const twilightContent = await this.fs.readFile(twilightPath, 'utf8');
                    const twilight = JSON.parse(twilightContent);
                    if (twilight.components) {
                        (context as any)['home'] = twilight.components
                            .filter((c: any) => c.path && c.path.startsWith('home.'))
                            .map((c: any) => {
                                const data: any = {};
                                c.fields?.forEach((f: any) => {
                                    if (f.id) {
                                        let val = f.value;
                                        if (f.type === 'collection' && Array.isArray(val)) {
                                            val = val.map((item: any) => {
                                                const newItem: any = {};
                                                for (const key in item) {
                                                    const cleanKey = key.includes('.') ? key.split('.').pop() : key;
                                                    newItem[cleanKey!] = item[key];
                                                }
                                                return newItem;
                                            });
                                        }
                                        data[f.id] = val;
                                    }
                                });
                                const products = (c.path.includes('product') || c.path.includes('slider') || c.path.includes('banner'))
                                    ? (context as any).products
                                    : [];
                                return {
                                    path: c.path,
                                    name: c.path,
                                    data: {
                                        ...data,
                                        ...c,
                                        products: products,
                                        product_ids_mock: products.map((p: any) => p.id),
                                        product_ids_mock_str: products.map((p: any) => p.id).join(',')
                                    }
                                };
                            });
                    }
                    console.log(`[Renderer] Injected ${(context as any)['home'].length} home components.`);
                } catch (err) {
                    (context as any)['home'] = [];
                }
            }

            try {
                const lang = context.store?.locale?.split('-')[0] || 'ar';
                const localePath = path.join(themePath, 'src', 'locales', `${lang}.json`);
                if (this.fs.existsSync(localePath)) {
                    const localeContent = this.fs.readFileSync(localePath, 'utf8');
                    const localeJson = JSON.parse(localeContent);
                    const flattened = this.flattenObject(localeJson);
                    context.translations = { ...context.translations, ...flattened };
                }
            } catch (err) { }

            if (context.store) (context.store as any).url = 'http://localhost:3001';

            const renderContext = this.prepareRenderContext(context, themeFolder);
            if ((context as any)['home']) (renderContext as any)['home'] = (context as any)['home'];

            let processedContent = templateContent.replace(/\{%\s+(extends|include|import|from)\s+["'](.+?)["'](.*?)\s+%\}/g, (match: string, tag: string, p1: string, rest: string) => {
                let mapped = p1;
                if (mapped.includes('.') && !mapped.endsWith('.twig') && !mapped.endsWith('.js') && !mapped.endsWith('.css')) mapped = mapped.replace(/\./g, '/');
                if (!mapped.endsWith('.twig')) mapped += '.twig';
                if (!mapped.startsWith('.') && !mapped.startsWith('/')) {
                    const relativeToRoot = path.relative(path.dirname(templatePath), viewsPath);
                    if (relativeToRoot) mapped = path.join(relativeToRoot, mapped).replace(/\\/g, '/');
                }
                return `{% ${tag} "${mapped}"${rest} %}`;
            });

            // Replace custom component tag with our unique one to avoid collisions
            processedContent = processedContent.replace(/\{%\s*component\s+/g, '{% salla_component ');

            if (processedContent.includes('|map(')) {
                processedContent = processedContent.replace(/(\b[a-zA-Z0-9._]*products)\|\s*map\(.*?\)[\s|]*join\(.*?\)/g, (match: string, p1: string) => p1 + '.product_ids_mock_str');
            }

            return new Promise((resolve, reject) => {
                try {
                    const template = (Twig as any).twig({
                        id: `pages/${context.page.id}-${Date.now()}.twig`,
                        path: templatePath,
                        data: processedContent,
                        async: false,
                        base: viewsPath,
                        namespaces: {
                            'layouts': path.join(viewsPath, 'layouts'),
                            'pages': path.join(viewsPath, 'pages'),
                            'partials': path.join(viewsPath, 'partials')
                        },
                        rethrow: true
                    });

                    const storeData = {
                        translations: (context.translations || {}) as Record<string, string>,
                        themeFolder: themeFolder,
                        viewsPath: viewsPath,
                        context: context,
                        renderContext: renderContext
                    };

                    this.storage.run(storeData, () => {
                        console.log(`[Renderer] Starting render for ${context.page.id}...`);
                        let html = template.render(renderContext);
                        console.log(`[Renderer] Render complete. HTML length: ${html.length}`);

                        const regex = /(https?:\\?\/\\?\/)?store-[a-zA-Z0-9-]+\.salla\.sa/g;
                        html = html.replace(regex, (match: string) => match.includes('\\/') ? 'http:\\/\\/localhost:3001' : (match.startsWith('http') ? 'http://localhost:3001' : 'localhost:3001'));
                        const clearScript = '<script>try{localStorage.clear();sessionStorage.clear();}catch(e){}</script>';
                        html = html.replace('<head>', '<head>' + clearScript);
                        resolve(html);
                    });
                } catch (e) {
                    console.error('[Renderer] Twig Render Error:', e);
                    reject(e);
                }
            });
        } catch (error: any) {
            console.error('[Renderer] Global Error:', error);
            return `<div style="color: red; padding: 20px;"><h1>Renderer Error</h1><pre>${error.message}</pre></div>`;
        }
    }

    private prepareRenderContext(context: RuntimeContext, themeFolder: string) {
        const store = {
            ...context.store,
            api: 'http://localhost:3001/api/v1',
            url: `http://localhost:3001`,
            icon: 'https://cdn.salla.sa/images/logo/logo-dark-colored.png',
            avatar: 'https://cdn.salla.sa/images/logo/logo-dark-colored.png',
            logo: 'https://cdn.salla.sa/images/logo/logo-dark-colored.png',
            slogan: 'سوقك في جيبك',
            username: 'store_vtdr',
            contacts: { mobile: '966500000000', email: 'support@salla.sa', whatsapp: '966500000000' },
            social: { instagram: 'https://instagram.com/salla', twitter: 'https://twitter.com/salla' }
        };

        const theme = {
            ...context.theme,
            is_rtl: true,
            mode: 'preview',
            translations_hash: Date.now(),
            color: {
                primary: context.settings?.primary_color || '#004d41',
                text: '#FFFFFF',
                reverse_primary: '#FFFFFF',
                reverse_text: '#004d41',
                is_dark: false,
                darker: (alpha: number) => context.settings?.primary_color || '#00362e',
                lighter: (alpha: number) => context.settings?.primary_color || '#016c5b',
            },
            font: {
                name: 'DINNextLTArabic-Regular',
                path: 'https://cdn.salla.sa/fonts/din-next-lt-arabic.css',
                url: 'https://cdn.salla.sa/fonts/din-next-lt-arabic.css'
            },
            settings: {
                get: (key: string, def: any) => context.settings?.[key] ?? def,
                set: (key: string, val: any) => ''
            }
        };

        const user = {
            id: 'vtdr_guest_1', type: 'guest', is_authenticated: false, name: 'ضيف المحاكي',
            avatar: 'https://cdn.salla.sa/images/customer/placeholder.png',
            language: {
                code: context.store?.locale?.split('-')[0] || 'ar',
                dir: (context.store?.locale?.startsWith('ar') || !context.store?.locale) ? 'rtl' : 'ltr'
            },
            currency: {
                code: context.store?.currency || 'SAR',
                symbol: context.store?.currency === 'SAR' ? 'ر.س' : (context.store?.currency === 'USD' ? '$' : context.store?.currency || 'SAR')
            },
            can_access_wallet: false, points: 0
        };

        const sallaContext = {
            products: context.products || [],
            categories: context.categories || [],
            brands: context.brands || [],
            url: (pageId: string) => `/preview/${context.store.id}/${themeFolder}/${context.theme.version}?page=${pageId}`,
            trans: (key: string) => {
                const store = this.storage.getStore();
                const translations = (store?.translations || {}) as Record<string, string>;
                return translations[key] || key;
            },
            config: (key: string) => context.settings?.[key]
        };

        const sdkInitScript = `
            <script>window.vtdr_context = { storeId: ${JSON.stringify(context.store.id)}, pageId: ${JSON.stringify(context.page.id)} };</script>
            <script src="https://cdn.jsdelivr.net/npm/@salla.sa/twilight@latest/dist/@salla.sa/twilight.min.js"></script>
            <script src="/sdk-bridge.js"></script>
            <script>document.addEventListener('DOMContentLoaded', function() { if (window.salla) { salla.init({ store: ${JSON.stringify(store)}, user: ${JSON.stringify(user)}, theme: ${JSON.stringify(theme)} }); } });</script>
        `;

        return {
            ...context,
            salla: sallaContext,
            store,
            theme,
            user,
            settings: context.settings,
            hooks: { 'body:end': sdkInitScript },
            theme_url: (p: string) => `/themes/${themeFolder}/${p}`,
            asset: (p: string) => `/themes/${themeFolder}/public/${p}`,
        };
    }

    private flattenObject(obj: any, prefix = ''): Record<string, string> {
        return Object.keys(obj).reduce((acc: any, k: any) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
                Object.assign(acc, this.flattenObject(obj[k], pre + k));
            } else {
                acc[pre + k] = String(obj[k]);
            }
            return acc;
        }, {});
    }
}
