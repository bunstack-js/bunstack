/// <reference types="bun-types" />

import fs from "fs/promises";
import { webRoutes } from "./web.routes";
export const buildRoutes = async () => {
  // create dist/pages folder
  try {
    await fs.rm("./dist/pages", { recursive: true, force: true });
  } catch (error) {
    // Ignore error if directory doesn't exist
  }

  await fs.mkdir("./dist/pages", { recursive: true });

  for (const route of webRoutes) {
    // change component name -> HomePage -> home-page, AboutPage -> about-page
    const formmated = route?.component.name
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .slice(1);
    // create client tsx with hydrateRoot for SSR
    const client = `/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { hydrateRoot } from "react-dom/client";
import ${route?.component.name} from "../pages/${route?.component.name}";

const appElement = document.getElementById("app");
if (appElement) {
  hydrateRoot(appElement, <${route?.component.name} />);
}`;

    await fs.writeFile(`./src/generated/${formmated}.tsx`, client);

    const result = await Bun.build({
      entrypoints: [`./src/generated/${formmated}.tsx`],
      target: "browser",
      minify: true,
      outdir: "./dist/pages",
    });

    if (!result.success) {
      console.error("Build failed");
      for (const message of result.logs) {
        // Bun will pretty print the message object
        console.error(message);
      }
    }
  }
};
