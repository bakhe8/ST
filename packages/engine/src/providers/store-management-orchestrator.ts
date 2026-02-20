import { SeederService } from './seeder-service.js';
import { SynchronizationService } from './synchronization-service.js';
import { StoreFactory } from '../core/store-factory.js';
import { StoreLogic } from '../core/store-logic.js';
import { normalizeSeedProfile } from './seed-profiles.js';
import type { IThemeRepository } from '@vtdr/contracts';
import {
    SallaValidator,
    ThemeAnchorProbeReport,
    ThemeComponentCapabilityReport
} from '../validators/salla-validator.js';

type StoreActionResult<T> =
    | {
        ok: true;
        status: number;
        data: T;
    }
    | {
        ok: false;
        status: number;
        message: string;
    };

const asString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
};

const normalizeCreateStorePayload = (payload: any) => {
    const source = payload && typeof payload === 'object' ? payload : {};
    const autoSeed = source.autoSeed !== false;
    const normalizedSeedProfile = normalizeSeedProfile(source.seedProfile);

    return {
        ...source,
        autoSeed,
        seedProfile: normalizedSeedProfile
    };
};

type ThemeAdmissionDiagnostics = {
    mode: 'observe';
    overallStatus: 'pass' | 'warning' | 'fail';
    capability: Pick<ThemeComponentCapabilityReport, 'overallStatus' | 'missingCorePages'>;
    anchorProbe: Pick<ThemeAnchorProbeReport, 'overallStatus' | 'missingAnchorPoints'> | null;
};

const resolveCombinedAdmissionStatus = (
    capabilityStatus: 'pass' | 'warning' | 'fail',
    anchorStatus: 'pass' | 'warning' | 'fail'
): 'pass' | 'warning' | 'fail' => {
    if (capabilityStatus === 'fail' || anchorStatus === 'fail') return 'fail';
    if (capabilityStatus === 'warning' || anchorStatus === 'warning') return 'warning';
    return 'pass';
};

export class StoreManagementOrchestrator {
    constructor(
        private storeFactory: StoreFactory,
        private storeLogic: StoreLogic,
        private seeder: SeederService,
        private synchronizer: SynchronizationService,
        private themeRepo?: IThemeRepository,
        private sallaValidator?: SallaValidator
    ) { }

    public async listStores() {
        return this.storeFactory.listStores();
    }

    public async createStore(payload: any) {
        return this.storeFactory.createStore(normalizeCreateStorePayload(payload));
    }

    public async cloneStore(storeId: string): Promise<StoreActionResult<any>> {
        try {
            const clone = await this.storeFactory.cloneStore(storeId);
            return { ok: true, status: 200, data: clone };
        } catch (error: any) {
            return { ok: false, status: 500, message: error?.message || 'Clone failed' };
        }
    }

    public async updateStore(storeId: string, payload: any) {
        const admission = await this.validateThemeAdmission(storeId, payload);
        if (admission && !admission.ok) {
            const error: any = new Error(admission.message);
            error.status = admission.status;
            throw error;
        }
        const updatedStore = await this.storeFactory.updateStore(storeId, payload);
        if (admission && admission.ok && admission.data) {
            return {
                ...updatedStore,
                themeAdmission: admission.data
            };
        }
        return updatedStore;
    }

    public async promoteStore(storeId: string): Promise<StoreActionResult<any>> {
        try {
            const store = await this.storeLogic.promoteToMaster(storeId);
            return { ok: true, status: 200, data: store };
        } catch (error: any) {
            return { ok: false, status: 500, message: error?.message || 'Promote failed' };
        }
    }

    public async inheritStore(storeId: string, parentStoreId: unknown): Promise<StoreActionResult<any>> {
        try {
            const store = await this.storeLogic.inheritFrom(storeId, parentStoreId as string | null);
            return { ok: true, status: 200, data: store };
        } catch (error: any) {
            return { ok: false, status: 500, message: error?.message || 'Inherit failed' };
        }
    }

    public async updateSettings(storeId: string, settings: unknown): Promise<StoreActionResult<any>> {
        if (!settings) {
            return { ok: false, status: 400, message: 'Settings are required' };
        }
        try {
            const updated = await this.storeLogic.updateSettings(storeId, settings);
            return { ok: true, status: 200, data: updated };
        } catch {
            return { ok: false, status: 500, message: 'Failed to update settings' };
        }
    }

    public async seedStore(storeId: string, productCount: unknown, seedProfile: unknown): Promise<StoreActionResult<any>> {
        try {
            const count = Number(productCount) || 20;
            const result = await this.seeder.seedStoreData(storeId, count, undefined, {
                profile: normalizeSeedProfile(seedProfile)
            });
            return { ok: true, status: 200, data: result };
        } catch {
            return { ok: false, status: 500, message: 'Seeding failed' };
        }
    }

    public async syncStore(storeId: string, storeUrl: unknown): Promise<StoreActionResult<any>> {
        const normalizedStoreUrl = asString(storeUrl).trim();
        if (!normalizedStoreUrl) {
            return { ok: false, status: 400, message: 'storeUrl is required' };
        }
        try {
            const result = await this.synchronizer.syncStoreData(storeId, normalizedStoreUrl);
            return { ok: true, status: 200, data: result };
        } catch (error: any) {
            return { ok: false, status: 500, message: `Synchronization failed: ${error?.message || 'unknown'}` };
        }
    }

    public async clearStoreData(storeId: string): Promise<StoreActionResult<{ message: string }>> {
        try {
            await this.storeLogic.clearDataEntities(storeId);
            return { ok: true, status: 200, data: { message: 'Store data cleared' } };
        } catch {
            return { ok: false, status: 500, message: 'Failed to clear data' };
        }
    }

    public async deleteStore(storeId: string): Promise<StoreActionResult<{ message: string }>> {
        try {
            await this.storeFactory.deleteStore(storeId);
            return { ok: true, status: 200, data: { message: 'Store and all associated data deleted' } };
        } catch (error: any) {
            return { ok: false, status: 500, message: error?.message || 'Delete failed' };
        }
    }

    private async validateThemeAdmission(
        storeId: string,
        payload: any
    ): Promise<StoreActionResult<ThemeAdmissionDiagnostics> | null> {
        const source = payload && typeof payload === 'object' ? payload : {};
        const hasThemeMutation = Object.prototype.hasOwnProperty.call(source, 'themeId') ||
            Object.prototype.hasOwnProperty.call(source, 'themeVersionId');
        if (!hasThemeMutation) return null;
        if (!this.themeRepo || !this.sallaValidator) return null;

        const store = await this.storeLogic.getStore(storeId);
        if (!store) {
            return { ok: false, status: 404, message: 'Store not found' };
        }

        const themeId = asString(source.themeId).trim() || asString((store as any)?.themeId).trim();
        const themeVersionId = asString(source.themeVersionId).trim() || asString((store as any)?.themeVersionId).trim();

        if (!themeId || !themeVersionId) {
            return {
                ok: false,
                status: 400,
                message: 'themeId and themeVersionId are required for theme binding'
            };
        }

        const theme = await this.themeRepo.getById(themeId);
        if (!theme) {
            return { ok: false, status: 404, message: `Theme "${themeId}" not found` };
        }

        const versions = Array.isArray((theme as any)?.versions) ? (theme as any).versions : [];
        const selectedVersion = versions.find((version: any) =>
            asString(version?.id).trim() === themeVersionId
        ) || versions.find((version: any) =>
            asString(version?.version).trim() === themeVersionId
        );

        if (!selectedVersion) {
            return {
                ok: false,
                status: 404,
                message: `Theme version "${themeVersionId}" not found for theme "${themeId}"`
            };
        }

        const contractJson = asString(selectedVersion?.contractJson).trim();
        if (!contractJson) {
            return {
                ok: false,
                status: 422,
                message: `Theme "${themeId}" has empty runtime contract`
            };
        }

        let schema: any = null;
        try {
            schema = JSON.parse(contractJson);
        } catch {
            return {
                ok: false,
                status: 422,
                message: `Theme "${themeId}" has invalid runtime contract JSON`
            };
        }

        const capability = this.sallaValidator.evaluateThemeComponentCapability(schema);
        let anchorProbe: ThemeAnchorProbeReport | null = null;
        if (typeof (this.sallaValidator as any).evaluateThemeAnchorProbe === 'function') {
            try {
                const themeRootPath = asString(selectedVersion?.fsPath).trim();
                if (themeRootPath) {
                    anchorProbe = await this.sallaValidator.evaluateThemeAnchorProbe(themeRootPath, schema);
                }
            } catch (error) {
                console.warn('[ThemeAdmission] anchor probe failed (observe mode):', error);
            }
        }

        const anchorStatus = anchorProbe?.overallStatus || 'pass';
        const overallStatus = resolveCombinedAdmissionStatus(capability.overallStatus, anchorStatus);

        if (overallStatus !== 'pass') {
            console.warn('[ThemeAdmission][observe]', {
                storeId,
                themeId,
                themeVersionId: asString(selectedVersion?.id).trim() || asString(selectedVersion?.version).trim(),
                overallStatus,
                missingCorePages: capability.missingCorePages,
                missingAnchorPoints: anchorProbe?.missingAnchorPoints || []
            });
        }

        return {
            ok: true,
            status: 200,
            data: {
                mode: 'observe',
                overallStatus,
                capability: {
                    overallStatus: capability.overallStatus,
                    missingCorePages: capability.missingCorePages
                },
                anchorProbe: anchorProbe
                    ? {
                        overallStatus: anchorProbe.overallStatus,
                        missingAnchorPoints: anchorProbe.missingAnchorPoints
                    }
                    : null
            }
        };
    }
}
