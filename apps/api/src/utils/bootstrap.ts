import { execSync } from "child_process";
import * as net from "net";

export async function bootstrapGuard(port: number) {
  console.warn(`[BOOTSTRAP] Starting System Health Guard...`);

  // 1. Check Port Availability
  const isPortBusy = await checkPort(port);
  if (isPortBusy) {
    console.error(`[BOOTSTRAP_CRITICAL] Port ${port} is already in use.`);
    console.error(
      `[BOOTSTRAP_HELP] This usually means a zombie Node.js process is running.`,
    );
    console.error(
      `[BOOTSTRAP_HELP] Run: taskkill /F /IM node.exe /T to clear it.`,
    );
    process.exit(1);
  }

  // 2. Check Monorepo Dependency Links
  try {
    const enginePath = "./node_modules/@vtdr/engine/package.json";
    const fs = await import("fs");
    if (fs.existsSync(enginePath)) {
      const pkg = JSON.parse(fs.readFileSync(enginePath, "utf8"));
      console.warn(
        `[BOOTSTRAP] Engine Link Verified: ${pkg.name}@${pkg.version}`,
      );
    }
  } catch (e) {
    console.error(
      `[BOOTSTRAP_WARNING] Could not verify Engine link. Build may be unstable.`,
    );
  }

  console.warn(`[BOOTSTRAP] Health Check Passed. Booting Server...`);
}

function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    server.once("listening", () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}
