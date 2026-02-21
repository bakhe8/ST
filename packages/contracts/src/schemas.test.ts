import { describe, expect, it } from "vitest";
import { BrandingSchema, StoreSettingsSchema } from "./schemas.js";

describe("contracts/schemas", () => {
  it("accepts valid branding payload", () => {
    const parsed = BrandingSchema.parse({
      colors: {
        primary: "#21636d",
        secondary: "#10b981",
      },
      logo: "https://example.com/logo.png",
    });

    expect(parsed.colors?.primary).toBe("#21636d");
  });

  it("rejects unknown branding keys (strict mode)", () => {
    expect(() =>
      BrandingSchema.parse({
        unsupported: true,
      }),
    ).toThrow();
  });

  it("fills default store settings values", () => {
    const parsed = StoreSettingsSchema.parse({});
    expect(parsed.maintenance_mode).toBe(false);
    expect(parsed.tax_enabled).toBe(true);
    expect(parsed.currency_display).toBe("symbol");
  });
});
