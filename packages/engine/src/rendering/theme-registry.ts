import {
  ThemeMetadata,
  ThemeVersion,
  TwilightSchema,
  IThemeRepository,
} from "@vtdr/contracts";

export class ThemeRegistry {
  constructor(private themeRepo: IThemeRepository) {}

  public async registerTheme(metadata: ThemeMetadata) {
    return this.themeRepo.upsert(metadata);
  }

  public async addVersion(
    themeId: string,
    versionNumber: string,
    fsPath: string,
    schema: TwilightSchema,
  ) {
    return this.themeRepo.addVersion(themeId, versionNumber, fsPath, schema);
  }

  public async syncTheme(
    metadata: ThemeMetadata,
    schema: TwilightSchema,
    fsPath: string,
  ) {
    const theme = await this.registerTheme(metadata);

    // Check if version exists
    const existingVersion = await this.themeRepo.findVersion(
      theme.id,
      metadata.version,
    );

    if (!existingVersion) {
      await this.addVersion(theme.id, metadata.version, fsPath, schema);
    }

    return theme;
  }

  public async getTheme(id: string) {
    return this.themeRepo.getById(id);
  }

  public async listThemes() {
    return this.themeRepo.listAll();
  }
}
