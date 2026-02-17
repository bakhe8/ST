import React, { useEffect, useState } from 'react';
import { apiUrl } from '../services/api';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus } from 'lucide-react';

interface Store {
    id: string;
    title: string;
    defaultLocale: string;
    description?: string;
}

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

    const handleCreateStore = async () => {
        if (!newStoreTitle) return;
        try {
            const res = await fetch(apiUrl('v1/stores'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newStoreTitle })
            });
            const data = await res.json();
            if (data.success) {
                setNewStoreTitle('');
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
