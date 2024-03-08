import { exec } from "child_process";
import { promises as fs } from "fs";

export async function buildStyles() {
  const command = "bun tailwindcss -i ./src/styles.css -o ./dist/styles.css";
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
