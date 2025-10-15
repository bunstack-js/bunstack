import { renderToReadableStream } from "react-dom/server.browser";
import { App } from "../App";
import type { Controller } from "./Controller";
import Home from "@/pages/Home";

export const indexController: Controller = async (req) => {
  return new Response(
    await renderToReadableStream(
      <App>
        <Home />
      </App>,
      {
        bootstrapScripts: ["/js/home"],
      }
    ),
    {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control":
          process.env.NODE_ENV === "production"
            ? `public, max-age=${60 * 60 * 24 * 7}`
            : "no-cache",
      },
    }
  );
};
