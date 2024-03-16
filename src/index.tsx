import { buildStyles } from "./styles/buildStyles";
import { Elysia } from "elysia";
import {
  aboutController,
  clientController,
  indexController,
  loginController,
  stylesController,
} from "./controllers";
import { buildRoutes } from "./routes/buildRoutes";

new Elysia()
  .get("/", indexController)
  .get("/about", aboutController)
  .get("/login", loginController)
  .get("/styles.css", stylesController)
  .get("/js/:page", clientController)
  .onStart(async ({ server }) => {
    await buildRoutes();
    await buildStyles();
    console.info(
      `🚀 BunStack live on ${server?.url || "http://localhost:3000"}`
    );
  })
  .listen(3000);
