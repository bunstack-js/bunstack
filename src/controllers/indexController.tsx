import { renderToReadableStream } from "react-dom/server";
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
        bootstrapScripts: ["js/home"],
      }
    ),
    {
      headers: { "Content-Type": "text/html" },
    }
  );
};
