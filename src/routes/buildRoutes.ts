import fs from "fs/promises";
import { webRoutes } from "./web.routes";
export const buildRoutes = async () => {
  for (const route of webRoutes) {
    // change component name -> HomePage -> home-page, AboutPage -> about-page
    const formmated = route?.component.name
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .slice(1);
    // create client tsx
    const client = `import { createRoot } from "react-dom/client";
  import { ${route?.component.name} } from "../pages/${route?.component.name}";
  const root = createRoot(document.getElementById("app")!);
  root.render(<${route?.component.name} />);`.replace(/\n/g, "");
    // delete old generated files
    await fs.rm("./src/generated", { recursive: true, force: true });
    await fs.mkdir("./src/generated", { recursive: true });
    await fs.writeFile(`./src/generated/${formmated}.tsx`, client);

    await Bun.build({
      entrypoints: webRoutes.map((route) => `./src/generated/${formmated}.tsx`),
      target: "browser",
      minify: true,
      outdir: "./dist/pages",
    });
  }
};
