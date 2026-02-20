import type { RuntimeContext } from '@vtdr/contracts';
import { StoreLogic } from '../core/store-logic.js';
import { RendererService } from './renderer-service.js';
import type { ResolvedPreviewTarget } from './preview-context-service.js';

type EntityRecord = Record<string, unknown>;

const asString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
};

const isRenderError = (html: string): boolean => {
    return html.includes('Renderer Error') || html.includes('Render Error') || html.includes('Twig Render Error');
};

export const hydratePreviewEntities = async (input: {
    storeId: string;
    context: RuntimeContext;
    storeLogic: StoreLogic;
}) => {
    const [cartEntity, orderEntities, checkoutEntity] = await Promise.all([
        input.storeLogic.getDataEntity(input.storeId, 'cart', 'default'),
        input.storeLogic.getDataEntities(input.storeId, 'order'),
        input.storeLogic.getDataEntity(input.storeId, 'checkout_session', 'default')
    ]);

    if (cartEntity && typeof cartEntity === 'object') {
        (input.context as any).cart = cartEntity;
    }
    if (Array.isArray(orderEntities)) {
        (input.context as any).orders = orderEntities;
    }
    if (checkoutEntity && typeof checkoutEntity === 'object') {
        (input.context as any).checkout = checkoutEntity;
    }
};

export const renderPreviewWithFallback = async (input: {
    renderer: RendererService;
    context: RuntimeContext;
    themeId: string;
    target: ResolvedPreviewTarget;
}) => {
    const { renderer, context, themeId, target } = input;
    let html = await renderer.renderPage(context, themeId);

    // Fallback: If 'home' is not available in a theme, retry with 'index'.
    if ((target.pageId === 'home' || target.pageId === 'index') && html.includes('Render Error') && html.includes('home.twig')) {
        context.page.id = 'index';
        (context.page as EntityRecord).template_id = 'index';
        html = await renderer.renderPage(context, themeId);
    }

    if (isRenderError(html) && target.pageId !== 'page-single') {
        const mutablePage = context.page as EntityRecord;
        mutablePage.id = asString(mutablePage.id) || 'page-single';
        mutablePage.template_id = 'page-single';
        mutablePage.title = asString(mutablePage.title) || 'صفحة غير مدعومة بعد';
        mutablePage.slug = asString(mutablePage.slug) || 'page-single';
        mutablePage.url = target.routePath || '/';
        mutablePage.content = `
            <div style="padding:16px 0;line-height:1.8">
                <p>المسار المطلوب في المعاينة: <code>${target.routePath || '/'}</code></p>
                <p>هذه الصفحة لم تُربط بقالب كامل بعد داخل VTDR، وتم عرض صفحة عامة بدلًا منها للحفاظ على استمرار التصفح.</p>
            </div>
        `;
        html = await renderer.renderPage(context, themeId);
    }

    return html;
};
