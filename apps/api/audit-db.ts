import { PrismaClient } from "@vtdr/data";
import { BrandingSchema, StoreSettingsSchema } from "@vtdr/contracts";

const prisma = new PrismaClient();

async function runAudit() {
  console.log("🚀 Starting Final Architectural Audit...");
  console.log(
    `📂 Connecting to: ${process.env.DATABASE_URL || "Default from Schema"}\n`,
  );

  const results = {
    stores: 0,
    dataEntities: 0,
    orphans: 0,
    invalidJson: 0,
    errors: [] as string[],
  };

  try {
    // 1. Store Check
    const stores = await prisma.store.findMany();
    results.stores = stores.length;
    console.log(`📊 Found ${stores.length} stores.`);

    for (const store of stores) {
      console.log(`\n  Checking Store: ${store.title} (${store.id})`);

      // Validate Branding JSON
      try {
        if (store.brandingJson) {
          BrandingSchema.parse(JSON.parse(store.brandingJson));
        }
      } catch (e: any) {
        results.invalidJson++;
        results.errors.push(
          `[Store ${store.id}] Invalid brandingJson: ${e.message}`,
        );
        console.error(`  ❌ Invalid brandingJson`);
      }

      // Validate Settings JSON
      try {
        if (store.settingsJson) {
          StoreSettingsSchema.parse(JSON.parse(store.settingsJson));
        }
      } catch (e: any) {
        results.invalidJson++;
        results.errors.push(
          `[Store ${store.id}] Invalid settingsJson: ${e.message}`,
        );
        console.error(`  ❌ Invalid settingsJson`);
      }
    }

    // 2. Orphan Check (DataEntities)
    const dataEntities = await prisma.dataEntity.findMany();
    results.dataEntities = dataEntities.length;

    const storeIds = new Set(stores.map((s) => s.id));
    const orphanEntities = dataEntities.filter(
      (de) => !storeIds.has(de.storeId),
    );

    if (orphanEntities.length > 0) {
      results.orphans += orphanEntities.length;
      results.errors.push(
        `Found ${orphanEntities.length} orphan DataEntities.`,
      );
      console.error(`\n❌ Found ${orphanEntities.length} orphan DataEntities!`);
    } else {
      console.log(`\n✅ No orphan DataEntities found.`);
    }

    // 3. Summary
    console.log("\n--- Audit Summary ---");
    console.log(`Total Stores: ${results.stores}`);
    console.log(`Total Entities: ${results.dataEntities}`);
    console.log(`Invalid JSON: ${results.invalidJson}`);
    console.log(`Orphans Found: ${results.orphans}`);

    if (results.errors.length > 0) {
      console.log("\n🛑 Audit Failed with Critical Errors:");
      results.errors.forEach((err) => console.log(` - ${err}`));
      process.exit(1);
    } else {
      console.log("\n✨ Audit Passed: System is structurally sound.");
    }
  } catch (error: any) {
    console.error("💥 Audit Crashed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAudit();
