import { routes } from "../routes";
import fs from "fs/promises";
export const buildRoutes = async () => {
  for (const route of routes) {
    // create client tsx
    const client = `import { createRoot } from "react-dom/client";
  import { ${route?.component.name} } from "../pages/${route?.component.name}";
  const root = createRoot(document.getElementById("app")!);
  root.render(<${route?.component.name} />);`;
    // create directory if not exists
    await fs.mkdir("./src/generated", { recursive: true });
    await fs.writeFile(
      `./src/generated/client${route?.component.name}.tsx`,
      client
    );

    await Bun.build({
      entrypoints: routes.map(
        (route) => `./src/generated/client${route?.component.name}.tsx`
      ),
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
