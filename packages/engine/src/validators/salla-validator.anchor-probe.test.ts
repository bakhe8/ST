import { afterEach, describe, expect, it } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import type { TwilightSchema } from '@vtdr/contracts';
import { SallaValidator } from './salla-validator.js';

const tempRoots: string[] = [];

const makeThemeDir = async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'vtdr-anchor-probe-'));
    tempRoots.push(root);
    await fs.mkdir(path.join(root, 'src', 'views', 'pages'), { recursive: true });
    await fs.mkdir(path.join(root, 'src', 'views', 'layouts'), { recursive: true });
    await fs.writeFile(path.join(root, 'src', 'views', 'layouts', 'master.twig'), '<main>{% block content %}{% endblock %}</main>', 'utf8');
    return root;
};

afterEach(async () => {
    while (tempRoots.length > 0) {
        const root = tempRoots.pop()!;
        await fs.rm(root, { recursive: true, force: true });
    }
});

describe('SallaValidator.evaluateThemeAnchorProbe', () => {
    it('returns pass when declared components are covered by matching page anchors', async () => {
        const root = await makeThemeDir();
        await fs.writeFile(
            path.join(root, 'src', 'views', 'pages', 'index.twig'),
            '{% salla_component home %}',
            'utf8'
        );

        const schema = {
            components: [{ key: 'home-hero', path: 'home.enhanced-slider' }]
        } as TwilightSchema;

        const validator = new SallaValidator();
        const report = await validator.evaluateThemeAnchorProbe(root, schema);

        expect(report.overallStatus).toBe('pass');
        expect(report.summary.declaredComponents).toBe(1);
        expect(report.summary.renderedComponents).toBe(1);
        expect(report.summary.missingAnchorPoints).toBe(0);
    });

    it('returns fail when a core page component has no matching anchor', async () => {
        const root = await makeThemeDir();
        await fs.writeFile(
            path.join(root, 'src', 'views', 'pages', 'index.twig'),
            '<section>No anchors</section>',
            'utf8'
        );

        const schema = {
            components: [{ key: 'home-hero', path: 'home.enhanced-slider' }]
        } as TwilightSchema;

        const validator = new SallaValidator();
        const report = await validator.evaluateThemeAnchorProbe(root, schema);

        expect(report.overallStatus).toBe('fail');
        expect(report.missingAnchorPoints).toContain('home.enhanced-slider');
    });

    it('returns warning when only non-core page anchors are missing', async () => {
        const root = await makeThemeDir();
        await fs.mkdir(path.join(root, 'src', 'views', 'pages', 'product'), { recursive: true });
        await fs.writeFile(
            path.join(root, 'src', 'views', 'pages', 'product', 'single.twig'),
            '<section>Product page without outlet</section>',
            'utf8'
        );

        const schema = {
            components: [{ key: 'product-offer', path: 'product.single.offer' }]
        } as TwilightSchema;

        const validator = new SallaValidator();
        const report = await validator.evaluateThemeAnchorProbe(root, schema);

        expect(report.overallStatus).toBe('warning');
        expect(report.missingAnchorPoints).toContain('product.single.offer');
    });
});
