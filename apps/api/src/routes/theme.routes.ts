import { Router } from 'express';
import { ThemeManagementOrchestrator } from '@vtdr/engine';
import { fail, ok } from '../utils/api-response.js';

export function createThemeRoutes(themeManagementOrchestrator: ThemeManagementOrchestrator) {
    const router = Router();

    router.get('/', async (_req, res) => {
        const themes = await themeManagementOrchestrator.listThemes();
        return ok(res, themes);
    });

    router.post('/discover', async (_req, res) => {
        const discovery = await themeManagementOrchestrator.discoverThemes();
        return ok(res, discovery);
    });

    router.post('/register', async (req, res) => {
        const result = await themeManagementOrchestrator.registerTheme(req.body?.folder);
        if (!result.ok) return fail(res, result.status, result.message);
        return ok(res, result.data);
    });

    router.post('/sync', async (_req, res) => {
        const result = await themeManagementOrchestrator.syncThemes();
        if (!result.ok) return fail(res, result.status, result.message);
        return ok(res, result.data);
    });

    return router;
}
