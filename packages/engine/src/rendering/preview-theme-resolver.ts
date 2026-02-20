type ThemeVersionLike = {
    id?: string;
    version?: string;
    contractJson?: string;
};

type ThemeRecordLike = {
    id?: string;
    versions?: ThemeVersionLike[];
};

type StoreLike = {
    themeId?: string;
    themeVersionId?: string;
};

export type PreviewThemeResolution =
    | {
        ok: true;
        themeId: string;
        themeVersionId: string;
        themeVersion: string;
        source: 'request' | 'store';
    }
    | {
        ok: false;
        status: number;
        message: string;
    };

const normalize = (value: unknown): string => String(value || '').trim();

const toVersion = (entry: ThemeVersionLike | undefined): ThemeVersionLike | null => {
    if (!entry || typeof entry !== 'object') return null;
    return entry;
};

const matchVersion = (versions: ThemeVersionLike[], requestedVersion: string): ThemeVersionLike | null => {
    const token = requestedVersion.toLowerCase();
    if (!token) return null;
    return (
        versions.find((version) => normalize(version.version).toLowerCase() === token) ||
        versions.find((version) => normalize(version.id).toLowerCase() === token) ||
        null
    );
};

const pickStoreVersion = (versions: ThemeVersionLike[], storeThemeVersionId: string): ThemeVersionLike | null => {
    if (storeThemeVersionId) {
        const byId = versions.find((version) => normalize(version.id) === storeThemeVersionId);
        if (byId) return byId;
    }
    return toVersion(versions[0]);
};

export class PreviewThemeResolver {
    constructor(private readonly themeRegistry: any) { }

    private async getTheme(themeId: string): Promise<ThemeRecordLike | null> {
        if (!themeId) return null;
        try {
            const theme = await this.themeRegistry.getTheme(themeId);
            return theme || null;
        } catch {
            return null;
        }
    }

    public async resolve(input: {
        store: StoreLike | null | undefined;
        requestedThemeId?: unknown;
        requestedVersion?: unknown;
    }): Promise<PreviewThemeResolution> {
        const store = input.store;
        if (!store) {
            return {
                ok: false,
                status: 404,
                message: 'Store context not found'
            };
        }

        const storeThemeId = normalize(store.themeId);
        const storeThemeVersionId = normalize(store.themeVersionId);
        if (!storeThemeId) {
            return {
                ok: false,
                status: 400,
                message: 'Store has no assigned theme'
            };
        }

        const requestedThemeId = normalize(input.requestedThemeId);
        const requestedVersion = normalize(input.requestedVersion);

        if (requestedThemeId) {
            const requestedTheme = await this.getTheme(requestedThemeId);
            if (!requestedTheme) {
                return {
                    ok: false,
                    status: 404,
                    message: `Theme "${requestedThemeId}" not found`
                };
            }

            const requestedVersions = Array.isArray(requestedTheme.versions) ? requestedTheme.versions : [];
            if (!requestedVersions.length) {
                return {
                    ok: false,
                    status: 404,
                    message: `Theme "${requestedThemeId}" has no versions`
                };
            }

            const selectedByRequest = matchVersion(requestedVersions, requestedVersion);
            if (requestedVersion && !selectedByRequest) {
                return {
                    ok: false,
                    status: 404,
                    message: `Theme "${requestedThemeId}" version "${requestedVersion}" not found`
                };
            }

            const selected = selectedByRequest || toVersion(requestedVersions[0]);
            if (!selected) {
                return {
                    ok: false,
                    status: 404,
                    message: `Theme "${requestedThemeId}" has no usable versions`
                };
            }

            const selectedVersionId = normalize(selected.id);
            const selectedVersion = normalize(selected.version);
            if (!selectedVersionId || !selectedVersion) {
                return {
                    ok: false,
                    status: 500,
                    message: `Theme "${requestedThemeId}" has invalid version metadata`
                };
            }

            return {
                ok: true,
                themeId: requestedThemeId,
                themeVersionId: selectedVersionId,
                themeVersion: selectedVersion,
                source: 'request'
            };
        }

        const storeTheme = await this.getTheme(storeThemeId);
        if (!storeTheme) {
            return {
                ok: false,
                status: 404,
                message: `Store assigned theme "${storeThemeId}" not found`
            };
        }

        const storeVersions = Array.isArray(storeTheme.versions) ? storeTheme.versions : [];
        if (!storeVersions.length) {
            return {
                ok: false,
                status: 404,
                message: `Store assigned theme "${storeThemeId}" has no versions`
            };
        }

        const selectedStoreVersion = pickStoreVersion(storeVersions, storeThemeVersionId);
        const selectedVersionId = normalize(selectedStoreVersion?.id);
        const selectedVersion = normalize(selectedStoreVersion?.version);
        if (!selectedVersionId || !selectedVersion) {
            return {
                ok: false,
                status: 500,
                message: `Store assigned theme "${storeThemeId}" has invalid version metadata`
            };
        }

        return {
            ok: true,
            themeId: storeThemeId,
            themeVersionId: selectedVersionId,
            themeVersion: selectedVersion,
            source: 'store'
        };
    }
}
