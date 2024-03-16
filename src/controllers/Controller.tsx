export interface Controller {
  (req: Request): Promise<Response>;
}
