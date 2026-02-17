import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PreviewPane from '../components/PreviewPane';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { API_BASE_URL, apiUrl } from '../services/api';

interface StoreSummary {
    id: string;
    themeId: string;
    themeVersion?: {
        version?: string;
    };
}

const StorePreview = () => {
    const { storeId } = useParams();
    const [refreshKey, setRefreshKey] = useState(0);
    const [store, setStore] = useState<StoreSummary | null>(null);
    const [loadingStore, setLoadingStore] = useState(true);

    useEffect(() => {
        const loadStore = async () => {
            if (!storeId) {
                setStore(null);
                setLoadingStore(false);
                return;
            }

            setLoadingStore(true);
            try {
                const res = await fetch(apiUrl(`stores/${storeId}`), {
                    headers: {
                        'X-VTDR-Store-Id': storeId,
                        'Context-Store-Id': storeId
                    }
                });
                const json = await res.json();
                if (json.success && json.data) {
                    setStore(json.data as StoreSummary);
                } else {
                    setStore(null);
                }
            } catch (error) {
                console.error('Failed to load store for preview', error);
                setStore(null);
            } finally {
                setLoadingStore(false);
            }
        };
        void loadStore();
    }, [storeId]);

    const themeId = store?.themeId;
    const version = store?.themeVersion?.version || '1.0.0';

    // Use API_BASE_URL and remove /api if it's already there to avoid duplication if apiUrl does it differently
    const apiRoot = API_BASE_URL.replace(/\/api$/, '');
    const previewUrl = useMemo(() => {
        if (!storeId || !themeId) return '';
        return `${apiRoot}/preview/${storeId}/${themeId}/${version}?page=index&refresh=${refreshKey}`;
    }, [apiRoot, refreshKey, storeId, themeId, version]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4 }}>Live Preview</h1>
                    <p style={{ color: '#94a3b8', margin: 0 }}>View your store as customers see it.</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        onClick={() => setRefreshKey(prev => prev + 1)}
                        style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <RefreshCw size={16} className={refreshKey > 0 ? "animate-spin" : ""} />
                        تحديث المعاينة
                    </button>
                    <button
                        onClick={() => {
                            if (storeId && previewUrl) {
                                window.open(previewUrl, '_blank');
                            } else {
                                alert('يجب اختيار متجر صالح أولاً لفتح المعاينة');
                            }
                        }}
                        disabled={!storeId || !themeId}
                        style={{
                            background: storeId && themeId ? '#3b82f6' : '#334155',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: 6,
                            cursor: storeId && themeId ? 'pointer' : 'not-allowed',
                            opacity: storeId && themeId ? 1 : 0.6,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <ExternalLink size={16} />
                        فتح المعاينة ↗
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, background: '#0f172a', borderRadius: 12, overflow: 'hidden', border: '1px solid #334155' }}>
                {loadingStore ? (
                    <div style={{ color: '#94a3b8', padding: 16 }}>Loading store preview context...</div>
                ) : (
                    <PreviewPane url={previewUrl} style={{ width: '100%', height: '100%' }} />
                )}
            </div>
        </div>
    );
};

export default StorePreview;
