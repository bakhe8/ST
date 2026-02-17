import { Router } from 'express';
import { ok } from '../utils/api-response.js';

export function createSystemRoutes(themesBaseDir: string) {
    const router = Router();

    router.get('/info', (req, res) => {
        return ok(res, {
            version: '1.0.0',
            environment: 'development',
            activeRuntime: true
        });
    });

    router.get('/status', (req, res) => {
        return ok(res, { name: 'VTDR API', status: 'active', themesPath: themesBaseDir });
    });

    return router;
}
