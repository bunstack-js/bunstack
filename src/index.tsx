import { renderToReadableStream } from "react-dom/server";
import { buildStyles } from "./styles/buildStyles";
import fs from "fs/promises";
import { App } from "./App";
import { buildRoutes } from "./routes/buildRoutes";
import { apiRoutes, webRoutes } from "./routes";
import type { Server } from "bun";

// clear dist folder
await fs.rm("./dist", { recursive: true, force: true });
await buildRoutes();
await buildStyles();

import { Elysia, t } from "elysia";
import { Home } from "./pages/Home";

new Elysia()
  .get("/", async (req) => {
    return new Response(
      await renderToReadableStream(
        <App>
          <Home />
        </App>,
        {
          bootstrapScripts: ["js/home"],
        }
      ),
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  })
  .get("/about", async (req) => {
    return new Response(
      await renderToReadableStream(
        <App>
          <Home />
        </App>,
        {
          bootstrapScripts: ["js/about"],
        }
      ),
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  })

  .get("/styles.css", async (req) => {
    return new Response(Bun.file("./dist/styles.css"), {
      headers: {
        "Content-Type": "text/css",
      },
    });
  })

  .get("/js/:page", async (req) => {
    const page = req.params.page;
    console.log(page);
    const week = 60 * 60 * 24 * 7;
    return new Response(Bun.file(`./dist/pages/${req.params.page}.js`), {
      headers: {
        "Content-Type": "application/javascript",
        // 1week
        "Cache-Control":
          process.env.NODE_ENV === "production"
            ? `public, max-age=${week}, immutable`
            : "no-cache",
      },
    });
  })
  .onStart(async () => {
    console.info(
      `🚀 BunStack live on ${
        process.env.NODE_ENV === "production"
          ? "https://bunstack.com"
          : "http://localhost:3000"
      }`
    );
  })
  .listen(3000);
