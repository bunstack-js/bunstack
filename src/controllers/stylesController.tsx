import type { Controller } from "./Controller";

export const stylesController: Controller = async (req) => {
  return new Response(Bun.file("./dist/styles.css"), {
    headers: {
      "Content-Type": "text/css",
      // 1week
      "Cache-Control":
        process.env.NODE_ENV === "production"
          ? "public, max-age=604800, immutable"
          : "no-cache",
    },
  });
};
