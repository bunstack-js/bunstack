import { buildStyles } from "./styles/buildStyles";
import { Elysia } from "elysia";
import {
  aboutController,
  clientController,
  indexController,
  loginController,
  stylesController,
} from "./controllers";
import { buildRoutes } from "./routes/buildRoutes";
import {
  logger,
  errorHandler,
  securityHeaders,
  compression,
} from "./plugins";

const isDev = process.env.NODE_ENV !== "production";

const app = new Elysia()
  // Apply plugins
  .use(logger)
  .use(errorHandler)
  .use(securityHeaders)
  .use(compression)
  // Routes
  .get("/", indexController)
  .get("/about", aboutController)
  .get("/login", loginController)
  .get("/styles.css", stylesController)
  .get("/js/:page", clientController)
  // Startup
  .onStart(async ({ server }) => {
    console.log("🔨 Building routes and styles...");
    await Promise.all([buildRoutes(), buildStyles()]);
    console.log(
      `\n🚀 BunStack is running!\n   ${server?.url || "http://localhost:3000"}\n   Environment: ${isDev ? "development" : "production"}\n`
    );
  })
  .listen(3000);

// Export type for type-safe client (if needed with Eden Treaty)
export type App = typeof app;
