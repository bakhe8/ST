import { Router, Response } from 'express';
import { SimulatorAuthOrchestrator, SimulatorService } from '@vtdr/engine';
import { StoreRequest } from '../middlewares/context.middleware.js';
import { fail, ok } from '../utils/api-response.js';

type ServiceResponse = { status?: number } | null | undefined;
type RouteHandler = (req: StoreRequest) => Promise<ServiceResponse>;

const sendResponse = (res: Response, response: ServiceResponse, fallbackStatus = 200) => {
    return res.status((response as any)?.status || fallbackStatus).json(response);
};

const route = (handler: RouteHandler, fallbackStatus = 200) => {
    return async (req: StoreRequest, res: Response) => {
        const response = await handler(req);
        return sendResponse(res, response, fallbackStatus);
    };
};

const routeOr404 = (handler: RouteHandler, notFoundMessage: string, fallbackStatus = 200) => {
    return async (req: StoreRequest, res: Response) => {
        const response = await handler(req);
        if (!response) return fail(res, 404, notFoundMessage);
        return sendResponse(res, response, fallbackStatus);
    };
};

const storeId = (req: StoreRequest) => req.storeId!;

export function createSimulatorRoutes(
    simulatorService: SimulatorService,
    simulatorAuthOrchestrator: SimulatorAuthOrchestrator
) {
    const router = Router();

    router.get('/cart', route((req) => simulatorService.getCart(storeId(req))));
    router.post('/cart/items', route((req) => simulatorService.addCartItem(storeId(req), req.body), 201));
    router.patch('/cart/items/:itemId', routeOr404(
        (req) => simulatorService.updateCartItem(storeId(req), req.params.itemId as string, req.body),
        'Cart item not found'
    ));
    router.delete('/cart/items/:itemId', routeOr404(
        (req) => simulatorService.deleteCartItem(storeId(req), req.params.itemId as string),
        'Cart item not found'
    ));
    router.post('/cart/coupon', route((req) => simulatorService.addCartCoupon(
        storeId(req),
        String(req.body?.coupon || req.body?.code || '')
    )));
    router.delete('/cart/coupon', route((req) => simulatorService.deleteCartCoupon(storeId(req))));
    router.post('/cart/submit', route((req) => simulatorService.submitCart(storeId(req))));

    router.get('/wishlist', route((req) => simulatorService.getWishlist(storeId(req))));
    router.post('/wishlist/items', route((req) => simulatorService.addWishlistItem(storeId(req), req.body || {}), 201));
    router.delete('/wishlist/items/:itemId', route((req) => simulatorService.deleteWishlistItem(storeId(req), req.params.itemId as string)));
    router.post('/wishlist/toggle', route((req) => simulatorService.toggleWishlistItem(storeId(req), req.body || {})));

    router.get('/checkout', route((req) => simulatorService.getCheckoutSession(storeId(req))));
    router.post('/checkout/start', route((req) => simulatorService.startCheckoutSession(storeId(req), req.body || {})));
    router.patch('/checkout/address', route((req) => simulatorService.updateCheckoutAddress(storeId(req), req.body || {})));
    router.patch('/checkout/shipping', route((req) => simulatorService.updateCheckoutShipping(storeId(req), req.body || {})));
    router.patch('/checkout/payment', route((req) => simulatorService.updateCheckoutPayment(storeId(req), req.body || {})));
    router.post('/checkout/confirm', route((req) => simulatorService.confirmCheckout(storeId(req), req.body || {})));

    router.get('/products', route((req) => simulatorService.getProducts(storeId(req), req.query as any)));
    router.get('/products/:id', routeOr404(
        (req) => simulatorService.getProduct(storeId(req), req.params.id as string),
        'Product not found'
    ));
    router.post('/products', route((req) => simulatorService.createProduct(storeId(req), req.body), 201));
    router.put('/products/:id', route((req) => simulatorService.updateProduct(storeId(req), req.params.id as string, req.body)));
    router.delete('/products/:id', route((req) => simulatorService.deleteProduct(storeId(req), req.params.id as string)));

    router.get('/brands', route((req) => simulatorService.getBrands(storeId(req))));
    router.get('/brands/:id', routeOr404(
        (req) => simulatorService.getBrand(storeId(req), req.params.id as string),
        'Brand not found'
    ));
    router.post('/brands', route((req) => simulatorService.createBrand(storeId(req), req.body), 201));
    router.put('/brands/:id', route((req) => simulatorService.updateBrand(storeId(req), req.params.id as string, req.body)));
    router.delete('/brands/:id', route((req) => simulatorService.deleteBrand(storeId(req), req.params.id as string)));

    router.get('/categories', route((req) => simulatorService.getCategories(storeId(req))));
    router.get('/categories/:id', routeOr404(
        (req) => simulatorService.getCategory(storeId(req), req.params.id as string),
        'Category not found'
    ));
    router.post('/categories', route((req) => simulatorService.createCategory(storeId(req), req.body), 201));
    router.put('/categories/:id', route((req) => simulatorService.updateCategory(storeId(req), req.params.id as string, req.body)));
    router.delete('/categories/:id', route((req) => simulatorService.deleteCategory(storeId(req), req.params.id as string)));

    router.get('/offers', route((req) => simulatorService.getOffers(storeId(req))));
    router.get('/offers/:id', routeOr404(
        (req) => simulatorService.getOffer(storeId(req), req.params.id as string),
        'Offer not found'
    ));
    router.post('/offers', route((req) => simulatorService.createOffer(storeId(req), req.body), 201));
    router.put('/offers/:id', route((req) => simulatorService.updateOffer(storeId(req), req.params.id as string, req.body)));
    router.delete('/offers/:id', route((req) => simulatorService.deleteOffer(storeId(req), req.params.id as string)));

    router.get('/reviews', route((req) => simulatorService.getReviews(storeId(req), String(req.query.product_id || ''))));
    router.get('/products/:id/reviews', route((req) => simulatorService.getReviews(storeId(req), req.params.id as string)));
    router.get('/reviews/:id', routeOr404(
        (req) => simulatorService.getReview(storeId(req), req.params.id as string),
        'Review not found'
    ));
    router.post('/reviews', route((req) => simulatorService.createReview(storeId(req), req.body), 201));
    router.put('/reviews/:id', routeOr404(
        (req) => simulatorService.updateReview(storeId(req), req.params.id as string, req.body),
        'Review not found'
    ));
    router.delete('/reviews/:id', route((req) => simulatorService.deleteReview(storeId(req), req.params.id as string)));

    router.get('/questions', route((req) => simulatorService.getQuestions(storeId(req), String(req.query.product_id || ''))));
    router.get('/products/:id/questions', route((req) => simulatorService.getQuestions(storeId(req), req.params.id as string)));
    router.get('/questions/:id', routeOr404(
        (req) => simulatorService.getQuestion(storeId(req), req.params.id as string),
        'Question not found'
    ));
    router.post('/questions', route((req) => simulatorService.createQuestion(storeId(req), req.body), 201));
    router.put('/questions/:id', routeOr404(
        (req) => simulatorService.updateQuestion(storeId(req), req.params.id as string, req.body),
        'Question not found'
    ));
    router.delete('/questions/:id', route((req) => simulatorService.deleteQuestion(storeId(req), req.params.id as string)));

    router.get('/static-pages', route((req) => simulatorService.getStaticPages(storeId(req))));
    router.get('/pages', route((req) => simulatorService.getStaticPages(storeId(req))));
    router.get('/pages/:id', routeOr404(
        async (req) => {
            const pagesResponse: any = await simulatorService.getStaticPages(storeId(req));
            const pages = Array.isArray(pagesResponse?.data) ? pagesResponse.data : [];
            const rawId = String(req.params.id || '').trim().toLowerCase();
            const found = pages.find((page: any) => {
                const id = String(page?.id || '').trim().toLowerCase();
                const slug = String(page?.slug || '').trim().toLowerCase();
                const urlTail = String(page?.url || '').split('/').filter(Boolean).pop()?.toLowerCase() || '';
                return rawId === id || rawId === slug || rawId === urlTail;
            });
            if (!found) return null;
            return { status: 200, success: true, data: found };
        },
        'Page not found'
    ));
    router.post('/static-pages', route((req) => simulatorService.createStaticPage(storeId(req), req.body), 201));
    router.put('/static-pages/:id', route((req) => simulatorService.updateStaticPage(storeId(req), req.params.id as string, req.body)));
    router.delete('/static-pages/:id', route((req) => simulatorService.deleteStaticPage(storeId(req), req.params.id as string)));

    router.get('/blog/categories', route((req) => simulatorService.getBlogCategories(storeId(req))));
    router.get('/blog/categories/:id', routeOr404(
        (req) => simulatorService.getBlogCategory(storeId(req), req.params.id as string),
        'Blog category not found'
    ));
    router.post('/blog/categories', route((req) => simulatorService.createBlogCategory(storeId(req), req.body), 201));
    router.put('/blog/categories/:id', route((req) => simulatorService.updateBlogCategory(storeId(req), req.params.id as string, req.body)));
    router.delete('/blog/categories/:id', route((req) => simulatorService.deleteBlogCategory(storeId(req), req.params.id as string)));

    router.get('/blog/articles', route((req) => simulatorService.getBlogArticles(storeId(req), req.query as any)));
    router.get('/blog/articles/:id', routeOr404(
        (req) => simulatorService.getBlogArticle(storeId(req), req.params.id as string),
        'Blog article not found'
    ));
    router.post('/blog/articles', route((req) => simulatorService.createBlogArticle(storeId(req), req.body), 201));
    router.put('/blog/articles/:id', route((req) => simulatorService.updateBlogArticle(storeId(req), req.params.id as string, req.body)));
    router.delete('/blog/articles/:id', route((req) => simulatorService.deleteBlogArticle(storeId(req), req.params.id as string)));

    router.get('/menus/:type', route((req) => simulatorService.getMenus(storeId(req), req.params.type as string)));
    router.get('/footer', route((req) => simulatorService.getMenus(storeId(req), 'footer')));
    router.put('/menus/:type', route((req) => simulatorService.updateMenus(storeId(req), req.params.type as string, req.body)));

    router.get('/theme/settings', routeOr404(
        (req) => simulatorService.getThemeSettings(storeId(req)),
        'Theme settings not found'
    ));
    router.get('/theme/components', routeOr404(
        (req) => simulatorService.getThemeComponents(storeId(req)),
        'Theme components not found'
    ));
    router.put('/theme/settings', route((req) => simulatorService.updateThemeSettings(storeId(req), req.body)));

    router.post('/orders/send-invoice', route((req) => simulatorService.sendOrderInvoice(storeId(req), req.body || {})));
    router.get('/orders', route((req) => simulatorService.getOrders(storeId(req), req.query as any)));
    router.get('/orders/:id', routeOr404(
        (req) => simulatorService.getOrder(storeId(req), req.params.id as string),
        'Order not found'
    ));

    router.get('/notifications', route((req) => simulatorService.getNotifications(storeId(req), req.query as any)));

    router.post('/auth/login', async (req: StoreRequest, res: Response) => {
        await simulatorAuthOrchestrator.dispatchMockLogin(req.storeId, req.body || {});
        return ok(res, null, 200, { message: 'Mock login code sent' });
    });

    return router;
}
