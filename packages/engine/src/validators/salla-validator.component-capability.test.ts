import { describe, expect, it } from 'vitest';
import { SallaValidator } from './salla-validator.js';
import type { TwilightSchema } from '@vtdr/contracts';

describe('SallaValidator.evaluateThemeComponentCapability', () => {
    it('returns warning when core pages are missing', () => {
        const validator = new SallaValidator();
        const schema = {
            components: [
                { key: 'hero', path: 'home.enhanced-slider' },
                { key: 'links', path: 'home.main-links' }
            ]
        } as TwilightSchema;

        const report = validator.evaluateThemeComponentCapability(schema);
        expect(report.overallStatus).toBe('warning');
        expect(report.supportedPageIds).toContain('home');
        expect(report.missingCorePages).toContain('product-list');
        expect(report.summary.totalComponents).toBe(2);
    });

    it('returns pass when core storefront pages are covered', () => {
        const validator = new SallaValidator();
        const schema = {
            components: [
                { key: 'home-hero', path: 'home.enhanced-slider' },
                { key: 'product-grid', path: 'product.index-grid' },
                { key: 'category-hero', path: 'category.banner' },
                { key: 'brands-grid', path: 'brands.carousel' },
                { key: 'blog-list', path: 'blog.index-list' }
            ]
        } as TwilightSchema;

        const report = validator.evaluateThemeComponentCapability(schema);
        expect(report.overallStatus).toBe('pass');
        expect(report.missingCorePages).toHaveLength(0);
        expect(report.summary.coveredCorePages).toBe(report.summary.corePages);
    });
});
