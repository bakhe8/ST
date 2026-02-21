import React, { useEffect, useState } from "react";
import { apiUrl } from "../services/api";
import { useParams } from "react-router-dom";

interface StoreSettingsPanelProps {
  storeId?: string;
  onClose?: () => void;
}

const StoreSettingsPanel: React.FC<StoreSettingsPanelProps> = ({
  storeId: propStoreId,
  onClose,
}) => {
  const { storeId: paramStoreId } = useParams();
  const storeId = propStoreId || paramStoreId;

  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState("general");

  // Fetch Store Info (from Mock Api)
  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        // In a real multi-tenant setup, we would pass storeId in header or query param
        // For now, we mock the retrieval by just calling the info endpoint

        const res = await fetch(apiUrl("stores/" + (storeId || "")), {
          headers: {
            "X-VTDR-Store-Id": storeId || "",
          },
        });
        const data = await res.json();
        setStore(data.data);
        setFormData(data.data);
      } catch (err) {
        console.error("Failed to fetch store settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [storeId]);

  const handleSave = async () => {
    try {
      const res = await fetch(apiUrl("stores/" + (storeId || "")), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-VTDR-Store-Id": storeId || "",
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        alert("Settings saved successfully!");
        setStore(result.data); // Update local state
      } else {
        alert("Failed to save settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings.");
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  if (loading)
    return (
      <div className="glass-card" style={{ color: "white", padding: 24 }}>
        Loading store settings...
      </div>
    );
  if (!store)
    return (
      <div className="glass-card" style={{ color: "white", padding: 24 }}>
        Store not found.
      </div>
    );

  // حذف المتجر
  const handleDeleteStore = async () => {
    if (
      !window.confirm("هل أنت متأكد أنك تريد حذف هذا المتجر؟ لا يمكن التراجع.")
    )
      return;
    try {
      const res = await fetch(apiUrl(`stores/${storeId}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-VTDR-Store-Id": storeId || "",
        },
      });
      const result = await res.json();
      if (result.success) {
        alert("تم حذف المتجر بنجاح.");
        if (onClose) onClose();
        window.location.href = "/"; // إعادة توجيه للقائمة
      } else {
        alert("فشل حذف المتجر.");
      }
    } catch (err) {
      alert("حدث خطأ أثناء حذف المتجر.");
    }
  };

  // نسخ المتجر
  const handleCloneStore = async () => {
    if (
      !window.confirm(
        "سيتم إنشاء نسخة جديدة من هذا المتجر مع جميع بياناته. هل تريد المتابعة؟",
      )
    )
      return;
    try {
      const res = await fetch(apiUrl(`stores/${storeId}/clone`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VTDR-Store-Id": storeId || "",
        },
      });
      const result = await res.json();
      if (result.success && result.data?.id) {
        alert("تم نسخ المتجر بنجاح.");
        window.location.href = `/store/${result.data.id}/settings`;
      } else {
        alert("فشل نسخ المتجر.");
      }
    } catch (err) {
      alert("حدث خطأ أثناء نسخ المتجر.");
    }
  };

  return (
    <div
      className="store-settings-panel"
      style={{ color: "white", maxWidth: 800, margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          borderBottom: "1px solid #333",
          paddingBottom: 10,
        }}
      >
        <h2 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 700 }}>
          Store Configuration
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              fontSize: 18,
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["general", "maintenance", "seo", "social"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background:
                activeTab === tab ? "#3b82f6" : "rgba(255,255,255,0.05)",
              color: "white",
              cursor: "pointer",
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#1e293b",
          borderRadius: 12,
          padding: 24,
          border: "1px solid #334155",
        }}
      >
        {activeTab === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                }}
              >
                Store Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "white",
                  borderRadius: 6,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                }}
              >
                Logo URL
              </label>
              <input
                type="text"
                value={formData.logoUrl || ""}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
                placeholder="https://yourdomain.com/logo.png"
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "white",
                  borderRadius: 6,
                }}
              />
              {formData.logoUrl && (
                <img
                  src={formData.logoUrl}
                  alt="Logo Preview"
                  style={{
                    marginTop: 8,
                    maxHeight: 60,
                    background: "#fff",
                    borderRadius: 8,
                    padding: 4,
                  }}
                />
              )}
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                }}
              >
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "white",
                  borderRadius: 6,
                  minHeight: 100,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: "0.9rem",
                    color: "#94a3b8",
                  }}
                >
                  Primary Color
                </label>
                <input
                  type="color"
                  value={formData.primaryColor || "#3b82f6"}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  style={{
                    width: 48,
                    height: 32,
                    border: "none",
                    background: "none",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: "0.9rem",
                    color: "#94a3b8",
                  }}
                >
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={formData.secondaryColor || "#0f172a"}
                  onChange={(e) =>
                    handleChange("secondaryColor", e.target.value)
                  }
                  style={{
                    width: 48,
                    height: 32,
                    border: "none",
                    background: "none",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: "0.9rem",
                    color: "#94a3b8",
                  }}
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "white",
                    borderRadius: 6,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: "0.9rem",
                    color: "#94a3b8",
                  }}
                >
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.contactPhone || ""}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "white",
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 16,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
              }}
            >
              <input
                type="checkbox"
                id="maint_mode"
                checked={formData.is_maintenance || false}
                onChange={(e) =>
                  handleChange("is_maintenance", e.target.checked)
                }
                style={{ width: 18, height: 18 }}
              />
              <label
                htmlFor="maint_mode"
                style={{ fontSize: "1rem", fontWeight: 500 }}
              >
                Enable Maintenance Mode
              </label>
            </div>
            {formData.is_maintenance && (
              <>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: "0.9rem",
                      color: "#94a3b8",
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.maintenance?.title || ""}
                    onChange={(e) =>
                      handleNestedChange("maintenance", "title", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "white",
                      borderRadius: 6,
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: "0.9rem",
                      color: "#94a3b8",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    value={formData.maintenance?.message || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "maintenance",
                        "message",
                        e.target.value,
                      )
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "white",
                      borderRadius: 6,
                      minHeight: 100,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "seo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                }}
              >
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seo?.title || ""}
                onChange={(e) =>
                  handleNestedChange("seo", "title", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "white",
                  borderRadius: 6,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                }}
              >
                SEO Keywords
              </label>
              <input
                type="text"
                value={formData.seo?.keywords || ""}
                onChange={(e) =>
                  handleNestedChange("seo", "keywords", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "white",
                  borderRadius: 6,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                }}
              >
                SEO Description
              </label>
              <textarea
                value={formData.seo?.description || ""}
                onChange={(e) =>
                  handleNestedChange("seo", "description", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "white",
                  borderRadius: 6,
                  minHeight: 100,
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {["twitter", "facebook", "instagram", "snapchat", "youtube"].map(
              (network) => (
                <div key={network}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: "0.9rem",
                      color: "#94a3b8",
                      textTransform: "capitalize",
                    }}
                  >
                    {network}
                  </label>
                  <input
                    type="text"
                    value={formData.social?.[network] || ""}
                    onChange={(e) =>
                      handleNestedChange("social", network, e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "white",
                      borderRadius: 6,
                    }}
                  />
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{
              padding: "10px 24px",
              borderRadius: 6,
              border: "none",
              background: "#3b82f6",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: "10px 24px",
                borderRadius: 6,
                border: "1px solid #334155",
                background: "transparent",
                color: "white",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 16,
          }}
        >
          <button
            onClick={handleCloneStore}
            style={{
              padding: "10px 24px",
              borderRadius: 6,
              border: "1px solid #3b82f6",
              background: "transparent",
              color: "#3b82f6",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            نسخ المتجر
          </button>
          <button
            onClick={handleDeleteStore}
            style={{
              padding: "10px 24px",
              borderRadius: 6,
              border: "1px solid #ef4444",
              background: "transparent",
              color: "#ef4444",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            حذف المتجر
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsPanel;
