import { StoreLogic } from "../core/store-logic.js";
import https from "https";
import http from "http";
import { URL } from "url";

export class SynchronizationService {
  constructor(private simulationLogic: StoreLogic) {}

  /**
   * Synchronizes a store with data from a live Salla store
   */
  public async syncStoreData(storeId: string, storeUrl: string, tx?: any) {
    const info = this.extractStoreInfo(storeUrl);
    if (!info) {
      throw new Error("Invalid Salla store URL");
    }

    console.log(`[Sync] Starting sync for: ${info.baseUrl}`);

    // 1. Clear existing data entities
    await this.simulationLogic.clearDataEntities(storeId, tx);

    // 2. Fetch Categories
    const categories = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/categories`,
    );
    for (const category of categories) {
      await this.simulationLogic.createDataEntity(
        storeId,
        "category",
        category,
        tx,
      );
    }

    // 3. Fetch Products
    const products = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/products`,
    );
    for (const product of products) {
      // Fetch variants and tags for each product
      const [variants, tags] = await Promise.all([
        this.fetchSallaData(
          `${info.baseUrl}/api/v1/products/${product.id}/variants`,
        ),
        this.fetchSallaData(
          `${info.baseUrl}/api/v1/products/${product.id}/tags`,
        ),
      ]);
      product.variants = variants;
      product.tags = tags;
      await this.simulationLogic.createDataEntity(
        storeId,
        "product",
        product,
        tx,
      );
    }

    // 4. Fetch Store Info
    const storeInfoResults = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/store/info`,
    );
    const storeInfo = storeInfoResults[0] || {
      id: info.identifier,
      name: info.identifier,
      domain: info.baseUrl,
    };

    // 5. Fetch Branches
    const branches = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/branches`,
    );
    storeInfo.branches = branches;

    // 6. Fetch Taxes
    const taxes = await this.fetchSallaData(`${info.baseUrl}/api/v1/taxes`);
    storeInfo.taxes = taxes;

    // 7. Fetch Shipping
    const shipping = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/shipping`,
    );
    storeInfo.shipping = shipping;

    // 8. Fetch Currencies
    const currencies = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/currencies`,
    );
    storeInfo.currencies = currencies;

    // 9. Fetch Languages
    const languages = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/languages`,
    );
    storeInfo.languages = languages;

    await this.simulationLogic.createDataEntity(
      storeId,
      "store",
      storeInfo,
      tx,
    );

    // 10. Fetch Orders (Merchant API v2)
    // Note: For local mock, it handles /api/v2/orders.
    // For real Salla, it would be https://api.salla.dev/admin/v2/orders
    const ordersUrl = info.baseUrl.includes("localhost")
      ? `${info.baseUrl}/api/v2/orders`
      : `https://api.salla.dev/admin/v2/orders`;

    const orders = await this.fetchSallaData(ordersUrl);
    for (const order of orders) {
      await this.simulationLogic.createDataEntity(storeId, "order", order, tx);
    }

    // 11. Fetch Option Templates
    const templates = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/products/options/templates`,
    );
    for (const template of templates) {
      await (this.simulationLogic as any).createDataEntity(
        storeId,
        "optionTemplate",
        template,
        tx,
      );
    }

    // 12. Fetch Special Offers
    const offers = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/marketing/special-offers`,
    );
    for (const offer of offers) {
      await (this.simulationLogic as any).createDataEntity(
        storeId,
        "specialOffer",
        offer,
        tx,
      );
    }

    // 13. Fetch Affiliates
    const affiliates = await this.fetchSallaData(
      `${info.baseUrl}/api/v1/marketing/affiliates`,
    );
    for (const affiliate of affiliates) {
      await (this.simulationLogic as any).createDataEntity(
        storeId,
        "affiliate",
        affiliate,
        tx,
      );
    }

    return {
      products: products.length,
      categories: categories.length,
      store: storeInfo.name || info.identifier,
      branches: branches.length,
      currencies: currencies.length,
      orders: orders.length,
      templates: templates.length,
      specialOffers: offers.length,
    };
  }

  private extractStoreInfo(
    url: string,
  ): { identifier: string; baseUrl: string } | null {
    try {
      // Clean URL: Remove trailing slash, etc.
      const cleanUrl = url.replace(/\/$/, "");
      const parsed = new URL(cleanUrl);
      const hostname = parsed.hostname;

      // Priority 0: localhost/127.0.0.1 (For local testing)
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        const parts = parsed.pathname.split("/").filter((p) => p);
        const identifier = parts[0] || "local-store";
        return {
          identifier,
          baseUrl: `${parsed.protocol}//${parsed.host}/${identifier}`,
        };
      }

      // Priority 1: salla.sa/subdomain (More reliable in restricted DNS envs)
      if (hostname === "salla.sa") {
        const parts = parsed.pathname.split("/").filter((p) => p);
        if (parts[0]) {
          return {
            identifier: parts[0],
            baseUrl: `https://salla.sa/${parts[0]}`,
          };
        }
      }

      // Priority 2: subdomain.salla.sa
      if (hostname.endsWith(".salla.sa")) {
        const identifier = hostname.replace(".salla.sa", "");
        return { identifier, baseUrl: `https://salla.sa/${identifier}` }; // Normalize to path-based
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  private fetchSallaData(url: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      console.log(`[Sync] Fetching: ${url}`);
      const protocol = url.startsWith("https") ? https : http;
      protocol
        .get(
          url,
          {
            headers: {
              Accept: "application/json",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          },
          (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              if (
                res.statusCode &&
                res.statusCode >= 200 &&
                res.statusCode < 300
              ) {
                try {
                  const json = JSON.parse(data);
                  resolve(json.data || []);
                } catch (e) {
                  console.error(`[Sync] JSON Parse Error for ${url}:`, e);
                  console.error(
                    `[Sync] Response body (truncated): ${data.substring(0, 200)}`,
                  );
                  resolve([]);
                }
              } else {
                console.warn(
                  `[Sync] Non-200 Response for ${url}: ${res.statusCode}`,
                );
                resolve([]);
              }
            });
          },
        )
        .on("error", (err) => {
          console.error(`[Sync] HTTPS Error for ${url}:`, err.message);
          reject(err);
        });
    });
  }
}
