import { renderToReadableStream } from "react-dom/server.browser";
import { App } from "../App";
import About from "@/pages/About";
import type { Controller } from "./Controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const aboutController: Controller = async () => {
  const scriptUrl = "/js/about";
  
  const stream = await renderToReadableStream(
    <App title="About - BunStack" preloadScripts={[scriptUrl]}>
      <ErrorBoundary>
        <About />
      </ErrorBoundary>
    </App>,
    {
      bootstrapScripts: [scriptUrl],
      onError(error) {
        console.error("SSR Error:", error);
      },
    }
  );

  await stream.allReady;

  return new Response(stream, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control":
        process.env.NODE_ENV === "production"
          ? "public, max-age=604800, stale-while-revalidate=86400"
          : "no-cache, no-store, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
