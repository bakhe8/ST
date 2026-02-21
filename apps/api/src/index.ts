import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import proxy from "express-http-proxy";

// 1. Guard Utility
import { bootstrapGuard } from "./utils/bootstrap.js";

// 2. Engine/Data Imports
import {
  ThemeRegistry,
  StoreLogic,
  ContentManager,
  CompositionEngine,
  ThemeLoader,
  StoreFactory,
  StoreManagementOrchestrator,
  SallaValidator,
  HookService,
  LocalizationService,
  SeederService,
  SynchronizationService,
  RendererService,
  SimulatorService,
  SimulatorAuthOrchestrator,
  ThemeManagementOrchestrator,
  PreviewRenderOrchestrator,
  SchemaService,
  WebhookService,
  LocalFileSystem,
} from "@vtdr/engine";

import {
  PrismaClient,
  PrismaStoreRepository,
  PrismaDataEntityRepository,
  PrismaThemeRepository,
  PrismaCollectionRepository,
  PrismaDataBindingRepository,
} from "@vtdr/data";

// 3. Service/Middleware Imports
import { ContextResolver } from "./services/context-resolver.js";
import { createContextMiddleware } from "./middlewares/context.middleware.js";
import { LocalThemeRuntimeAdapter } from "./providers/local-theme-runtime-adapter.js";

// 4. Route Factories
import { createStoreRoutes } from "./routes/store.routes.js";
import { createThemeRoutes } from "./routes/theme.routes.js";
import { createRuntimeRoutes } from "./routes/runtime.routes.js";
import { createSimulatorRoutes } from "./routes/simulator.routes.js";
import { createSystemRoutes } from "./routes/system.routes.js";
import { fail, ok } from "./utils/api-response.js";

// --- INITIALIZATION ---

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const port = Number(process.env.PORT || 3001);

// A. Bootstrap Guard (Ensures clean port and state)
await bootstrapGuard(port);

const app = express();
const prisma = new PrismaClient();

// B. Global Middlewares
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// C. Infrastructure Initialization
const fsAdapter = new LocalFileSystem();
const themesBaseDir = path.join(__dirname, "../../..", "packages", "themes");

if (!fs.existsSync(themesBaseDir)) {
  console.warn(`[SERVER_WARNING] themesBaseDir not found at: ${themesBaseDir}`);
  // Fallback if needed or just let it fail
}

// D. Repository Layer
const storeRepo = new PrismaStoreRepository(prisma as any);
const themeRepo = new PrismaThemeRepository(prisma as any);
const dataEntityRepo = new PrismaDataEntityRepository(prisma as any);
const collectionRepo = new PrismaCollectionRepository(prisma as any);
const dataBindingRepo = new PrismaDataBindingRepository(prisma as any);

// E. Core Logic Layer
const themeRegistry = new ThemeRegistry(themeRepo);
const contentManager = new ContentManager(
  dataEntityRepo,
  collectionRepo,
  dataBindingRepo,
);
const storeLogic = new StoreLogic(storeRepo, dataEntityRepo);

// F. Provider Layer (Structural Hardening)
const themeRuntimeAdapter = new LocalThemeRuntimeAdapter(themesBaseDir);
const contextResolver = new ContextResolver(storeLogic);

// G. Middleware Layer
const contextMiddleware = createContextMiddleware(contextResolver);

// H. Support Services
const themeLoader = new ThemeLoader(themesBaseDir, fsAdapter);
const seeder = new SeederService(storeLogic);
const synchronizer = new SynchronizationService(storeLogic);
const storeFactory = new StoreFactory(
  storeRepo,
  dataEntityRepo,
  themeRepo,
  seeder,
  synchronizer,
);
const sallaValidator = new SallaValidator();
const hookService = new HookService();
const localizationService = new LocalizationService();
const engine = new CompositionEngine(
  storeRepo,
  themeRegistry,
  contentManager,
  storeLogic,
  hookService,
  localizationService,
);
const schemaService = new SchemaService();
await schemaService.initialize();

const renderer = new RendererService(
  themesBaseDir,
  fsAdapter,
  schemaService,
  themeRuntimeAdapter,
);
const simulatorService = new SimulatorService(
  storeLogic,
  schemaService,
  themeRuntimeAdapter,
);
const webhookService = new WebhookService();
const simulatorAuthOrchestrator = new SimulatorAuthOrchestrator(
  storeLogic,
  webhookService,
);
const previewOrchestrator = new PreviewRenderOrchestrator(
  engine,
  renderer,
  storeLogic,
  themeRegistry,
  seeder,
);
const themeManagementOrchestrator = new ThemeManagementOrchestrator(
  themeRegistry,
  themeLoader,
  sallaValidator,
  themesBaseDir,
);
const storeManagementOrchestrator = new StoreManagementOrchestrator(
  storeFactory,
  storeLogic,
  seeder,
  synchronizer,
  themeRepo,
  sallaValidator,
);

// --- ROUTING LAYER ---

// 1. Health & Debug
app.get("/api/health", (req, res) =>
  ok(res, { vtdr: "active", timestamp: new Date().toISOString() }),
);
app.get("/api/debug/test", (req, res) =>
  ok(res, { message: "API is reachable" }),
);

// 2. Salla Assets Proxy
app.use(
  proxy("https://cdn.salla.network", {
    filter: (req) => req.method === "GET" && req.url.includes("/fonts/"),
    proxyReqPathResolver: (req) => {
      const parts = req.url.split("/fonts/");
      return "/fonts/" + parts[1];
    },
  }),
);

app.use("/themes", express.static(themesBaseDir));

// 3. API Sub-Router
const apiRouter = express.Router();

apiRouter.use(
  "/system",
  createSystemRoutes(themesBaseDir, previewOrchestrator),
);
apiRouter.use("/themes", createThemeRoutes(themeManagementOrchestrator));

const storeRoutes = createStoreRoutes(
  storeManagementOrchestrator,
  contextMiddleware,
);
apiRouter.use("/stores", storeRoutes);
apiRouter.use("/v1/stores", storeRoutes);
apiRouter.use(
  "/v1",
  contextMiddleware,
  createSimulatorRoutes(simulatorService, simulatorAuthOrchestrator),
);

app.use("/api", apiRouter);

// 4. 404 for API
app.use("/api", (req, res) => {
  return fail(res, 404, `API Route [${req.method} ${req.url}] not found.`);
});

// 5. Runtime Renderer (Greedy Matcher)
app.use("/", contextMiddleware, createRuntimeRoutes(previewOrchestrator));

// 6. Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("[FATAL ERROR]", err);
  const isApi = req.url.startsWith("/api");
  if (isApi || req.xhr || req.headers.accept?.includes("json")) {
    return fail(res, err.status || 500, err.message || "Internal Server Error");
  }
  res
    .status(err.status || 500)
    .send(`<h1>System Error</h1><p>${err.message}</p>`);
});

app.listen(port, () => {
  console.log(`[SERVER] VTDR API listening at http://localhost:${port}`);
});
