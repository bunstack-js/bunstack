import fs from "fs/promises";
import UgifyJS from "uglify-js";

export const clientController = async ({
  params: { page },
}: {
  params: {
    page: string;
  };
}) => {
  const week = 60 * 60 * 24 * 7;

  const result = await fs.readFile(`./dist/pages/${page}.js`, "utf-8");
  const minified = UgifyJS.minify(result, {
    compress: {
      drop_console: true,
    },
  });
  return new Response(minified.code, {
    headers: {
      "Content-Type": "application/javascript",
      // 1week
      "Cache-Control":
        process.env.NODE_ENV === "production"
          ? `public, max-age=${week}`
          : "no-cache",
    },
  });
};
