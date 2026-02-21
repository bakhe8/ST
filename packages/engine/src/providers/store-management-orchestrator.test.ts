import { describe, expect, it, vi } from "vitest";
import { StoreManagementOrchestrator } from "./store-management-orchestrator.js";

describe("StoreManagementOrchestrator", () => {
  it("validates settings payload before update", async () => {
    const orchestrator = new StoreManagementOrchestrator(
      {
        listStores: vi.fn(),
        createStore: vi.fn(),
        cloneStore: vi.fn(),
        updateStore: vi.fn(),
        deleteStore: vi.fn(),
      } as any,
      {
        promoteToMaster: vi.fn(),
        inheritFrom: vi.fn(),
        updateSettings: vi.fn(),
        clearDataEntities: vi.fn(),
      } as any,
      { seedStoreData: vi.fn() } as any,
      { syncStoreData: vi.fn() } as any,
    );

    const result = await orchestrator.updateSettings("store-1", null);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
    }
  });

  it("validates sync payload before executing synchronization", async () => {
    const orchestrator = new StoreManagementOrchestrator(
      {
        listStores: vi.fn(),
        createStore: vi.fn(),
        cloneStore: vi.fn(),
        updateStore: vi.fn(),
        deleteStore: vi.fn(),
      } as any,
      {
        promoteToMaster: vi.fn(),
        inheritFrom: vi.fn(),
        updateSettings: vi.fn(),
        clearDataEntities: vi.fn(),
      } as any,
      { seedStoreData: vi.fn() } as any,
      { syncStoreData: vi.fn() } as any,
    );

    const result = await orchestrator.syncStore("store-1", "");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
    }
  });

  it("returns deterministic success message on clear data", async () => {
    const storeLogic = {
      promoteToMaster: vi.fn(),
      inheritFrom: vi.fn(),
      updateSettings: vi.fn(),
      clearDataEntities: vi.fn().mockResolvedValue(undefined),
    } as any;

    const orchestrator = new StoreManagementOrchestrator(
      {
        listStores: vi.fn(),
        createStore: vi.fn(),
        cloneStore: vi.fn(),
        updateStore: vi.fn(),
        deleteStore: vi.fn(),
      } as any,
      storeLogic,
      { seedStoreData: vi.fn() } as any,
      { syncStoreData: vi.fn() } as any,
    );

    const result = await orchestrator.clearStoreData("store-1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.message).toBe("Store data cleared");
    }
  });

  it("allows binding a theme when capability gate returns fail and exposes diagnostics in observe mode", async () => {
    const storeFactory = {
      listStores: vi.fn(),
      createStore: vi.fn(),
      cloneStore: vi.fn(),
      updateStore: vi
        .fn()
        .mockResolvedValue({ id: "store-1", themeId: "theme-failing" }),
      deleteStore: vi.fn(),
    } as any;

    const storeLogic = {
      getStore: vi
        .fn()
        .mockResolvedValue({
          id: "store-1",
          themeId: "theme-a",
          themeVersionId: "ver-a",
        }),
      promoteToMaster: vi.fn(),
      inheritFrom: vi.fn(),
      updateSettings: vi.fn(),
      clearDataEntities: vi.fn(),
    } as any;

    const themeRepo = {
      getById: vi.fn().mockResolvedValue({
        id: "theme-failing",
        versions: [
          {
            id: "theme-failing-ver-1",
            version: "1.0.0",
            contractJson: JSON.stringify({
              name: "Failing Theme",
              version: "1.0.0",
              components: [],
            }),
          },
        ],
      }),
    } as any;

    const sallaValidator = {
      evaluateThemeComponentCapability: vi.fn().mockReturnValue({
        overallStatus: "fail",
        missingCorePages: ["home", "product-list"],
      }),
      evaluateThemeAnchorProbe: vi.fn().mockResolvedValue({
        overallStatus: "warning",
        missingAnchorPoints: ["home.main-banner"],
      }),
    } as any;

    const orchestrator = new StoreManagementOrchestrator(
      storeFactory,
      storeLogic,
      { seedStoreData: vi.fn() } as any,
      { syncStoreData: vi.fn() } as any,
      themeRepo,
      sallaValidator,
    );

    const result = await orchestrator.updateStore("store-1", {
      themeId: "theme-failing",
      themeVersionId: "theme-failing-ver-1",
    });

    expect(storeFactory.updateStore).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: "store-1",
      themeId: "theme-failing",
      themeAdmission: {
        mode: "observe",
        overallStatus: "fail",
        capability: {
          overallStatus: "fail",
        },
      },
    });
  });

  it("allows binding a theme when capability gate is warning and continues update", async () => {
    const storeFactory = {
      listStores: vi.fn(),
      createStore: vi.fn(),
      cloneStore: vi.fn(),
      updateStore: vi
        .fn()
        .mockResolvedValue({ id: "store-1", themeId: "theme-warning" }),
      deleteStore: vi.fn(),
    } as any;

    const storeLogic = {
      getStore: vi
        .fn()
        .mockResolvedValue({
          id: "store-1",
          themeId: "theme-a",
          themeVersionId: "ver-a",
        }),
      promoteToMaster: vi.fn(),
      inheritFrom: vi.fn(),
      updateSettings: vi.fn(),
      clearDataEntities: vi.fn(),
    } as any;

    const themeRepo = {
      getById: vi.fn().mockResolvedValue({
        id: "theme-warning",
        versions: [
          {
            id: "theme-warning-ver-1",
            version: "1.0.0",
            contractJson: JSON.stringify({
              name: "Warning Theme",
              version: "1.0.0",
              components: [{ path: "home.slider" }],
            }),
          },
        ],
      }),
    } as any;

    const sallaValidator = {
      evaluateThemeComponentCapability: vi.fn().mockReturnValue({
        overallStatus: "warning",
        missingCorePages: ["product-list"],
      }),
      evaluateThemeAnchorProbe: vi.fn().mockResolvedValue({
        overallStatus: "pass",
        missingAnchorPoints: [],
      }),
    } as any;

    const orchestrator = new StoreManagementOrchestrator(
      storeFactory,
      storeLogic,
      { seedStoreData: vi.fn() } as any,
      { syncStoreData: vi.fn() } as any,
      themeRepo,
      sallaValidator,
    );

    const result = await orchestrator.updateStore("store-1", {
      themeId: "theme-warning",
      themeVersionId: "theme-warning-ver-1",
    });

    expect(storeFactory.updateStore).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: "store-1",
      themeId: "theme-warning",
      themeAdmission: {
        mode: "observe",
        overallStatus: "warning",
      },
    });
  });
});
