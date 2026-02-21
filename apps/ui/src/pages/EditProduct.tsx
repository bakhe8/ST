import React, { useEffect, useState } from "react";
import { apiUrl } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

interface ProductProperty {
  key: string;
  value: string;
}

interface ProductOptionValue {
  id?: string;
  name: string;
  price?: number;
}

interface ProductOption {
  id?: string;
  name: string;
  type?: string;
  values?: ProductOptionValue[];
}

interface ProductVariant {
  id?: string;
  sku?: string;
  quantity?: number;
  price?: { amount?: number; currency?: string };
}

interface Product {
  id: string;
  name: string;
  price: { amount: number; currency: string };
  sku?: string;
  status?: string;
  type?: string;
  quantity?: number | null;
  available_quantity?: number | null;
  reserved_quantity?: number;
  max_quantity?: number;
  low_stock_threshold?: number;
  track_quantity?: boolean;
  allow_backorder?: boolean;
  inventory_status?: string;
  is_available?: boolean;
  is_hidden_quantity?: boolean;
  is_infinite_quantity?: boolean;
  is_featured?: boolean;
  weight?: number;
  weight_unit?: string;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  };
  custom_fields?: {
    id?: string;
    key?: string;
    value?: string;
    type?: string;
  }[];
  specs?: { id?: string; key?: string; value?: string }[];
  attachments?: {
    id?: string;
    name?: string;
    file_url?: string;
    file_type?: string;
  }[];
  images?: { url: string }[];
  main_image?: string;
  image?: { url: string };
  thumbnail?: string;
  description?: string;
  categories?: ({ id?: string; name?: string } | string)[]; // supports both ids and objects
  category_ids?: string[];
  properties?: ProductProperty[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  stock?: number;
}

interface Category {
  id: string;
  name: string;
}

const EditProduct = () => {
  const { productId, storeId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractCategoryIds = (candidate: any): string[] => {
    const fromCategoryIds = Array.isArray(candidate?.category_ids)
      ? candidate.category_ids.map(String)
      : [];
    if (fromCategoryIds.length > 0) return fromCategoryIds;
    if (!Array.isArray(candidate?.categories)) return [];
    return candidate.categories
      .map((item: any) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && item.id != null)
          return String(item.id);
        return "";
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (!productId) return;
    // جلب بيانات المنتج
    fetch(apiUrl(`v1/products/${productId}`), {
      headers: { "X-VTDR-Store-Id": storeId || "" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const raw = data.data || {};
          const categoryIds = extractCategoryIds(raw);
          const quantity =
            typeof raw.quantity === "number"
              ? raw.quantity
              : typeof raw.stock === "number"
                ? raw.stock
                : 0;
          const trackQuantity = raw.track_quantity !== false;
          setProduct({
            ...raw,
            categories: categoryIds,
            category_ids: categoryIds,
            options: Array.isArray(raw.options) ? raw.options : [],
            variants: Array.isArray(raw.variants) ? raw.variants : [],
            quantity,
            stock: quantity,
            available_quantity:
              typeof raw.available_quantity === "number"
                ? raw.available_quantity
                : quantity,
            reserved_quantity:
              typeof raw.reserved_quantity === "number"
                ? raw.reserved_quantity
                : 0,
            max_quantity:
              typeof raw.max_quantity === "number"
                ? raw.max_quantity
                : typeof quantity === "number" && quantity > 0
                  ? quantity
                  : 1,
            low_stock_threshold:
              typeof raw.low_stock_threshold === "number"
                ? raw.low_stock_threshold
                : 0,
            track_quantity: trackQuantity,
            allow_backorder: Boolean(raw.allow_backorder),
            is_available: raw.is_available !== false,
            is_hidden_quantity: Boolean(raw.is_hidden_quantity),
            is_infinite_quantity: Boolean(raw.is_infinite_quantity),
            status: raw.status || (raw.is_available === false ? "out" : "sale"),
            is_featured: Boolean(raw.is_featured),
            weight: typeof raw.weight === "number" ? raw.weight : 0,
            weight_unit:
              typeof raw.weight_unit === "string" && raw.weight_unit.trim()
                ? raw.weight_unit
                : "kg",
          });
        } else setError("Product not found");
        setLoading(false);
      })
      .catch(() => {
        setError("Error loading product");
        setLoading(false);
      });
    // جلب الأقسام
    fetch(apiUrl("v1/categories"), {
      headers: { "X-VTDR-Store-Id": storeId || "" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });
  }, [productId, storeId]);
  // تغيير الأقسام المرتبطة بالمنتج
  const handleCategoriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!product) return;
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value,
    );
    setProduct({ ...product, categories: selected, category_ids: selected });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!product) return;
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!product) return;
    if (e.target.name === "status") {
      const value = e.target.value;
      const nextAvailability = value === "sale";
      setProduct({
        ...product,
        status: value,
        is_available:
          value === "hidden" ? product.is_available : nextAvailability,
      });
      return;
    }
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // إدارة الصور
  const handleAddImage = () => {
    if (!product) return;
    const url = prompt("أدخل رابط الصورة:");
    if (url) {
      setProduct({
        ...product,
        images: [...(product.images || []), { url }],
      });
    }
  };
  const handleRemoveImage = (idx: number) => {
    if (!product) return;
    setProduct({
      ...product,
      images: (product.images || []).filter((img, i) => i !== idx),
    });
  };

  // إدارة الخصائص
  const handleAddProperty = () => {
    if (!product) return;
    const key = prompt("اسم الخاصية (مثال: اللون):");
    const value = prompt("القيمة (مثال: أحمر):");
    if (key && value) {
      setProduct({
        ...product,
        properties: [...(product.properties || []), { key, value }],
      });
    }
  };
  const handleRemoveProperty = (idx: number) => {
    if (!product) return;
    setProduct({
      ...product,
      properties: (product.properties || []).filter((prop, i) => i !== idx),
    });
  };

  // إدارة المخزون
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    if (product.track_quantity === false) return;
    const quantity = Number(e.target.value);
    const safeQuantity = Number.isFinite(quantity)
      ? Math.max(0, Math.floor(quantity))
      : 0;
    const reserved = Number(product.reserved_quantity || 0);
    setProduct({
      ...product,
      quantity: safeQuantity,
      stock: safeQuantity,
      available_quantity: Math.max(0, safeQuantity - Math.max(0, reserved)),
      max_quantity: Math.max(
        1,
        Math.min(
          product.max_quantity || safeQuantity || 1,
          safeQuantity || product.max_quantity || 1,
        ),
      ),
      is_available: product.is_infinite_quantity ? true : safeQuantity > 0,
    });
  };

  const handleSave = () => {
    if (!product) return;
    const categoryIds = extractCategoryIds(product);
    const payload = {
      ...product,
      categories: categoryIds,
      category_ids: categoryIds,
      options: Array.isArray(product.options) ? product.options : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      quantity: product.is_infinite_quantity
        ? null
        : Number(product.quantity || product.stock || 0),
      stock: product.is_infinite_quantity
        ? null
        : Number(product.quantity || product.stock || 0),
      max_quantity: Number(product.max_quantity || 1),
      low_stock_threshold: Math.max(
        0,
        Number(product.low_stock_threshold || 0),
      ),
      track_quantity: product.track_quantity !== false,
      allow_backorder: Boolean(product.allow_backorder),
      is_available: Boolean(product.is_available),
      is_hidden_quantity: Boolean(product.is_hidden_quantity),
      is_infinite_quantity: Boolean(product.is_infinite_quantity),
      is_featured: Boolean(product.is_featured),
      weight: Math.max(0, Number(product.weight || 0)),
      weight_unit: product.weight_unit || "kg",
    };
    fetch(apiUrl(`v1/products/${productId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-VTDR-Store-Id": storeId || "",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) navigate(-1);
        else setError("Failed to save");
      })
      .catch(() => setError("Failed to save"));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!product) return null;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        background: "#1e293b",
        padding: 32,
        borderRadius: 12,
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: 24 }}>تعديل المنتج</h2>
      <div style={{ display: "flex", gap: 32 }}>
        {/* LEFT: FORM FIELDS */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <label>الأقسام</label>
            <select
              multiple
              name="categories"
              value={extractCategoryIds(product)}
              onChange={handleCategoriesChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
                minHeight: 80,
              }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>اسم المنتج</label>
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>الوصف</label>
            <textarea
              name="description"
              value={product.description || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>السعر</label>
            <input
              name="price"
              type="number"
              value={product.price.amount}
              onChange={(e) =>
                setProduct({
                  ...product,
                  price: { ...product.price, amount: Number(e.target.value) },
                })
              }
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>SKU</label>
            <input
              name="sku"
              value={product.sku || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>الحالة</label>
            <select
              name="status"
              value={product.status || "sale"}
              onChange={handleSelectChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
              }}
            >
              <option value="sale">متوفر للبيع</option>
              <option value="out">نفد المخزون</option>
              <option value="out-and-notify">نفد + إشعار توفر</option>
              <option value="hidden">مخفي</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>النوع</label>
            <input
              name="type"
              value={product.type || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={Boolean(product.is_featured)}
                onChange={(e) =>
                  setProduct({ ...product, is_featured: e.target.checked })
                }
              />
              منتج مميز
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>الوزن</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                min={0}
                step="0.01"
                value={product.weight || 0}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    weight: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "white",
                }}
              />
              <select
                value={product.weight_unit || "kg"}
                onChange={(e) =>
                  setProduct({ ...product, weight_unit: e.target.value })
                }
                style={{
                  width: 90,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "white",
                }}
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
              </select>
            </div>
          </div>
        </div>
        {/* RIGHT: IMAGES & PROPERTIES */}
        <div style={{ minWidth: 220, textAlign: "center" }}>
          <div style={{ marginBottom: 12, fontWeight: 600 }}>صور المنتج</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {(product.images || []).map((img, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <img
                  src={img.url}
                  alt="صورة"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #334155",
                    background: "#0f172a",
                  }}
                />
                <button
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12,
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddImage}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "6px 16px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            إضافة صورة
          </button>

          <div style={{ marginBottom: 12, fontWeight: 600 }}>خصائص المنتج</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {(product.properties || []).map((prop, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0f172a",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  {prop.key}: {prop.value}
                </span>
                <button
                  onClick={() => handleRemoveProperty(idx)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12,
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddProperty}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "6px 16px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            إضافة خاصية
          </button>

          <div style={{ marginBottom: 12, fontWeight: 600 }}>خيارات المنتج</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {(product.options || []).map((option, idx) => (
              <div
                key={option.id || idx}
                style={{
                  background: "#0f172a",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  {option.name} ({option.type || "select"}) -{" "}
                  {(option.values || []).length} values
                </span>
                <button
                  onClick={() =>
                    setProduct({
                      ...product,
                      options: (product.options || []).filter(
                        (_, i) => i !== idx,
                      ),
                    })
                  }
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12,
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const name = prompt("اسم الخيار (مثال: المقاس):");
              if (!name) return;
              const type =
                prompt(
                  "نوع الخيار (select/radio/image/text/date):",
                  "select",
                ) || "select";
              const valuesRaw =
                prompt("القيم مفصولة بفاصلة (مثال: S,M,L):", "") || "";
              const values = valuesRaw
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
                .map((value) => ({ name: value, price: 0 }));
              setProduct({
                ...product,
                options: [...(product.options || []), { name, type, values }],
              });
            }}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "6px 16px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            إضافة خيار
          </button>

          <div style={{ marginBottom: 12, fontWeight: 600 }}>
            متغيرات المنتج
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {(product.variants || []).map((variant, idx) => (
              <div
                key={variant.id || idx}
                style={{
                  background: "#0f172a",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  {variant.sku || "no-sku"} | qty: {variant.quantity || 0} |
                  price: {variant.price?.amount || 0}
                </span>
                <button
                  onClick={() =>
                    setProduct({
                      ...product,
                      variants: (product.variants || []).filter(
                        (_, i) => i !== idx,
                      ),
                    })
                  }
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12,
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const sku = prompt("SKU المتغير:", "") || "";
              const price = Number(prompt("السعر:", "0") || "0");
              const quantity = Number(prompt("الكمية:", "0") || "0");
              setProduct({
                ...product,
                variants: [
                  ...(product.variants || []),
                  {
                    sku,
                    quantity,
                    price: {
                      amount: price,
                      currency: product.price?.currency || "SAR",
                    },
                  },
                ],
              });
            }}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "6px 16px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            إضافة متغير
          </button>

          <div style={{ marginBottom: 12, fontWeight: 600 }}>المخزون</div>
          <input
            type="number"
            min={0}
            value={
              typeof product.quantity === "number"
                ? product.quantity
                : product.stock || 0
            }
            onChange={handleStockChange}
            disabled={
              Boolean(product.is_infinite_quantity) ||
              product.track_quantity === false
            }
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
              marginBottom: 8,
            }}
          />
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={product.track_quantity !== false}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    track_quantity: e.target.checked,
                    is_infinite_quantity: e.target.checked
                      ? product.is_infinite_quantity
                      : true,
                    allow_backorder: e.target.checked
                      ? product.allow_backorder
                      : false,
                  })
                }
              />
              تتبع المخزون
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={Boolean(product.is_infinite_quantity)}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    is_infinite_quantity: e.target.checked,
                    track_quantity: e.target.checked
                      ? product.track_quantity
                      : product.track_quantity !== false,
                    is_available: e.target.checked
                      ? true
                      : Boolean((product.quantity || product.stock || 0) > 0),
                    status: e.target.checked ? "sale" : product.status,
                  })
                }
                disabled={product.track_quantity === false}
              />
              كمية غير محدودة
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={Boolean(product.allow_backorder)}
                onChange={(e) =>
                  setProduct({ ...product, allow_backorder: e.target.checked })
                }
                disabled={
                  product.track_quantity === false ||
                  Boolean(product.is_infinite_quantity)
                }
              />
              السماح بالطلب المسبق عند نفاد المخزون
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>حد المخزون المنخفض</label>
            <input
              type="number"
              min={0}
              value={Math.max(0, Number(product.low_stock_threshold || 0))}
              onChange={(e) =>
                setProduct({
                  ...product,
                  low_stock_threshold: Math.max(0, Number(e.target.value) || 0),
                })
              }
              disabled={
                product.track_quantity === false ||
                Boolean(product.is_infinite_quantity)
              }
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
                marginTop: 6,
              }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>الحد الأقصى لكل طلب</label>
            <input
              type="number"
              min={1}
              value={product.max_quantity || 1}
              onChange={(e) =>
                setProduct({
                  ...product,
                  max_quantity: Math.max(1, Number(e.target.value) || 1),
                })
              }
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
                marginTop: 6,
              }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={Boolean(product.is_available)}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    is_available: e.target.checked,
                    status: e.target.checked ? "sale" : "out",
                  })
                }
              />
              متاح للشراء
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={Boolean(product.is_hidden_quantity)}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    is_hidden_quantity: e.target.checked,
                  })
                }
                disabled={product.track_quantity === false}
              />
              إخفاء الكمية
            </label>
          </div>
        </div>
      </div>
      <button
        onClick={handleSave}
        style={{
          background: "#3b82f6",
          color: "white",
          padding: "10px 24px",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          marginTop: 24,
        }}
      >
        حفظ التعديلات
      </button>
    </div>
  );
};

export default EditProduct;
