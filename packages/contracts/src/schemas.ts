import { z } from "zod";

/**
 * Schema for Store Branding configuration
 */
export const BrandingSchema = z
  .object({
    colors: z
      .object({
        primary: z
          .string()
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
          .describe("Primary color in hex format")
          .optional(),
        secondary: z
          .string()
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
          .describe("Secondary color in hex format")
          .optional(),
        text: z
          .string()
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
          .optional(),
        background: z
          .string()
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
          .optional(),
      })
      .optional(),
    logo: z
      .union([
        z.string().url(),
        z.object({ url: z.string().url(), alt: z.string().optional() }),
      ])
      .optional(),
    favicon: z.string().url().optional(),
    fonts: z.array(z.string()).optional(),
    typography: z
      .object({
        heading: z.string().optional(),
        body: z.string().optional(),
      })
      .optional(),
  })
  .strict();

/**
 * Schema for Store Settings configuration
 */
export const StoreSettingsSchema = z
  .object({
    maintenance_mode: z.boolean().default(false),
    tax_enabled: z.boolean().default(true),
    currency_display: z.enum(["symbol", "code"]).default("symbol"),
    default_language: z.string().length(2).default("ar"),
    timezone: z.string().default("Asia/Riyadh"),
    social_links: z
      .object({
        twitter: z.string().url().optional(),
        instagram: z.string().url().optional(),
        facebook: z.string().url().optional(),
        snapchat: z.string().url().optional(),
        tiktok: z.string().url().optional(),
        whatsapp: z.string().optional(),
      })
      .optional(),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .strict();

export type Branding = z.infer<typeof BrandingSchema>;
export type StoreSettings = z.infer<typeof StoreSettingsSchema>;
