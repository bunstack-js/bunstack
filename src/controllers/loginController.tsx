import { renderToReadableStream } from "react-dom/server.browser";
import { App } from "../App";
import Login from "../pages/Login";
import type { Controller } from "./Controller";

export const loginController: Controller = async (req) => {
  return new Response(
    await renderToReadableStream(
      <App>
        <Login />
      </App>,
      {
        bootstrapScripts: ["/js/login"],
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
