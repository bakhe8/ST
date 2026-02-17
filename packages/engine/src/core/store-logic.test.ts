import { describe, expect, it, vi } from 'vitest';
import { StoreLogic } from './store-logic.js';

describe('StoreLogic theme settings', () => {
    it('prefers themeSettingsJson over brandingJson', async () => {
        const storeRepo = {
            getById: vi.fn().mockResolvedValue({
                id: 'store-1',
                themeSettingsJson: JSON.stringify({ a: 1 }),
                brandingJson: JSON.stringify({ b: 2 })
            }),
            update: vi.fn()
        } as any;

        const dataEntityRepo = {} as any;
        const logic = new StoreLogic(storeRepo, dataEntityRepo);
        const result = await logic.getThemeSettings('store-1');

        expect(result).toEqual({ a: 1 });
    });

    it('falls back to brandingJson when themeSettingsJson is empty', async () => {
        const storeRepo = {
            getById: vi.fn().mockResolvedValue({
                id: 'store-2',
                themeSettingsJson: '{}',
                brandingJson: JSON.stringify({ legacy: true })
            }),
            update: vi.fn()
        } as any;

        const dataEntityRepo = {} as any;
        const logic = new StoreLogic(storeRepo, dataEntityRepo);
        const result = await logic.getThemeSettings('store-2');

        expect(result).toEqual({ legacy: true });
    });

    it('stores theme settings in themeSettingsJson', async () => {
        const update = vi.fn().mockResolvedValue({});
        const storeRepo = {
            getById: vi.fn(),
            update
        } as any;

        const dataEntityRepo = {} as any;
        const logic = new StoreLogic(storeRepo, dataEntityRepo);

        await logic.updateThemeSettings('store-3', { sticky_add_to_cart: true });

        expect(update).toHaveBeenCalledWith(
            'store-3',
            { themeSettingsJson: JSON.stringify({ sticky_add_to_cart: true }) },
            undefined
        );
    });
});

