import { renderToReadableStream } from "react-dom/server.browser";
import { App } from "../App";
import Login from "../pages/Login";
import type { Controller } from "./Controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const loginController: Controller = async () => {
  const scriptUrl = "/js/login";
  
  const stream = await renderToReadableStream(
    <App title="Login - BunStack" preloadScripts={[scriptUrl]}>
      <ErrorBoundary>
        <Login />
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
