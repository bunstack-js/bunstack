import type { Context } from "elysia";

export interface Controller {
  (context: Context): Promise<Response> | Response;
}
