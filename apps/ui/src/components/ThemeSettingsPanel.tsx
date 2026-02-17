import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../services/api';

interface ThemeSettingField {
  id: string;
  label: string;
  type: string;
  format?: string;
  value?: any;
  options?: any[];
  required?: boolean;
  description?: string;
}

interface ThemeSettingsPanelProps {
  themePath?: string; // Kept for backward compat but unused for now
  onSave?: (settings: Record<string, any>) => void;
}

const ThemeSettingsPanel: React.FC<ThemeSettingsPanelProps> = ({ onSave }) => {
  const [fields, setFields] = useState<ThemeSettingField[]>([]);
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const { storeId } = useParams();

  useEffect(() => {
    // Fetch from API instead of reading file directly
    fetch(apiUrl('v1/theme/settings'), {
      headers: {
        'X-VTDR-Store-Id': storeId || '',
        'Context-Store-Id': storeId || ''
      }
    })
      .then(res => res.json())
      .then(response => {
        if (response.success && response.data) {
          const { settings, values: savedValues } = response.data;
          const activeFields = (settings || []).filter((f: any) => f.type !== 'static');
          setFields(activeFields);

          // Initialize values: Saved > Default > First Option > Empty
          const initial: Record<string, any> = {};
          activeFields.forEach((f: any) => {
            if (savedValues && savedValues[f.id] !== undefined) {
              initial[f.id] = savedValues[f.id];
            } else if (typeof f.value !== 'undefined') {
              initial[f.id] = f.value;
            } else if (f.format === 'dropdown-list' && f.selected?.length) {
              initial[f.id] = f.selected[0].value;
            } else if (f.type === 'boolean') {
              initial[f.id] = false;
            } else {
              initial[f.id] = '';
            }
          });
          setValues(initial);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load theme settings', err);
        setLoading(false);
      });
  }, [storeId]);

  const handleChange = (id: string, value: any) => {
    setValues(v => ({ ...v, [id]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(apiUrl('v1/theme/settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-VTDR-Store-Id': storeId || '',
          'Context-Store-Id': storeId || ''
        },
        body: JSON.stringify(values)
      });
      const result = await res.json();
      if (result.success) {
        alert('تم حفظ إعدادات الثيم بنجاح! ✅');
        if (onSave) onSave(values);
      } else {
        alert('فشل الحفظ ❌');
      }
    } catch (e) {
      alert('خطأ في الاتصال ❌');
      console.error(e);
    }
  };

  if (loading) return <div className="glass-card">جاري تحميل خيارات الثيم...</div>;

  if (fields.length === 0) return <div className="glass-card">لا توجد إعدادات لهذا الثيم.</div>;

  return (
    <div style={{ padding: 24, background: '#1e293b', borderRadius: 12, color: 'white', maxHeight: '80vh', overflowY: 'auto' }}>
      <h2 style={{ marginBottom: 16, fontSize: '1.2rem' }}>إعدادات الثيم (Active Theme)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {fields.map(field => (
          <div key={field.id} className="glass-card" style={{ padding: 12, background: 'rgba(255,255,255,0.03)' }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{field.label}</label>

            {/* Render Input based on Type */}
            {field.format === 'dropdown-list' && field.options ? (
              <select
                value={values[field.id]}
                onChange={e => handleChange(field.id, e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: 'white' }}
              >
                {field.options.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'color' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={values[field.id] || '#000000'}
                  onChange={e => handleChange(field.id, e.target.value)}
                  style={{ width: 40, height: 40, border: 'none', background: 'none' }}
                />
                <input
                  type="text"
                  value={values[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: 'white' }}
                />
              </div>
            ) : field.type === 'boolean' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  id={`check_${field.id}`}
                  type="checkbox"
                  checked={!!values[field.id]}
                  onChange={e => handleChange(field.id, e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <label htmlFor={`check_${field.id}`} style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>تفعيل</label>
              </div>
            ) : (
              <input
                type="text"
                value={values[field.id] || ''}
                onChange={e => handleChange(field.id, e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: 'white' }}
              />
            )}

            {field.description && <div style={{ marginTop: 4, color: '#94a3b8', fontSize: '0.8rem' }}>{field.description}</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          className="btn-primary"
          style={{ padding: '10px 24px', borderRadius: 8, fontWeight: 600 }}
        >
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
};

export default ThemeSettingsPanel;
