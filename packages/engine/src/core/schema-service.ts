import * as fs from "fs/promises";
import * as path from "path";

export interface SchemaMetadata {
  filters: Record<string, any>;
  functions: Record<string, any>;
  components: string[];
  hooks: string[];
  models: Record<string, any>;
}

export class SchemaService {
  private metadata: SchemaMetadata | null = null;
  private dataDir: string;

  constructor() {
    // Path to the metadata provided by the user
    this.dataDir = path.join(process.cwd(), "temp_twilight_ext", "data");
  }

  public async initialize() {
    if (this.metadata) return;

    try {
      const sallaJsonDir = path.join(this.dataDir, "SallaJson");

      const [filters, functions, components, hooks] = await Promise.all([
        this.loadJson(path.join(sallaJsonDir, "hover", "salla.filters.json")),
        this.loadJson(path.join(sallaJsonDir, "hover", "salla.functions.json")),
        this.loadJson(path.join(sallaJsonDir, "components.json")),
        this.loadJson(path.join(sallaJsonDir, "hooks.json")),
      ]);

      const models: Record<string, any> = {};
      const modalsDir = path.join(sallaJsonDir, "modals.twig");
      const modalFiles = await fs.readdir(modalsDir);

      for (const file of modalFiles) {
        if (file.endsWith(".json")) {
          const modelName = path.basename(file, ".json");
          models[modelName] = await this.loadJson(path.join(modalsDir, file));
        }
      }

      this.metadata = {
        filters,
        functions,
        components: Array.isArray(components) ? components : [],
        hooks: Array.isArray(hooks) ? hooks : [],
        models,
      };

      console.log(
        `[SchemaService] Initialized with ${Object.keys(models).length} models, ${Object.keys(filters).length} filters, and ${Object.keys(functions).length} functions.`,
      );
    } catch (error) {
      console.error("[SchemaService] Failed to initialize metadata:", error);
      // Provide empty defaults on error to avoid crashing
      this.metadata = {
        filters: {},
        functions: {},
        components: [],
        hooks: [],
        models: {},
      };
    }
  }

  private async loadJson(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      console.warn(
        `[SchemaService] Failed to load JSON from ${filePath}:`,
        error,
      );
      return {};
    }
  }

  public getMetadata(): SchemaMetadata {
    return (
      this.metadata || {
        filters: {},
        functions: {},
        components: [],
        hooks: [],
        models: {},
      }
    );
  }

  public getModelSchema(modelName: string): any {
    return this.metadata?.models[modelName] || null;
  }
}
