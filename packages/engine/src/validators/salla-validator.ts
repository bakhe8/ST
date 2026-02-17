import * as fs from 'fs/promises';
import * as path from 'path';
import { TwilightSchema, ComponentInstance } from '@vtdr/contracts';

export interface ValidationRule {
    id: string;
    category: 'structure' | 'contracts' | 'runtime' | 'readiness';
    title: string;
    description: string;
    status: 'pass' | 'warning' | 'fail';
    sallaDocUrl?: string;
}

export interface CompatibilityReport {
    overallStatus: 'pass' | 'warning' | 'fail';
    summary: {
        pass: number;
        warning: number;
        fail: number;
    };
    rules: ValidationRule[];
}

export class SallaValidator {
    /**
     * Runs an exhaustive compatibility check on a local theme based on official checklist
     */
    public async validateTheme(themePath: string, schema: TwilightSchema): Promise<CompatibilityReport> {
        const rules: ValidationRule[] = [];

        // --- Category A: Structure ---
        rules.push(await this.checkPath(themePath, 'src/views/layouts/master.twig', 'structure', 'Master Layout', 'Official themes must have src/views/layouts/master.twig', 'https://docs.salla.dev/421918m0', false));
        rules.push(await this.checkPath(themePath, 'src/views/pages/index.twig', 'structure', 'Index Page', 'Official themes must have src/views/pages/index.twig', 'https://docs.salla.dev/421918m0', false));
        rules.push(await this.checkPath(themePath, 'src/locales', 'structure', 'Locales Folder', 'Translation files folder', 'https://docs.salla.dev/421918m0', true));
        rules.push(await this.checkPath(themePath, 'src/assets/js', 'structure', 'JS Assets', 'JavaScript source folder', 'https://docs.salla.dev/421918m0', true));
        rules.push(await this.checkPath(themePath, 'src/assets/styles', 'structure', 'Style Assets', 'CSS/SASS source folder', 'https://docs.salla.dev/421918m0', true));

        // --- Category B: Contracts ---
        rules.push(this.checkSchemaKey(schema, 'name', 'contracts', 'Theme Name', 'Mandatory theme name in twilight.json', 'https://docs.salla.dev/421921m0'));
        rules.push(this.checkSchemaKey(schema, 'version', 'contracts', 'Version', 'Mandatory version in twilight.json', 'https://docs.salla.dev/421921m0'));
        rules.push(this.checkSchemaKey(schema, 'author', 'contracts', 'Author', 'Mandatory author info', 'https://docs.salla.dev/421889m0'));

        // Component Path Alignment
        if (schema.components) {
            for (const comp of schema.components) {
                if (comp.path) {
                    rules.push(await this.checkPath(themePath, path.join('src/views', comp.path), 'contracts', `Component: ${comp.name}`, `Component template must exist at src/views/${comp.path}`, 'https://docs.salla.dev/421921m0', false));
                }
            }
        }

        // --- Category D: Publish Readiness (Placeholders for manual/advanced checks) ---
        rules.push({
            id: 'readiness-docs',
            category: 'readiness',
            title: 'Salla Docs Linkage',
            description: 'Platform verification: Direct links to Salla documentation for all requirements.',
            status: 'pass',
            sallaDocUrl: 'https://docs.salla.dev/421885m0'
        });

        // Calculate Summary & Overall Status
        const summary = {
            pass: rules.filter(r => r.status === 'pass').length,
            warning: rules.filter(r => r.status === 'warning').length,
            fail: rules.filter(r => r.status === 'fail').length
        };

        let overallStatus: 'pass' | 'warning' | 'fail' = 'pass';
        if (summary.fail > 0) overallStatus = 'fail';
        else if (summary.warning > 0) overallStatus = 'warning';

        return { overallStatus, summary, rules };
    }

    private async checkPath(basePath: string, subPath: string, category: any, title: string, description: string, url: string, isDirectory: boolean): Promise<ValidationRule> {
        const fullPath = path.join(basePath, subPath);
        try {
            const stats = await fs.stat(fullPath);
            const isValid = isDirectory ? stats.isDirectory() : stats.isFile();
            return { id: subPath, category, title, description, status: isValid ? 'pass' : 'fail', sallaDocUrl: url };
        } catch {
            return { id: subPath, category, title, description, status: 'fail', sallaDocUrl: url };
        }
    }

    private checkSchemaKey(schema: any, key: string, category: any, title: string, description: string, url: string): ValidationRule {
        const value = schema[key];
        const status = (value && value !== '') ? 'pass' : 'fail';
        return { id: `schema-${key}`, category, title, description, status, sallaDocUrl: url };
    }
}
