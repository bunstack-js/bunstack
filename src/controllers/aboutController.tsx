import { renderToReadableStream } from "react-dom/server.browser";
import { App } from "../App";
import About from "@/pages/About";
import type { Controller } from "./Controller";

export const aboutController: Controller = async (req) => {
  return new Response(
    await renderToReadableStream(
      <App>
        <About />
      </App>,
      {
        bootstrapScripts: ["/js/about"],
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
