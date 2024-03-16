import { buildStyles } from "./styles/buildStyles";
import fs from "fs/promises";
import type { Server } from "bun";

import { Elysia, t } from "elysia";
import { indexController } from "./controllers/indexController";
import { aboutController } from "./controllers/aboutController";
import { loginController } from "./controllers/loginController";
import { stylesController } from "./controllers/stylesController";
import { buildRoutes } from "./routes/buildRoutes";

export interface Controller {
  (req: Request): Promise<Response>;
}

try {
  new Elysia()

    .get("/", indexController)
    // get ./chunk#hash.js
    .get("/about", aboutController)
    .get("/login", loginController)
    .get("/styles.css", stylesController)

    .get(
      "/js/:page",
      async ({
        params: { page },
      }: {
        params: {
          page: string;
        };
      }) => {
        const week = 60 * 60 * 24 * 7;
        return new Response(Bun.file(`./dist/pages/${page}.js`), {
          headers: {
            "Content-Type": "application/javascript",
            // 1week
            "Cache-Control":
              process.env.NODE_ENV === "production"
                ? `public, max-age=${week}, immutable`
                : "no-cache",
          },
        });
      }
    )
    .onStart(async ({ server }) => {
      // clear dist folder

      await buildRoutes();
      await buildStyles();
      console.info(
        `🚀 BunStack live on ${server?.url || "http://localhost:3000"}`
      );
    })
    .listen(3000);
} catch (error) {
  console.error(error);
}
