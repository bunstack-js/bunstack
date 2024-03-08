import { routes } from "../routes";
import fs from "fs/promises";
export const buildRoutes = async () => {
  for (const route of routes) {
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

    // change component name -> HomePage -> home-page, AboutPage -> about-page

    await Bun.build({
      entrypoints: routes.map((route) => `./src/generated/${formmated}.tsx`),
      target: "browser",
      minify: {
        identifiers: true,
        syntax: true,
        whitespace: true,
      },
      outdir: "./dist/pages",
    });
  }
};
