import * as fs from 'fs';
import * as path from 'path';
import { IThemeFileProvider } from '@vtdr/engine/src/infra/theme-file-provider.interface.js';

export class LocalThemeFileProvider implements IThemeFileProvider {
    constructor(private themesBaseDir: string) { }

    async getThemeSettings(themeId: string): Promise<any> {
        const twilightPath = path.join(this.themesBaseDir, themeId, 'twilight.json');

        if (!fs.existsSync(twilightPath)) {
            console.error(`[LocalThemeFileProvider] twilight.json NOT FOUND at ${twilightPath}`);
            return null;
        }

        try {
            const content = fs.readFileSync(twilightPath, 'utf8');
            return JSON.parse(content);
        } catch (e) {
            console.error(`[LocalThemeFileProvider] Failed to parse twilight.json for ${themeId}:`, e);
            return null;
        }
    }

    async themeExists(themeId: string): Promise<boolean> {
        const themePath = path.join(this.themesBaseDir, themeId);
        return fs.existsSync(themePath);
    }
}
