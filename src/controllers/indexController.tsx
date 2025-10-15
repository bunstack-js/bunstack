import { renderToReadableStream } from "react-dom/server.browser";
import { App } from "../App";
import type { Controller } from "./Controller";
import Home from "@/pages/Home";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const indexController: Controller = async () => {
  const scriptUrl = "/js/home";
  
  const stream = await renderToReadableStream(
    <App title="Home - BunStack" preloadScripts={[scriptUrl]}>
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </App>,
    {
      bootstrapScripts: [scriptUrl],
      onError(error) {
        console.error("SSR Error:", error);
      },
    }
  );

  // Wait for suspense boundaries to resolve for better TTFB
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
