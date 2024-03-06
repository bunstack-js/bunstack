import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(`🚀 BunStack is running at ${app.server?.url}`);
