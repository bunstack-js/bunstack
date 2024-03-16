import { renderToReadableStream } from "react-dom/server";
import { App } from "../App";
import Home from "@/pages/Home";
import type { Controller } from "./Controller";

export const aboutController: Controller = async (req) => {
  return new Response(
    await renderToReadableStream(
      <App>
        <Home />
      </App>,
      {
        bootstrapScripts: ["js/about"],
      }
    ),
    {
      headers: { "Content-Type": "text/html" },
    }
  );
};
