export const apiRoutes = [
  {
    path: "/api",
    handler: async () => {
      return new Response("Hello from api");
    },
  },
  {
    path: "/api/user/:id",
    handler: async (request: Request, params: { id: string }) => {
      return new Response(`Hello user with id ${params.id}`);
    },
  },
];
