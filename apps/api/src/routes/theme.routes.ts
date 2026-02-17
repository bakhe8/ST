import { Router } from 'express';
import { ThemeRegistry, ThemeLoader, SallaValidator } from '@vtdr/engine';
import path from 'path';
import { ok, fail } from '../utils/api-response.js';

export function createThemeRoutes(
    themeRegistry: ThemeRegistry,
    themeLoader: ThemeLoader,
    sallaValidator: SallaValidator,
    themesBaseDir: string
) {
    const router = Router();

    router.get('/', async (req, res) => {
        const themes = await themeRegistry.listThemes();
        return ok(res, themes);
    });

    router.post('/discover', async (req, res) => {
        const localFolders = await themeLoader.scanThemes();
        const registeredThemes = await themeRegistry.listThemes();
        const registeredIds = new Set(registeredThemes.map(t => t.id));

        const discovery = await Promise.all(localFolders.map(async folder => {
            const schema = await themeLoader.loadTwilightSchema(folder);
            if (!schema) return null;

            const metadata = themeLoader.extractMetadata(folder, schema);
            const themePath = path.join(themesBaseDir, folder);
            const compatibility = await sallaValidator.validateTheme(themePath, schema);

            return {
                ...metadata,
                folder,
                isRegistered: registeredIds.has(folder),
                compatibility
            };
        }));

        return ok(res, discovery.filter(d => d !== null));
    });

    router.post('/register', async (req, res) => {
        const { folder } = req.body;
        if (!folder) return fail(res, 400, 'Folder name is required');

        const schema = await themeLoader.loadTwilightSchema(folder);
        if (!schema) return fail(res, 404, 'Theme schema not found');

        const metadata = themeLoader.extractMetadata(folder, schema);
        const theme = await themeRegistry.syncTheme(metadata, schema, path.join(themesBaseDir, folder));

        return ok(res, theme);
    });

    router.post('/sync', async (req, res) => {
        try {
            const localFolders = await themeLoader.scanThemes();
            let syncedCount = 0;

            for (const folder of localFolders) {
                const schema = await themeLoader.loadTwilightSchema(folder);
                if (!schema) continue;

                const metadata = themeLoader.extractMetadata(folder, schema);
                await themeRegistry.syncTheme(metadata, schema, path.join(themesBaseDir, folder));
                syncedCount++;
            }
            return ok(res, { synced: syncedCount });
        } catch (error: any) {
            return fail(res, 500, error.message);
        }
    });

    return router;
}
