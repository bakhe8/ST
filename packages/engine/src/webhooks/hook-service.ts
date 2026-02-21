export class HookService {
  private hooks: Map<string, string> = new Map();

  constructor() {
    // Register default hooks if any
  }

  public register(hookName: string, content: string) {
    this.hooks.set(hookName, content);
  }

  public resolve(hookName: string): string {
    return this.hooks.get(hookName) || "";
  }

  public getAll(): Record<string, string> {
    const obj: Record<string, string> = {};
    this.hooks.forEach((val, key) => (obj[key] = val));
    return obj;
  }

  public clear() {
    this.hooks.clear();
  }
}
