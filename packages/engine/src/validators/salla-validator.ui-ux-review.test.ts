import { afterEach, describe, expect, it } from "vitest";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { SallaValidator } from "./salla-validator.js";
import type { TwilightSchema } from "@vtdr/contracts";

const createThemeSkeleton = async (masterContent: string): Promise<string> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "vtdr-theme-uiux-"));
  await fs.mkdir(path.join(dir, "src", "views", "layouts"), {
    recursive: true,
  });
  await fs.mkdir(path.join(dir, "src", "views", "pages"), { recursive: true });
  await fs.mkdir(path.join(dir, "src", "locales"), { recursive: true });
  await fs.mkdir(path.join(dir, "src", "assets", "js"), { recursive: true });
  await fs.mkdir(path.join(dir, "src", "assets", "styles"), {
    recursive: true,
  });

  await fs.writeFile(
    path.join(dir, "src", "views", "layouts", "master.twig"),
    masterContent,
    "utf8",
  );
  await fs.writeFile(
    path.join(dir, "src", "views", "pages", "index.twig"),
    "<div>index</div>",
    "utf8",
  );
  return dir;
};

describe("SallaValidator UI/UX review rules", () => {
  const cleanupQueue: string[] = [];

  afterEach(async () => {
    while (cleanupQueue.length > 0) {
      const target = cleanupQueue.pop();
      if (!target) continue;
      await fs.rm(target, { recursive: true, force: true });
    }
  });

  it("passes UI/UX rules when master layout contains responsive and semantic anchors", async () => {
    const themePath = await createThemeSkeleton(`
<!doctype html>
<html dir="rtl">
<head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body><main id="main-content"></main></body>
</html>
`);
    cleanupQueue.push(themePath);

    const schema = {
      name: "Theme UI",
      version: "1.0.0",
      author: "VTDR",
    } as unknown as TwilightSchema;

    const report = await new SallaValidator().validateTheme(themePath, schema);
    const viewport = report.rules.find(
      (rule) => rule.title === "UI/UX Responsive Viewport",
    );
    const direction = report.rules.find(
      (rule) => rule.title === "UI/UX Direction Support",
    );
    const landmark = report.rules.find(
      (rule) => rule.title === "UI/UX Main Landmark",
    );

    expect(viewport?.status).toBe("pass");
    expect(direction?.status).toBe("pass");
    expect(landmark?.status).toBe("pass");
  });

  it("returns warning for missing viewport/dir/main anchors in master layout", async () => {
    const themePath = await createThemeSkeleton(
      "<html><head></head><body><div>no main</div></body></html>",
    );
    cleanupQueue.push(themePath);

    const schema = {
      name: "Theme UI Warning",
      version: "1.0.0",
      author: "VTDR",
    } as unknown as TwilightSchema;

    const report = await new SallaValidator().validateTheme(themePath, schema);
    const viewport = report.rules.find(
      (rule) => rule.title === "UI/UX Responsive Viewport",
    );
    const direction = report.rules.find(
      (rule) => rule.title === "UI/UX Direction Support",
    );
    const landmark = report.rules.find(
      (rule) => rule.title === "UI/UX Main Landmark",
    );

    expect(viewport?.status).toBe("warning");
    expect(direction?.status).toBe("warning");
    expect(landmark?.status).toBe("warning");
  });
});
