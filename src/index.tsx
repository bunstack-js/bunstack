import { renderToReadableStream } from "react-dom/server";
import { buildStyles } from "./core/buildStyles";
import fs from "fs/promises";
import { Button } from "./components/ui/button";

const App = () => (
  <html>
    <head>
      <title>Hello, world!</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body className="bg-black">
      <h1>Hello, world!</h1>
      <Button onClick={() => alert("Client working")}>Click me</Button>
    </body>
  </html>
);

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (pathname === "/") {
      return new Response(await renderToReadableStream(<App />), {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (pathname === "/styles.css") {
      if (
        process.env.NODE_ENV === "development" ||
        !(await fs.stat("./dist/styles.css").catch(() => false))
      ) {
        await buildStyles();
      }
      const styles = await fs.readFile("./dist/styles.css", "utf-8");
      return new Response(styles, {
        headers: { "Content-Type": "text/css" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
