import { afterEach, describe, expect, it } from "vitest";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { SallaValidator } from "./salla-validator.js";
import type { TwilightSchema } from "@vtdr/contracts";

const createThemeScaffold = async (): Promise<string> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "vtdr-theme-meta-"));
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
    "<html></html>",
    "utf8",
  );
  await fs.writeFile(
    path.join(dir, "src", "views", "pages", "index.twig"),
    "<div>home</div>",
    "utf8",
  );
  return dir;
};

describe("SallaValidator metadata review rules", () => {
  const cleanupPaths: string[] = [];

  afterEach(async () => {
    while (cleanupPaths.length > 0) {
      const target = cleanupPaths.pop();
      if (!target) continue;
      await fs.rm(target, { recursive: true, force: true });
    }
  });

  it("passes metadata readiness rules when theme metadata is complete", async () => {
    const themePath = await createThemeScaffold();
    cleanupPaths.push(themePath);

    const schema = {
      name: "Theme A",
      version: "1.0.0",
      author: "VTDR",
      description: { ar: "وصف", en: "Description" },
      author_email: "support@example.com",
      repository: "https://github.com/example/theme-a",
    } as unknown as TwilightSchema;

    const validator = new SallaValidator();
    const report = await validator.validateTheme(themePath, schema);

    const metadataRules = report.rules.filter((rule) =>
      rule.id.startsWith("metadata-"),
    );
    expect(metadataRules).toHaveLength(3);
    expect(metadataRules.every((rule) => rule.status === "pass")).toBe(true);
  });

  it("flags missing metadata as warning and invalid metadata links as fail", async () => {
    const themePath = await createThemeScaffold();
    cleanupPaths.push(themePath);

    const schema = {
      name: "Theme B",
      version: "1.0.0",
      author: "VTDR",
      repository: "not-a-valid-url",
    } as unknown as TwilightSchema;

    const validator = new SallaValidator();
    const report = await validator.validateTheme(themePath, schema);

    const descriptionRule = report.rules.find(
      (rule) => rule.title === "Theme Description Metadata",
    );
    const supportRule = report.rules.find(
      (rule) => rule.title === "Theme Support Metadata",
    );
    const linksRule = report.rules.find(
      (rule) => rule.title === "Theme Links Metadata",
    );

    expect(descriptionRule?.status).toBe("warning");
    expect(supportRule?.status).toBe("warning");
    expect(linksRule?.status).toBe("fail");
  });
});
