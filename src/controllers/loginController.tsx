import { renderToReadableStream } from "react-dom/server";
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
        bootstrapScripts: ["js/login"],
      }
    ),
    {
      headers: { "Content-Type": "text/html" },
    }
  );
};
