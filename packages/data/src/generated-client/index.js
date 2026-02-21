Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
} = require("./runtime/library.js");

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
};

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.NotFoundError = NotFoundError;
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

const path = require("path");

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: "Serializable",
});

exports.Prisma.ThemeScalarFieldEnum = {
  id: "id",
  nameAr: "nameAr",
  nameEn: "nameEn",
  repository: "repository",
  authorEmail: "authorEmail",
  supportUrl: "supportUrl",
  descriptionAr: "descriptionAr",
  descriptionEn: "descriptionEn",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.ThemeVersionScalarFieldEnum = {
  id: "id",
  themeId: "themeId",
  version: "version",
  fsPath: "fsPath",
  contractJson: "contractJson",
  capabilitiesJson: "capabilitiesJson",
  schemaHash: "schemaHash",
  createdAt: "createdAt",
};

exports.Prisma.StoreScalarFieldEnum = {
  id: "id",
  title: "title",
  defaultLocale: "defaultLocale",
  defaultCurrency: "defaultCurrency",
  themeId: "themeId",
  themeVersionId: "themeVersionId",
  activePage: "activePage",
  viewport: "viewport",
  settingsJson: "settingsJson",
  themeSettingsJson: "themeSettingsJson",
  brandingJson: "brandingJson",
  isMaster: "isMaster",
  parentStoreId: "parentStoreId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.StoreStateScalarFieldEnum = {
  storeId: "storeId",
  themeId: "themeId",
  themeVersionId: "themeVersionId",
  activePage: "activePage",
  viewport: "viewport",
  settingsJson: "settingsJson",
  updatedAt: "updatedAt",
};

exports.Prisma.ComponentStateScalarFieldEnum = {
  id: "id",
  storeId: "storeId",
  componentPath: "componentPath",
  componentKey: "componentKey",
  instanceOrder: "instanceOrder",
  settingsJson: "settingsJson",
  visibilityJson: "visibilityJson",
  updatedAt: "updatedAt",
};

exports.Prisma.PageCompositionScalarFieldEnum = {
  id: "id",
  storeId: "storeId",
  page: "page",
  compositionJson: "compositionJson",
  updatedAt: "updatedAt",
};

exports.Prisma.DataEntityScalarFieldEnum = {
  id: "id",
  storeId: "storeId",
  entityType: "entityType",
  entityKey: "entityKey",
  payloadJson: "payloadJson",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.CollectionScalarFieldEnum = {
  id: "id",
  storeId: "storeId",
  name: "name",
  source: "source",
  rulesJson: "rulesJson",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

exports.Prisma.CollectionItemScalarFieldEnum = {
  collectionId: "collectionId",
  entityId: "entityId",
  sortOrder: "sortOrder",
};

exports.Prisma.DataBindingScalarFieldEnum = {
  id: "id",
  storeId: "storeId",
  componentPath: "componentPath",
  bindingKey: "bindingKey",
  sourceType: "sourceType",
  sourceRef: "sourceRef",
  bindingJson: "bindingJson",
  updatedAt: "updatedAt",
};

exports.Prisma.SnapshotScalarFieldEnum = {
  id: "id",
  storeId: "storeId",
  label: "label",
  snapshotJson: "snapshotJson",
  createdAt: "createdAt",
};

exports.Prisma.SortOrder = {
  asc: "asc",
  desc: "desc",
};

exports.Prisma.NullsOrder = {
  first: "first",
  last: "last",
};

exports.Prisma.ModelName = {
  Theme: "Theme",
  ThemeVersion: "ThemeVersion",
  Store: "Store",
  StoreState: "StoreState",
  ComponentState: "ComponentState",
  PageComposition: "PageComposition",
  DataEntity: "DataEntity",
  Collection: "Collection",
  CollectionItem: "CollectionItem",
  DataBinding: "DataBinding",
  Snapshot: "Snapshot",
};
/**
 * Create the Client
 */
const config = {
  generator: {
    name: "client",
    provider: {
      fromEnvVar: null,
      value: "prisma-client-js",
    },
    output: {
      value:
        "C:\\Users\\Bakheet\\Documents\\Projects\\ST\\packages\\data\\src\\generated-client",
      fromEnvVar: null,
    },
    config: {
      engineType: "library",
    },
    binaryTargets: [
      {
        fromEnvVar: null,
        value: "windows",
        native: true,
      },
    ],
    previewFeatures: [],
    sourceFilePath:
      "C:\\Users\\Bakheet\\Documents\\Projects\\ST\\packages\\data\\prisma\\schema.prisma",
    isCustomOutput: true,
  },
  relativeEnvPaths: {
    rootEnvPath: null,
    schemaEnvPath: "../../../../.env",
  },
  relativePath: "../../prisma",
  clientVersion: "5.22.0",
  engineVersion: "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  datasourceNames: ["db"],
  activeProvider: "sqlite",
  inlineDatasources: {
    db: {
      url: {
        fromEnvVar: "DATABASE_URL",
        value: null,
      },
    },
  },
  inlineSchema:
    'generator client {\n  provider = "prisma-client-js"\n  output   = "../src/generated-client"\n}\n\ndatasource db {\n  provider = "sqlite"\n  url      = env("DATABASE_URL")\n}\n\nmodel Theme {\n  id            String         @id\n  nameAr        String?\n  nameEn        String?\n  repository    String?\n  authorEmail   String?\n  supportUrl    String?\n  descriptionAr String?\n  descriptionEn String?\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n  storeStates   StoreState[]\n  versions      ThemeVersion[]\n  stores        Store[]\n}\n\nmodel ThemeVersion {\n  id               String       @id @default(uuid())\n  themeId          String\n  version          String\n  fsPath           String\n  contractJson     String\n  capabilitiesJson String?\n  schemaHash       String?\n  createdAt        DateTime     @default(now())\n  storeStates      StoreState[]\n  theme            Theme        @relation(fields: [themeId], references: [id])\n  stores           Store[]\n\n  @@unique([themeId, version])\n}\n\nmodel Store {\n  id                String       @id @default(uuid())\n  title             String\n  defaultLocale     String       @default("ar-SA")\n  defaultCurrency   String       @default("SAR")\n  themeId           String\n  themeVersionId    String\n  activePage        String       @default("home")\n  viewport          String       @default("desktop")\n  settingsJson      String       @default("{}")\n  themeSettingsJson String       @default("{}")\n  brandingJson      String?      @default("{}")\n  isMaster          Boolean      @default(false)\n  parentStoreId     String?\n  createdAt         DateTime     @default(now())\n  updatedAt         DateTime     @updatedAt\n  theme             Theme        @relation(fields: [themeId], references: [id])\n  themeVersion      ThemeVersion @relation(fields: [themeVersionId], references: [id])\n\n  // Directly linked content\n  collections      Collection[]\n  componentStates  ComponentState[]\n  dataBindings     DataBinding[]\n  dataEntities     DataEntity[]\n  pageCompositions PageComposition[]\n  snapshots        Snapshot[]\n  storeStates      StoreState[]\n}\n\nmodel StoreState {\n  storeId        String       @id\n  themeId        String\n  themeVersionId String\n  activePage     String       @default("home")\n  viewport       String       @default("desktop")\n  settingsJson   String\n  updatedAt      DateTime     @updatedAt\n  themeVersion   ThemeVersion @relation(fields: [themeVersionId], references: [id])\n  theme          Theme        @relation(fields: [themeId], references: [id])\n  store          Store        @relation(fields: [storeId], references: [id])\n}\n\nmodel ComponentState {\n  id             String   @id @default(uuid())\n  storeId        String\n  componentPath  String\n  componentKey   String?\n  instanceOrder  Int\n  settingsJson   String\n  visibilityJson String?\n  updatedAt      DateTime @updatedAt\n  store          Store    @relation(fields: [storeId], references: [id])\n\n  @@unique([storeId, componentPath, instanceOrder])\n}\n\nmodel PageComposition {\n  id              String   @id @default(uuid())\n  storeId         String\n  page            String\n  compositionJson String\n  updatedAt       DateTime @updatedAt\n  store           Store    @relation(fields: [storeId], references: [id])\n\n  @@unique([storeId, page])\n}\n\nmodel DataEntity {\n  id          String   @id @default(uuid())\n  storeId     String\n  entityType  String\n  entityKey   String?\n  payloadJson String\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n  store       Store    @relation(fields: [storeId], references: [id])\n\n  @@unique([storeId, entityType, entityKey])\n}\n\nmodel Collection {\n  id        String           @id @default(uuid())\n  storeId   String\n  name      String\n  source    String\n  rulesJson String?\n  createdAt DateTime         @default(now())\n  updatedAt DateTime         @updatedAt\n  store     Store            @relation(fields: [storeId], references: [id])\n  items     CollectionItem[]\n}\n\nmodel CollectionItem {\n  collectionId String\n  entityId     String\n  sortOrder    Int\n  collection   Collection @relation(fields: [collectionId], references: [id])\n\n  @@id([collectionId, entityId])\n}\n\nmodel DataBinding {\n  id            String   @id @default(uuid())\n  storeId       String\n  componentPath String\n  bindingKey    String\n  sourceType    String\n  sourceRef     String\n  bindingJson   String?\n  updatedAt     DateTime @updatedAt\n  store         Store    @relation(fields: [storeId], references: [id])\n}\n\nmodel Snapshot {\n  id           String   @id @default(uuid())\n  storeId      String\n  label        String\n  snapshotJson String\n  createdAt    DateTime @default(now())\n  store        Store    @relation(fields: [storeId], references: [id])\n}\n',
  inlineSchemaHash:
    "bca60a2a8fdb46b369ae6537ac018fb8f877815931074c1bc25ba97dfec32800",
  copyEngine: true,
};

const fs = require("fs");

config.dirname = __dirname;
if (!fs.existsSync(path.join(__dirname, "schema.prisma"))) {
  const alternativePaths = [
    "packages/data/src/generated-client",
    "data/src/generated-client",
  ];

  const alternativePath =
    alternativePaths.find((altPath) => {
      return fs.existsSync(path.join(process.cwd(), altPath, "schema.prisma"));
    }) ?? alternativePaths[0];

  config.dirname = path.join(process.cwd(), alternativePath);
  config.isBundled = true;
}

config.runtimeDataModel = JSON.parse(
  '{"models":{"Theme":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"nameAr","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"nameEn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"repository","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"authorEmail","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"supportUrl","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"descriptionAr","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"descriptionEn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"storeStates","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StoreState","relationName":"StoreStateToTheme","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"versions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ThemeVersion","relationName":"ThemeToThemeVersion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"stores","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"StoreToTheme","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ThemeVersion":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"themeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"version","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"fsPath","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"contractJson","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"capabilitiesJson","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"schemaHash","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"storeStates","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StoreState","relationName":"StoreStateToThemeVersion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"theme","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Theme","relationName":"ThemeToThemeVersion","relationFromFields":["themeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"stores","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"StoreToThemeVersion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["themeId","version"]],"uniqueIndexes":[{"name":null,"fields":["themeId","version"]}],"isGenerated":false},"Store":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"defaultLocale","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"ar-SA","isGenerated":false,"isUpdatedAt":false},{"name":"defaultCurrency","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"SAR","isGenerated":false,"isUpdatedAt":false},{"name":"themeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"themeVersionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"activePage","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"home","isGenerated":false,"isUpdatedAt":false},{"name":"viewport","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"desktop","isGenerated":false,"isUpdatedAt":false},{"name":"settingsJson","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"{}","isGenerated":false,"isUpdatedAt":false},{"name":"themeSettingsJson","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"{}","isGenerated":false,"isUpdatedAt":false},{"name":"brandingJson","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"{}","isGenerated":false,"isUpdatedAt":false},{"name":"isMaster","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"parentStoreId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"theme","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Theme","relationName":"StoreToTheme","relationFromFields":["themeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"themeVersion","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ThemeVersion","relationName":"StoreToThemeVersion","relationFromFields":["themeVersionId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"collections","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Collection","relationName":"CollectionToStore","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"componentStates","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ComponentState","relationName":"ComponentStateToStore","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"dataBindings","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DataBinding","relationName":"DataBindingToStore","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"dataEntities","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DataEntity","relationName":"DataEntityToStore","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"pageCompositions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PageComposition","relationName":"PageCompositionToStore","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"snapshots","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Snapshot","relationName":"SnapshotToStore","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"storeStates","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StoreState","relationName":"StoreToStoreState","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"StoreState":{"dbName":null,"fields":[{"name":"storeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"themeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"themeVersionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"activePage","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"home","isGenerated":false,"isUpdatedAt":false},{"name":"viewport","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"desktop","isGenerated":false,"isUpdatedAt":false},{"name":"settingsJson","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"themeVersion","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ThemeVersion","relationName":"StoreStateToThemeVersion","relationFromFields":["themeVersionId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"theme","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Theme","relationName":"StoreStateToTheme","relationFromFields":["themeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"store","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"StoreToStoreState","relationFromFields":["storeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ComponentState":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"storeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"componentPath","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"componentKey","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"instanceOrder","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"settingsJson","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"visibilityJson","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"store","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"ComponentStateToStore","relationFromFields":["storeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["storeId","componentPath","instanceOrder"]],"uniqueIndexes":[{"name":null,"fields":["storeId","componentPath","instanceOrder"]}],"isGenerated":false},"PageComposition":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"storeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"page","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"compositionJson","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"store","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"PageCompositionToStore","relationFromFields":["storeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["storeId","page"]],"uniqueIndexes":[{"name":null,"fields":["storeId","page"]}],"isGenerated":false},"DataEntity":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"storeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"entityType","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"entityKey","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"payloadJson","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"store","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"DataEntityToStore","relationFromFields":["storeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["storeId","entityType","entityKey"]],"uniqueIndexes":[{"name":null,"fields":["storeId","entityType","entityKey"]}],"isGenerated":false},"Collection":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"storeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"source","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"rulesJson","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"store","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"CollectionToStore","relationFromFields":["storeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CollectionItem","relationName":"CollectionToCollectionItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"CollectionItem":{"dbName":null,"fields":[{"name":"collectionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"entityId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sortOrder","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"collection","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Collection","relationName":"CollectionToCollectionItem","relationFromFields":["collectionId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":{"name":null,"fields":["collectionId","entityId"]},"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"DataBinding":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"storeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"componentPath","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"bindingKey","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sourceType","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sourceRef","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"bindingJson","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"store","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"DataBindingToStore","relationFromFields":["storeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Snapshot":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"storeId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"label","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"snapshotJson","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"store","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Store","relationName":"SnapshotToStore","relationFromFields":["storeId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}',
);
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.engineWasm = undefined;

const { warnEnvConflicts } = require("./runtime/library.js");

warnEnvConflicts({
  rootEnvPath:
    config.relativeEnvPaths.rootEnvPath &&
    path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
  schemaEnvPath:
    config.relativeEnvPaths.schemaEnvPath &&
    path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath),
});

const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(
  process.cwd(),
  "packages/data/src/generated-client/query_engine-windows.dll.node",
);
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "packages/data/src/generated-client/schema.prisma");
