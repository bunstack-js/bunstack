import { exec } from "child_process";

export async function buildStyles() {
  const command =
    "bun tailwindcss -i ./src/styles/styles.css -o ./dist/styles.css";
  return await new Promise((resolve, reject) => {
    exec(command, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Styles built successfully");
      }
    });
  });
}
