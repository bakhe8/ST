import { describe, expect, it, vi } from "vitest";
import { ThemeManagementOrchestrator } from "./theme-management-orchestrator.js";

describe("ThemeManagementOrchestrator", () => {
  it("discovers themes with registration and compatibility metadata", async () => {
    const themeRegistry = {
      listThemes: vi.fn().mockResolvedValue([{ id: "theme-a" }]),
      syncTheme: vi.fn(),
    } as any;
    const themeLoader = {
      scanThemes: vi.fn().mockResolvedValue(["theme-a"]),
      loadTwilightSchema: vi.fn().mockResolvedValue({ name: "A" }),
      extractMetadata: vi
        .fn()
        .mockReturnValue({ id: "theme-a", nameAr: "Theme A" }),
      getThemeChangeLog: vi
        .fn()
        .mockResolvedValue({ exists: false, entries: [] }),
    } as any;
    const sallaValidator = {
      validateTheme: vi.fn().mockResolvedValue({ status: "pass" }),
      evaluateThemeComponentCapability: vi
        .fn()
        .mockReturnValue({ overallStatus: "pass" }),
      evaluateThemeAnchorProbe: vi
        .fn()
        .mockResolvedValue({ overallStatus: "pass" }),
    } as any;

    const orchestrator = new ThemeManagementOrchestrator(
      themeRegistry,
      themeLoader,
      sallaValidator,
      "/themes",
    );

    const result = await orchestrator.discoverThemes();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "theme-a",
      folder: "theme-a",
      isRegistered: true,
    });
  });

  it("validates register payload and returns 400 on missing folder", async () => {
    const orchestrator = new ThemeManagementOrchestrator(
      { listThemes: vi.fn(), syncTheme: vi.fn() } as any,
      {
        scanThemes: vi.fn(),
        loadTwilightSchema: vi.fn(),
        extractMetadata: vi.fn(),
      } as any,
      {
        validateTheme: vi.fn(),
        evaluateThemeComponentCapability: vi.fn(),
        evaluateThemeAnchorProbe: vi.fn(),
      } as any,
      "/themes",
    );

    const result = await orchestrator.registerTheme("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
    }
  });

  it("returns synced count for sync operation", async () => {
    const themeRegistry = {
      listThemes: vi.fn(),
      syncTheme: vi.fn().mockResolvedValue({}),
    } as any;
    const themeLoader = {
      scanThemes: vi.fn().mockResolvedValue(["theme-a", "theme-b"]),
      loadTwilightSchema: vi.fn().mockResolvedValue({}),
      extractMetadata: vi.fn().mockReturnValue({}),
    } as any;

    const orchestrator = new ThemeManagementOrchestrator(
      themeRegistry,
      themeLoader,
      {
        validateTheme: vi.fn(),
        evaluateThemeComponentCapability: vi
          .fn()
          .mockReturnValue({ overallStatus: "warning" }),
        evaluateThemeAnchorProbe: vi
          .fn()
          .mockResolvedValue({ overallStatus: "pass" }),
      } as any,
      "/themes",
    );

    const result = await orchestrator.syncThemes();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.synced).toBe(2);
      expect(result.data.capabilityGate.overallStatus).toBe("warning");
      expect(result.data.capabilityGate.themes).toHaveLength(2);
      expect(result.data.capabilityGate.themes[0].overallStatus).toBe(
        "warning",
      );
    }
  });

  it("returns theme changelog when theme exists", async () => {
    const orchestrator = new ThemeManagementOrchestrator(
      {} as any,
      {
        loadTwilightSchema: vi
          .fn()
          .mockResolvedValue({ name: "Theme A", version: "1.0.0" }),
        extractMetadata: vi
          .fn()
          .mockReturnValue({
            id: "theme-a",
            name: "Theme A",
            version: "1.0.0",
          }),
        getThemeChangeLog: vi.fn().mockResolvedValue({
          themeId: "theme-a",
          exists: true,
          entries: [
            {
              title: "Release",
              date: "2026-02-21",
              items: ["Fixed preview parity"],
            },
          ],
        }),
      } as any,
      {} as any,
      "/themes",
    );

    const result = await orchestrator.getThemeChangeLog("theme-a");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.themeId).toBe("theme-a");
      expect(result.data.changeLog.exists).toBe(true);
      expect(result.data.changeLog.entries[0].title).toBe("Release");
    }
  });

  it("returns 404 changelog response when theme does not exist", async () => {
    const orchestrator = new ThemeManagementOrchestrator(
      {} as any,
      {
        loadTwilightSchema: vi.fn().mockResolvedValue(null),
        extractMetadata: vi.fn(),
        getThemeChangeLog: vi.fn(),
      } as any,
      {} as any,
      "/themes",
    );

    const result = await orchestrator.getThemeChangeLog("theme-missing");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(404);
    }
  });
});
