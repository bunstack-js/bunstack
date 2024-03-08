import { renderToReadableStream } from "react-dom/server";
import { buildStyles } from "./core/buildStyles";
import fs from "fs/promises";
import { Home } from "./pages/Home";
import { App } from "./App";
import { About } from "./pages/About";
import { routes } from "./routes";
import { buildRoutes } from "./core/buildRoutes";

await buildRoutes();
await buildStyles();

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const route = routes.find((route) => route.path === pathname);
    if (route) {
      return new Response(
        await renderToReadableStream(
          <App>
            <route.component />
          </App>
        ),
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    if (pathname === "/styles.css") {
      const styles = await fs.readFile("./dist/styles.css", "utf-8");
      return new Response(styles, {
        headers: { "Content-Type": "text/css" },
      });
    }

    if (pathname === "/client.js" && request.method === "GET") {
      // get url from request
      const referer = request.headers.get("Referer");
      const url = new URL(referer!);
      const path = url.pathname;
      const route = routes.find((route) => route.path === path);
      if (!route) {
        return new Response("Not found", { status: 404 });
      }
      const client = await fs.readFile(
        `./dist/pages/client${route.component.name}.js`,
        "utf-8"
      );
      return new Response(client, {
        headers: { "Content-Type": "text/javascript" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
