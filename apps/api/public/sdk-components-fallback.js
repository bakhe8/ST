/**
 * VTDR Preview fallback for missing Twilight components.
 * Registers baseline `salla-*` elements only when absent.
 */
(function () {
  if (window.__VTDR_COMPONENTS_FALLBACK__) return;
  window.__VTDR_COMPONENTS_FALLBACK__ = true;

  const getStoreId = () =>
    window.vtdr_context?.storeId || window.__VTDR_STORE_ID__ || "";
  const str = (v) => String(v == null ? "" : v).trim();
  const arr = (v) => (Array.isArray(v) ? v : []);
  const tail = (v) => {
    const p = str(v).split("/").filter(Boolean);
    return p[p.length - 1] || "";
  };

  const parseSelected = (raw) => {
    const value = str(raw);
    if (!value) return [];
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed))
          return parsed.map((x) => str(x)).filter(Boolean);
      } catch {}
      return value
        .slice(1, -1)
        .split(",")
        .map((x) => str(x).replace(/^['"]+|['"]+$/g, ""))
        .filter(Boolean);
    }
    return value
      .split(",")
      .map((x) => str(x))
      .filter(Boolean);
  };

  const qs = (query) => {
    const p = new URLSearchParams();
    Object.entries(query || {}).forEach(([k, v]) => {
      if (v == null) return;
      const raw = Array.isArray(v) ? v.join(",") : String(v);
      if (!raw.trim()) return;
      p.set(k, raw);
    });
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  const callApi = async (path, query = {}) => {
    const headers = {
      "X-VTDR-Store-Id": getStoreId(),
      "Context-Store-Id": getStoreId(),
    };
    const res = await fetch(`${path}${qs(query)}`, { method: "GET", headers });
    const payload = await res.json().catch(() => null);
    if (!res.ok || payload?.success === false) {
      const msg =
        payload?.error?.message ||
        payload?.error ||
        payload?.message ||
        res.statusText ||
        "API error";
      throw new Error(msg);
    }
    return payload || {};
  };

  const normalizeProduct = (p) => {
    const x = p && typeof p === "object" ? p : {};
    const id = str(x.id || x.slug || x.product_id || `p-${Date.now()}`);
    const slug = str(x.slug || id);
    const imageUrl = str(
      x?.image?.url || x.thumbnail || x.main_image || "/images/placeholder.png",
    );
    const amount =
      Number(x?.price?.amount ?? x?.sale_price?.amount ?? x?.price ?? 0) || 0;
    const currency = str(x?.price?.currency || x?.currency || "SAR") || "SAR";
    return {
      ...x,
      id,
      slug,
      name: str(x.name || x.title || "Product"),
      url: str(x.url || `/products/${slug}`),
      image: {
        ...(x.image || {}),
        url: imageUrl,
        alt: str(x?.image?.alt || x.name || "Product"),
      },
      price:
        x?.price && typeof x.price === "object"
          ? x.price
          : { amount, currency },
    };
  };

  const ensureBaseStyle = () => {
    if (document.getElementById("vtdr-fallback-style")) return;
    const style = document.createElement("style");
    style.id = "vtdr-fallback-style";
    style.textContent = `
      .vtdr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}
      .vtdr-list{display:flex;flex-direction:column;gap:1rem}
      .vtdr-empty,.vtdr-loading,.vtdr-error{padding:1rem;border:1px dashed #d1d5db;border-radius:.75rem;text-align:center}
      .vtdr-card{display:block;border:1px solid #e5e7eb;border-radius:.75rem;overflow:hidden;background:#fff;color:inherit;text-decoration:none}
      .vtdr-card img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#f3f4f6}
      .vtdr-card .b{padding:.75rem;display:grid;gap:.25rem}
      .vtdr-menu{list-style:none;margin:0;padding:0;display:flex;gap:.75rem;flex-wrap:wrap}
      .vtdr-menu ul{list-style:none;margin:.25rem 0 0;padding:.5rem;display:grid;gap:.25rem}
    `;
    document.head.appendChild(style);
  };

  const ensureComponentApi = () => {
    const salla = window.salla || (window.salla = {});
    salla.api = salla.api || {};
    salla.api.component = salla.api.component || {};

    salla.api.component.getProducts = async (opts = {}) => {
      const source = str(opts.source || opts?.query?.source);
      const sourceValue = str(opts.sourceValue || opts?.query?.source_value);
      const sort = str(opts.sort || opts?.query?.sort);
      const query = { ...(opts.query || {}) };
      if (source) query.source = source;
      if (sourceValue) query.source_value = sourceValue;
      if (sort) query.sort = sort;
      if (!query.per_page && !query.limit) query.per_page = 60;

      if (source === "selected") {
        delete query.source;
        delete query.source_value;
        const ids = new Set(
          parseSelected(sourceValue).map((x) => x.toLowerCase()),
        );
        const base = await callApi("/api/v1/products", query);
        const items = arr(base.data)
          .map(normalizeProduct)
          .filter(
            (p) =>
              ids.size === 0 ||
              ids.has(str(p.id).toLowerCase()) ||
              ids.has(str(p.slug).toLowerCase()) ||
              ids.has(tail(p.url).toLowerCase()),
          );
        return {
          ...base,
          data: items,
          pagination: {
            ...(base.pagination || {}),
            count: items.length,
            total: items.length,
            currentPage: 1,
            totalPages: 1,
          },
        };
      }

      const out = await callApi("/api/v1/products", query);
      return { ...out, data: arr(out.data).map(normalizeProduct) };
    };

    salla.api.component.getMenus = async (opts = {}) => {
      const source =
        typeof opts === "string"
          ? str(opts)
          : str(opts.source || opts.type || "header") || "header";
      return callApi(`/api/v1/menus/${encodeURIComponent(source)}`);
    };

    salla.api.component.getCategories = async (opts = {}) =>
      callApi("/api/v1/categories", opts.query || {});
    salla.api.component.getBrands = async (opts = {}) =>
      callApi("/api/v1/brands", opts.query || {});
    salla.api.component.getBlogArticles = async (opts = {}) => {
      const query = { ...(opts.query || {}) };
      if (opts.source) query.source = opts.source;
      if (opts.sourceValue) query.source_value = opts.sourceValue;
      return callApi("/api/v1/blog/articles", query);
    };
  };

  class VtdrProductsList extends HTMLElement {
    static get observedAttributes() {
      return ["source", "source-value", "filters"];
    }
    constructor() {
      super();
      this.sortBy = "";
      this.__connected = false;
      this.__onFilters = this.onFilters.bind(this);
    }
    connectedCallback() {
      if (this.__connected) return;
      this.__connected = true;
      ensureBaseStyle();
      document.addEventListener("salla-filters::changed", this.__onFilters);
      this.reload();
    }
    disconnectedCallback() {
      document.removeEventListener("salla-filters::changed", this.__onFilters);
    }
    attributeChangedCallback(a, oldValue, newValue) {
      if (!this.__connected || oldValue === newValue) return;
      this.reload();
    }
    onFilters(e) {
      try {
        this.setAttribute("filters", JSON.stringify(e?.detail || {}));
      } catch {}
      this.reload();
    }
    parseFilters() {
      const raw = str(this.getAttribute("filters"));
      if (!raw) return {};
      try {
        return JSON.parse(raw) || {};
      } catch {
        return {};
      }
    }
    createCard(product) {
      const tag = str(
        this.getAttribute("product-card-component") ||
          "custom-salla-product-card",
      );
      if (tag.includes("-")) {
        const el = document.createElement(tag);
        el.setAttribute("product", JSON.stringify(product));
        if (this.hasAttribute("row-cards")) el.setAttribute("horizontal", "");
        if (this.hasAttribute("shadow-on-hover"))
          el.setAttribute("shadowOnHover", "");
        return el;
      }
      const a = document.createElement("a");
      a.className = "vtdr-card";
      a.href = product.url || "#";
      const money = window.salla?.money
        ? window.salla.money(product?.price?.amount || 0)
        : `${product?.price?.amount || 0}`;
      a.innerHTML = `<img src="${product?.image?.url || "/images/placeholder.png"}" alt="${product?.image?.alt || product?.name || "Product"}"/><span class="b"><span>${product?.name || "Product"}</span><span>${money}</span></span>`;
      return a;
    }
    async reload() {
      this.innerHTML = `<div class="vtdr-loading">Loading...</div>`;
      const source = str(this.getAttribute("source") || "product.index");
      const sourceValue = str(
        this.getAttribute("source-value") || this.getAttribute("source_value"),
      );
      const filters = this.parseFilters();
      const sort = str(this.sortBy || filters.sort);
      const query = { ...filters };
      if (sort) query.sort = sort;
      try {
        ensureComponentApi();
        const res = await window.salla.api.component.getProducts({
          source,
          sourceValue,
          sort,
          query,
        });
        const items = arr(res.data).map(normalizeProduct);
        if (!items.length) {
          this.innerHTML = `<div class="vtdr-empty">No products</div>`;
        } else {
          const wrap = document.createElement("div");
          wrap.className = this.hasAttribute("row-cards")
            ? "vtdr-list"
            : "vtdr-grid";
          items.forEach((p) => {
            const w = document.createElement("div");
            w.appendChild(this.createCard(p));
            wrap.appendChild(w);
          });
          this.innerHTML = "";
          this.appendChild(wrap);
        }
        const payload = {
          source,
          source_value: sourceValue,
          title: str(res.title),
          data: items,
          pagination: res.pagination || {},
        };
        if (window.salla?.event?.dispatch)
          window.salla.event.dispatch(
            "salla-products-list::products.fetched",
            payload,
          );
        return res;
      } catch (e) {
        this.innerHTML = `<div class="vtdr-error">${str(e?.message || "Failed to load products")}</div>`;
        throw e;
      }
    }
  }

  class VtdrProductsSlider extends HTMLElement {
    connectedCallback() {
      if (this.__connected) return;
      this.__connected = true;
      ensureBaseStyle();
      const list = document.createElement("salla-products-list");
      const source = str(this.getAttribute("source") || "latest");
      const sourceValue = str(this.getAttribute("source-value"));
      list.setAttribute("source", source);
      if (sourceValue) list.setAttribute("source-value", sourceValue);
      if (this.hasAttribute("product-card-component"))
        list.setAttribute(
          "product-card-component",
          this.getAttribute("product-card-component"),
        );
      if (this.hasAttribute("row-cards")) list.setAttribute("row-cards", "");
      if (this.hasAttribute("shadow-on-hover"))
        list.setAttribute("shadow-on-hover", "");
      this.innerHTML = "";
      this.appendChild(list);
    }
  }

  class VtdrMenu extends HTMLElement {
    connectedCallback() {
      if (this.__connected) return;
      this.__connected = true;
      ensureBaseStyle();
      this.reload();
    }
    async reload() {
      try {
        ensureComponentApi();
        const source = str(this.getAttribute("source") || "header") || "header";
        const res = await window.salla.api.component.getMenus({ source });
        const items = arr(res.data);
        if (!items.length) {
          this.innerHTML = "";
          return;
        }
        const build = (node) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = str(node?.url || "#") || "#";
          a.textContent = str(node?.title || "Link") || "Link";
          li.appendChild(a);
          const children = arr(node?.children);
          if (children.length) {
            const ul = document.createElement("ul");
            children.forEach((c) => ul.appendChild(build(c)));
            li.appendChild(ul);
          }
          return li;
        };
        const ul = document.createElement("ul");
        ul.className = "vtdr-menu";
        items.forEach((item) => ul.appendChild(build(item)));
        this.innerHTML = "";
        this.appendChild(ul);
      } catch {
        this.innerHTML = "";
      }
    }
  }

  try {
    ensureComponentApi();
    if (!customElements.get("salla-products-list"))
      customElements.define("salla-products-list", VtdrProductsList);
    if (!customElements.get("salla-products-slider"))
      customElements.define("salla-products-slider", VtdrProductsSlider);
    if (!customElements.get("salla-menu"))
      customElements.define("salla-menu", VtdrMenu);
  } catch (e) {
    console.error("[VTDR Fallback] init failed", e);
  }
})();
