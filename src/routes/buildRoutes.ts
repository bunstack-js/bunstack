/// <reference types="bun-types" />

import fs from "fs/promises";
import { webRoutes } from "./web.routes";
import crypto from "crypto";

// Cache for build hashes
const buildCache = new Map<string, string>();

/**
 * Generate hash for cache busting
 */
function generateHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 8);
}

/**
 * Check if rebuild is needed
 */
async function needsRebuild(
  componentName: string,
  sourceFile: string
): Promise<boolean> {
  try {
    const content = await fs.readFile(sourceFile, "utf-8");
    const hash = generateHash(content);
    const cachedHash = buildCache.get(componentName);

    if (cachedHash === hash) {
      return false;
    }

    buildCache.set(componentName, hash);
    return true;
  } catch {
    return true;
  }
}

export const buildRoutes = async () => {
  const isDev = process.env.NODE_ENV !== "production";

  // Create dist/pages folder
  try {
    await fs.rm("./dist/pages", { recursive: true, force: true });
  } catch (error) {
    // Ignore error if directory doesn't exist
  }

  await fs.mkdir("./dist/pages", { recursive: true });

  const buildPromises = webRoutes.map(async (route) => {
    // Change component name -> HomePage -> home-page, AboutPage -> about-page
    const formatted = route?.component.name
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .slice(1);

    const sourcePath = `./src/pages/${route?.component.name}.tsx`;

    // Check if rebuild is needed (only in dev)
    if (isDev && !(await needsRebuild(route.component.name, sourcePath))) {
      console.log(`⚡ Skipping ${route.component.name} (cached)`);
      return;
    }

    // Create client tsx with hydrateRoot for SSR
    const client = `/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { hydrateRoot } from "react-dom/client";
import { ErrorBoundary } from "../components/ErrorBoundary";
import ${route?.component.name} from "../pages/${route?.component.name}";

const appElement = document.getElementById("app");
if (appElement) {
  hydrateRoot(
    appElement, 
    <ErrorBoundary>
      <${route?.component.name} />
    </ErrorBoundary>
  );
}`;

    await fs.writeFile(`./src/generated/${formatted}.tsx`, client);

    const result = await Bun.build({
      entrypoints: [`./src/generated/${formatted}.tsx`],
      target: "browser",
      minify: !isDev,
      sourcemap: isDev ? "inline" : "none",
      splitting: true,
      outdir: "./dist/pages",
      naming: isDev ? "[dir]/[name].js" : "[dir]/[name].[hash].js",
    });

    if (!result.success) {
      console.error(`❌ Build failed for ${route.component.name}`);
      for (const message of result.logs) {
        console.error(message);
      }
      throw new Error(`Build failed for ${route.component.name}`);
    }

    console.log(`✅ Built ${route.component.name}`);
  });

  await Promise.all(buildPromises);
  console.log("🎉 All routes built successfully");
};
