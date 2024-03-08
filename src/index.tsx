import { renderToReadableStream } from "react-dom/server";
import { buildStyles } from "./styles/buildStyles";
import fs from "fs/promises";
import { App } from "./App";
import { buildRoutes } from "./routes/buildRoutes";
import { apiRoutes, webRoutes } from "./routes";

// clear dist folder
await fs.rm("./dist", { recursive: true, force: true });
await buildRoutes();
await buildStyles();

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const route = webRoutes.find((route) => route.path === pathname);
    if (route) {
      const formmated = route?.component.name
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .slice(1);
      console.log(formmated);
      return new Response(
        await renderToReadableStream(
          <App>
            <route.component />
          </App>,
          { bootstrapScripts: [`./js/${formmated}.js`] }
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

    if (pathname.startsWith("/api/user/")) {
      const id = pathname.split("/").pop();
      const match = apiRoutes.find((route) => {
        const routePath = route.path.replace(/\/:id/, "");
        return routePath === pathname.replace(/\/\d+/, "");
      });
      if (match) {
        return match.handler(request, { id: id! });
      }

      return new Response("Not found", { status: 404 });
    }

    if (pathname.startsWith("/js/")) {
      const file = await fs.readFile(
        `./dist/pages/${pathname.replace("/js/", "")}`,
        "utf-8"
      );
      return new Response(file, {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
