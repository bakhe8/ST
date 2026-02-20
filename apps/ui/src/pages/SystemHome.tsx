import React, { useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../services/api';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, RefreshCw } from 'lucide-react';

interface Store {
    id: string;
    title: string;
    defaultLocale: string;
    description?: string;
}

type SeedProfile = 'general' | 'fashion' | 'electronics';
type CapabilityStatus = 'pass' | 'warning' | 'fail';

interface ThemeCapabilitySummary {
    totalPages: number;
    corePages: number;
    coveredPages: number;
    coveredCorePages: number;
    totalComponents: number;
    matchedComponents: number;
}

interface ThemeCapabilityDetails {
    overallStatus: CapabilityStatus;
    summary: ThemeCapabilitySummary;
    supportedPageIds: string[];
    missingCorePages: string[];
    orphanComponentPaths: string[];
}

interface ThemeAnchorProbeSummary {
    totalPages: number;
    corePages: number;
    declaredComponents: number;
    renderedComponents: number;
    missingAnchorPoints: number;
    orphanAnchorPoints: number;
    pagesWithMissingAnchors: number;
}

interface ThemeAnchorProbeDetails {
    overallStatus: CapabilityStatus;
    summary: ThemeAnchorProbeSummary;
    missingAnchorPoints: string[];
    orphanAnchorPoints: string[];
}

interface ThemeCapabilityThemeSnapshot {
    folder: string;
    themeId: string;
    name: string;
    version: string;
    overallStatus?: CapabilityStatus;
    capability: ThemeCapabilityDetails;
    anchorProbe?: ThemeAnchorProbeDetails;
}

interface ThemeCapabilityGate {
    overallStatus: CapabilityStatus;
    themes: ThemeCapabilityThemeSnapshot[];
}

interface ThemeSyncPayload {
    synced: number;
    capabilityGate?: ThemeCapabilityGate;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const CORE_PAGE_LABELS: Record<string, string> = {
    home: 'الرئيسية',
    'product-list': 'المنتجات',
    category: 'التصنيفات',
    'blog-list': 'المدونة',
    'brands-list': 'الماركات'
};
const STATUS_RANK: Record<CapabilityStatus, number> = {
    fail: 0,
    warning: 1,
    pass: 2
};

const STORES_CACHE_TTL_MS = 5000;
let storesCache: Store[] | null = null;
let storesCacheAt = 0;
let storesInFlight: Promise<Store[]> | null = null;

const requestStores = async (force = false): Promise<Store[]> => {
    const now = Date.now();
    if (!force && storesCache && now - storesCacheAt < STORES_CACHE_TTL_MS) {
        return storesCache;
    }

    if (!force && storesInFlight) {
        return storesInFlight;
    }

    storesInFlight = fetch(apiUrl('v1/stores'))
        .then(res => res.json())
        .then(data => {
            if (!data.success || !Array.isArray(data.data)) {
                throw new Error('Failed to load stores');
            }
            storesCache = data.data as Store[];
            storesCacheAt = Date.now();
            return storesCache;
        })
        .finally(() => {
            storesInFlight = null;
        });

    return storesInFlight;
};

const SystemHome = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newStoreTitle, setNewStoreTitle] = useState('');
    const [seedProfile, setSeedProfile] = useState<SeedProfile>('general');
    const [isSyncingThemes, setIsSyncingThemes] = useState(false);
    const [themeSyncGate, setThemeSyncGate] = useState<ThemeCapabilityGate | null>(null);
    const [themeSyncCount, setThemeSyncCount] = useState<number | null>(null);
    const [themeSyncError, setThemeSyncError] = useState<string | null>(null);
    const [themeSyncAt, setThemeSyncAt] = useState<string | null>(null);

    const fetchStores = async (force = false) => {
        setLoading(true);
        try {
            const nextStores = await requestStores(force);
            setStores(nextStores);
        } catch (error) {
            console.error('Failed to fetch stores', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        setLoading(true);

        requestStores()
            .then(nextStores => {
                if (active) setStores(nextStores);
            })
            .catch(error => {
                if (active) console.error('Failed to fetch stores', error);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const getStatusColors = (status: CapabilityStatus) => {
        if (status === 'pass') {
            return {
                border: '#059669',
                background: 'rgba(5, 150, 105, 0.15)',
                text: '#34d399',
                label: 'PASS'
            };
        }
        if (status === 'warning') {
            return {
                border: '#d97706',
                background: 'rgba(217, 119, 6, 0.15)',
                text: '#fbbf24',
                label: 'WARNING'
            };
        }
        return {
            border: '#dc2626',
            background: 'rgba(220, 38, 38, 0.15)',
            text: '#f87171',
            label: 'FAIL'
        };
    };

    const mapCorePageName = (pageId: string) => CORE_PAGE_LABELS[pageId] || pageId;
    const sortedThemeSnapshots = useMemo(() => {
        if (!themeSyncGate) return [];
        return [...themeSyncGate.themes].sort((a, b) => {
            const statusA = a.overallStatus || a.capability.overallStatus;
            const statusB = b.overallStatus || b.capability.overallStatus;
            const statusDelta = STATUS_RANK[statusA] - STATUS_RANK[statusB];
            if (statusDelta !== 0) return statusDelta;

            const missingDelta = b.capability.missingCorePages.length - a.capability.missingCorePages.length;
            if (missingDelta !== 0) return missingDelta;

            const coverageA = a.capability.summary.coveredCorePages / Math.max(1, a.capability.summary.corePages);
            const coverageB = b.capability.summary.coveredCorePages / Math.max(1, b.capability.summary.corePages);
            if (coverageA !== coverageB) return coverageA - coverageB;

            return (a.name || a.themeId).localeCompare((b.name || b.themeId), 'en');
        });
    }, [themeSyncGate]);

    const gateSummary = useMemo(() => {
        const source = sortedThemeSnapshots;
        return {
            fail: source.filter((theme) => (theme.overallStatus || theme.capability.overallStatus) === 'fail').length,
            warning: source.filter((theme) => (theme.overallStatus || theme.capability.overallStatus) === 'warning').length,
            pass: source.filter((theme) => (theme.overallStatus || theme.capability.overallStatus) === 'pass').length
        };
    }, [sortedThemeSnapshots]);

    const handleSyncThemes = async () => {
        setIsSyncingThemes(true);
        setThemeSyncError(null);
        try {
            const response = await fetch(apiUrl('themes/sync'), { method: 'POST' });
            const body = (await response.json()) as ApiResponse<ThemeSyncPayload>;

            if (!response.ok || !body.success || !body.data) {
                throw new Error(body.error || 'Theme sync failed');
            }

            setThemeSyncCount(Number(body.data.synced || 0));
            setThemeSyncGate(body.data.capabilityGate || null);
            setThemeSyncAt(new Date().toLocaleString());
        } catch (error: any) {
            setThemeSyncError(error?.message || 'Theme sync failed');
        } finally {
            setIsSyncingThemes(false);
        }
    };

    const handleCreateStore = async () => {
        if (!newStoreTitle) return;
        try {
            const res = await fetch(apiUrl('v1/stores'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newStoreTitle,
                    autoSeed: true,
                    seedProfile
                })
            });
            const data = await res.json();
            if (data.success) {
                setNewStoreTitle('');
                setSeedProfile('general');
                setIsCreating(false);
                storesCache = null;
                storesCacheAt = 0;
                await fetchStores(true);
            } else {
                alert('Failed to create store');
            }
        } catch (e) {
            console.error(e);
            alert('Error creating store');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Virtual Stores</h1>
                    <p style={{ color: '#94a3b8' }}>Manage and simulate your Salla stores.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}
                >
                    <Plus size={18} />
                    <span>Create Store</span>
                </button>
            </div>

            {isCreating && (
                <div style={{ marginBottom: 32, background: '#1e293b', padding: 24, borderRadius: 12, border: '1px solid #3b82f6' }}>
                    <h3 style={{ marginTop: 0, marginBottom: 16, color: 'white' }}>New Store Details</h3>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <input
                            type="text"
                            placeholder="Store Title"
                            value={newStoreTitle}
                            onChange={(e) => setNewStoreTitle(e.target.value)}
                            style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                        />
                        <select
                            value={seedProfile}
                            onChange={(event) => setSeedProfile(event.target.value as SeedProfile)}
                            style={{ padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: 'white', minWidth: 180 }}
                        >
                            <option value="general">General Profile</option>
                            <option value="fashion">Fashion Profile</option>
                            <option value="electronics">Electronics Profile</option>
                        </select>
                        <button
                            onClick={handleCreateStore}
                            style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '12px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: 32, background: '#1e293b', padding: 20, borderRadius: 12, border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                    <div>
                        <h3 style={{ margin: 0, color: 'white' }}>Theme Capability Gate</h3>
                        <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 13 }}>
                            يتحقق من تغطية الصفحات الأساسية من `twilight.json` + فحص نقاط العرض (Anchor Probe) لكل ثيم بعد المزامنة.
                        </p>
                    </div>
                    <button
                        onClick={handleSyncThemes}
                        disabled={isSyncingThemes}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 14px',
                            borderRadius: 8,
                            border: '1px solid #3b82f6',
                            background: isSyncingThemes ? '#1d4ed8' : '#2563eb',
                            color: '#fff',
                            cursor: isSyncingThemes ? 'wait' : 'pointer',
                            fontWeight: 600
                        }}
                    >
                        <RefreshCw size={16} style={{ animation: isSyncingThemes ? 'spin 1s linear infinite' : 'none' }} />
                        {isSyncingThemes ? 'Syncing...' : 'Sync Themes + Run Gate'}
                    </button>
                </div>

                {themeSyncError && (
                    <div style={{ marginBottom: 12, border: '1px solid #7f1d1d', background: 'rgba(127, 29, 29, 0.3)', color: '#fecaca', borderRadius: 8, padding: '10px 12px' }}>
                        {themeSyncError}
                    </div>
                )}

                {themeSyncCount !== null && (
                    <div style={{ marginBottom: 12, color: '#cbd5e1', fontSize: 13 }}>
                        Synced themes: <strong>{themeSyncCount}</strong>
                        {themeSyncAt ? <span style={{ marginInlineStart: 8, color: '#94a3b8' }}>Last sync: {themeSyncAt}</span> : null}
                    </div>
                )}

                {themeSyncGate && (
                    <div>
                        <div style={{ marginBottom: 12 }}>
                            {(() => {
                                const style = getStatusColors(themeSyncGate.overallStatus);
                                return (
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            border: `1px solid ${style.border}`,
                                            background: style.background,
                                            color: style.text,
                                            borderRadius: 999,
                                            padding: '4px 10px',
                                            fontSize: 12,
                                            fontWeight: 700
                                        }}
                                    >
                                        Capability Gate: {style.label}
                                    </span>
                                );
                            })()}
                        </div>
                        <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ border: '1px solid #7f1d1d', background: 'rgba(127, 29, 29, 0.25)', color: '#fecaca', borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                                FAIL: {gateSummary.fail}
                            </span>
                            <span style={{ border: '1px solid #854d0e', background: 'rgba(133, 77, 14, 0.25)', color: '#fde68a', borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                                WARNING: {gateSummary.warning}
                            </span>
                            <span style={{ border: '1px solid #166534', background: 'rgba(22, 101, 52, 0.25)', color: '#bbf7d0', borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                                PASS: {gateSummary.pass}
                            </span>
                            <span style={{ color: '#94a3b8', fontSize: 12, padding: '3px 2px' }}>
                                العرض مرتب من الأضعف إلى الأقوى.
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
                            {sortedThemeSnapshots.map((theme) => {
                                const statusStyle = getStatusColors(theme.overallStatus || theme.capability.overallStatus);
                                const anchorProbe = theme.anchorProbe;
                                return (
                                    <div
                                        key={`${theme.themeId}-${theme.version}`}
                                        style={{
                                            border: '1px solid #334155',
                                            borderRadius: 10,
                                            background: '#0f172a',
                                            padding: 12
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                            <div>
                                                <div style={{ color: '#fff', fontWeight: 700 }}>{theme.name || theme.themeId}</div>
                                                <div style={{ color: '#94a3b8', fontSize: 12 }}>
                                                    {theme.folder} · v{theme.version}
                                                </div>
                                            </div>
                                            <span
                                                style={{
                                                    border: `1px solid ${statusStyle.border}`,
                                                    background: statusStyle.background,
                                                    color: statusStyle.text,
                                                    borderRadius: 999,
                                                    padding: '3px 8px',
                                                    fontSize: 11,
                                                    fontWeight: 700
                                                }}
                                            >
                                                {statusStyle.label}
                                            </span>
                                        </div>

                                        <div style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 8 }}>
                                            Core coverage: {theme.capability.summary.coveredCorePages}/{theme.capability.summary.corePages}
                                            <span style={{ marginInlineStart: 8 }}>
                                                Components: {theme.capability.summary.totalComponents}
                                            </span>
                                        </div>
                                        {anchorProbe && (
                                            <div style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 8 }}>
                                                Anchor probe: {anchorProbe.summary.renderedComponents}/{anchorProbe.summary.declaredComponents}
                                                <span style={{ marginInlineStart: 8 }}>
                                                    Missing anchors: {anchorProbe.summary.missingAnchorPoints}
                                                </span>
                                            </div>
                                        )}

                                        {theme.capability.missingCorePages.length > 0 ? (
                                            <div style={{ color: '#fbbf24', fontSize: 12 }}>
                                                Missing core pages: {theme.capability.missingCorePages.map(mapCorePageName).join('، ')}
                                            </div>
                                        ) : (
                                            <div style={{ color: '#34d399', fontSize: 12 }}>Core storefront pages are covered.</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {loading ? (
                    <div>Loading stores...</div>
                ) : stores.map(store => (
                    <Link to={`/store/${store.id}`} key={store.id} style={{ textDecoration: 'none' }}>
                        <div className="store-card" style={{ background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid #334155', transition: 'transform 0.2s', cursor: 'pointer' }}>
                            <div style={{ width: 48, height: 48, background: '#334155', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <ShoppingBag size={24} color="#60a5fa" />
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 8 }}>{store.title}</h3>
                            <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16 }}>Language: {store.defaultLocale}</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <span style={{ fontSize: 12, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 8px', borderRadius: 4 }}>Active</span>
                                <span style={{ fontSize: 12, background: '#334155', color: '#cbd5e1', padding: '4px 8px', borderRadius: 4 }}>Theme: Raed</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SystemHome;
