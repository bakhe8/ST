import { Router, Response } from 'express';
import { SimulatorService, StoreLogic, WebhookService, HookService } from '@vtdr/engine';
import { StoreRequest } from '../middlewares/context.middleware.js';
import { fail, ok } from '../utils/api-response.js';

export function createSimulatorRoutes(
    simulatorService: SimulatorService,
    storeLogic: StoreLogic,
    webhookService: WebhookService,
    hookService: HookService
) {
    const router = Router();

    router.get('/cart', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getCart(req.storeId!);
        return res.status(response.status || 200).json(response);
    });

    router.post('/cart/items', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.addCartItem(req.storeId!, req.body);
        return res.status(response.status || 201).json(response);
    });

    router.patch('/cart/items/:itemId', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateCartItem(req.storeId!, req.params.itemId as string, req.body);
        if (!response) return fail(res, 404, 'Cart item not found');
        return res.status(response.status || 200).json(response);
    });

    router.delete('/cart/items/:itemId', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.deleteCartItem(req.storeId!, req.params.itemId as string);
        if (!response) return fail(res, 404, 'Cart item not found');
        return res.status(response.status || 200).json(response);
    });

    router.get('/products', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getProducts(req.storeId!);
        return res.status(response.status || 200).json(response);
    });

    router.get('/products/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getProduct(req.storeId!, req.params.id as string);
        if (!response) return fail(res, 404, 'Product not found');
        return res.status(response.status || 200).json(response);
    });

    router.post('/products', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.createProduct(req.storeId!, req.body);
        return res.status(response.status || 201).json(response);
    });

    router.put('/products/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateProduct(req.storeId!, req.params.id as string, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.delete('/products/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.deleteProduct(req.storeId!, req.params.id as string);
        return res.status(response.status || 200).json(response);
    });

    router.get('/brands', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getBrands(req.storeId!);
        return res.status(response.status || 200).json(response);
    });

    router.get('/brands/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getBrand(req.storeId!, req.params.id as string);
        if (!response) return fail(res, 404, 'Brand not found');
        return res.status(response.status || 200).json(response);
    });

    router.post('/brands', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.createBrand(req.storeId!, req.body);
        return res.status(response.status || 201).json(response);
    });

    router.put('/brands/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateBrand(req.storeId!, req.params.id as string, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.delete('/brands/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.deleteBrand(req.storeId!, req.params.id as string);
        return res.status(response.status || 200).json(response);
    });

    router.get('/categories', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getCategories(req.storeId!);
        return res.status(response.status || 200).json(response);
    });

    router.get('/categories/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getCategory(req.storeId!, req.params.id as string);
        if (!response) return fail(res, 404, 'Category not found');
        return res.status(response.status || 200).json(response);
    });

    router.post('/categories', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.createCategory(req.storeId!, req.body);
        return res.status(response.status || 201).json(response);
    });

    router.put('/categories/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateCategory(req.storeId!, req.params.id as string, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.delete('/categories/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.deleteCategory(req.storeId!, req.params.id as string);
        return res.status(response.status || 200).json(response);
    });

    router.get('/offers', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getOffers(req.storeId!);
        return res.status(response.status || 200).json(response);
    });

    router.get('/offers/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getOffer(req.storeId!, req.params.id as string);
        if (!response) return fail(res, 404, 'Offer not found');
        return res.status(response.status || 200).json(response);
    });

    router.post('/offers', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.createOffer(req.storeId!, req.body);
        return res.status(response.status || 201).json(response);
    });

    router.put('/offers/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateOffer(req.storeId!, req.params.id as string, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.delete('/offers/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.deleteOffer(req.storeId!, req.params.id as string);
        return res.status(response.status || 200).json(response);
    });

    router.get('/static-pages', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getStaticPages(req.storeId!);
        return res.status(response.status || 200).json(response);
    });

    router.get('/blog/categories', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getBlogCategories(req.storeId!);
        return res.status(response.status || 200).json(response);
    });

    router.get('/blog/categories/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getBlogCategory(req.storeId!, req.params.id as string);
        if (!response) return fail(res, 404, 'Blog category not found');
        return res.status(response.status || 200).json(response);
    });

    router.post('/blog/categories', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.createBlogCategory(req.storeId!, req.body);
        return res.status(response.status || 201).json(response);
    });

    router.put('/blog/categories/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateBlogCategory(req.storeId!, req.params.id as string, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.delete('/blog/categories/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.deleteBlogCategory(req.storeId!, req.params.id as string);
        return res.status(response.status || 200).json(response);
    });

    router.get('/blog/articles', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getBlogArticles(req.storeId!);
        return res.status(response.status || 200).json(response);
    });

    router.get('/blog/articles/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getBlogArticle(req.storeId!, req.params.id as string);
        if (!response) return fail(res, 404, 'Blog article not found');
        return res.status(response.status || 200).json(response);
    });

    router.post('/blog/articles', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.createBlogArticle(req.storeId!, req.body);
        return res.status(response.status || 201).json(response);
    });

    router.put('/blog/articles/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateBlogArticle(req.storeId!, req.params.id as string, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.delete('/blog/articles/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.deleteBlogArticle(req.storeId!, req.params.id as string);
        return res.status(response.status || 200).json(response);
    });

    router.post('/static-pages', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.createStaticPage(req.storeId!, req.body);
        return res.status(response.status || 201).json(response);
    });

    router.put('/static-pages/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateStaticPage(req.storeId!, req.params.id as string, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.delete('/static-pages/:id', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.deleteStaticPage(req.storeId!, req.params.id as string);
        return res.status(response.status || 200).json(response);
    });

    router.get('/menus/:type', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getMenus(req.storeId!, req.params.type as string);
        return res.status(response.status || 200).json(response);
    });

    router.put('/menus/:type', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateMenus(req.storeId!, req.params.type as string, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.get('/theme/settings', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getThemeSettings(req.storeId!);
        if (!response) return fail(res, 404, 'Theme settings not found');
        return res.status(response.status || 200).json(response);
    });

    router.get('/theme/components', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.getThemeComponents(req.storeId!);
        if (!response) return fail(res, 404, 'Theme components not found');
        return res.status(response.status || 200).json(response);
    });

    router.put('/theme/settings', async (req: StoreRequest, res: Response) => {
        const response = await simulatorService.updateThemeSettings(req.storeId!, req.body);
        return res.status(response.status || 200).json(response);
    });

    router.post('/auth/login', async (req: StoreRequest, res: Response) => {
        const storeId = req.storeId;
        if (storeId) {
            const webhooks = await storeLogic.getWebhooks(storeId);
            const customer = {
                id: 'cust_123',
                first_name: 'Mock',
                last_name: 'Customer',
                email: req.body.email || 'user@example.com',
                mobile: req.body.mobile || '+966500000000'
            };
            webhookService.dispatchEvent('customer.login', { customer }, webhooks);
        }
        return ok(res, null, 200, { message: 'Mock login code sent' });
    });

    return router;
}
