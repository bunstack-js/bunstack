import fs from "fs/promises";
import { webRoutes } from "./web.routes";
export const buildRoutes = async () => {
  // create dist/pages folder
  await fs.mkdir("./dist/pages", { recursive: true });

  for (const route of webRoutes) {
    // change component name -> HomePage -> home-page, AboutPage -> about-page
    const formmated = route?.component.name
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .slice(1);
    // create client tsx
    const client = `import { createRoot } from "react-dom/client";
  import ${route?.component.name} from "../pages/${route?.component.name}";
  const root = createRoot(document.getElementById("app")!);
  root.render(<${route?.component.name} />);`.replace(/\n/g, "");

    await fs.writeFile(`./src/generated/${formmated}.tsx`, client);

    const result = await Bun.build({
      entrypoints: webRoutes.map(
        (route) => `./src/generated/${route?.component.name}.tsx`
      ),
      target: "browser",
      minify: true,
      outdir: "./dist/pages",
      external: ["react"],
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
