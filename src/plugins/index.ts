import { Elysia } from "elysia";

/**
 * Plugin para logging de requests
 */
export const logger = new Elysia({ name: "logger" })
  .derive(() => {
    const start = Date.now();
    return { start };
  })
  .onAfterHandle(({ request, start, set }) => {
    const duration = Date.now() - start;
    const status = Number(set.status) || 200;
    const method = request.method;
    const url = new URL(request.url).pathname;

    // Color coding for different status codes
    const statusColor =
      status >= 500
        ? "\x1b[31m" // Red for 5xx
        : status >= 400
        ? "\x1b[33m" // Yellow for 4xx
        : status >= 300
        ? "\x1b[36m" // Cyan for 3xx
        : "\x1b[32m"; // Green for 2xx

    const reset = "\x1b[0m";

    console.log(
      `${statusColor}${method}${reset} ${url} ${statusColor}${status}${reset} - ${duration}ms`
    );
  });

/**
 * Plugin para manejo de errores global
 */
export const errorHandler = new Elysia({ name: "error-handler" }).onError(
  ({ code, error, set }) => {
    console.error("❌ Error:", error);

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: "Not Found",
        message: "The requested resource was not found",
        statusCode: 404,
      };
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: "Validation Error",
        message: error.message,
        statusCode: 400,
      };
    }

    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = 500;
      return {
        error: "Internal Server Error",
        message:
          process.env.NODE_ENV === "production"
            ? "An unexpected error occurred"
            : error.message,
        statusCode: 500,
      };
    }

    set.status = 500;
    return {
      error: "Unknown Error",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : (error as Error).message || "Unknown error",
      statusCode: 500,
    };
  }
);

/**
 * Plugin para security headers
 */
export const securityHeaders = new Elysia({
  name: "security-headers",
}).onAfterHandle(({ set }) => {
  set.headers["X-Frame-Options"] = "DENY";
  set.headers["X-Content-Type-Options"] = "nosniff";
  set.headers["X-XSS-Protection"] = "1; mode=block";
  set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
  set.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";
  
  if (process.env.NODE_ENV === "production") {
    set.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  }
});

/**
 * Plugin para CORS
 */
export const cors = (options: {
  origin?: string | string[];
  credentials?: boolean;
} = {}) => {
  const { origin = "*", credentials = false } = options;

  return new Elysia({ name: "cors" })
    .onBeforeHandle(({ request, set }) => {
      const requestOrigin = request.headers.get("origin") || "";

      // Handle preflight
      if (request.method === "OPTIONS") {
        set.status = 204;
        set.headers["Access-Control-Allow-Origin"] =
          Array.isArray(origin) && origin.includes(requestOrigin)
            ? requestOrigin
            : typeof origin === "string"
            ? origin
            : requestOrigin;
        set.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        set.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
        
        if (credentials) {
          set.headers["Access-Control-Allow-Credentials"] = "true";
        }
        
        return new Response(null, { status: 204 });
      }
      
      return undefined;
    })
    .onAfterHandle(({ request, set }) => {
      const requestOrigin = request.headers.get("origin") || "";
      set.headers["Access-Control-Allow-Origin"] =
        Array.isArray(origin) && origin.includes(requestOrigin)
          ? requestOrigin
          : typeof origin === "string"
          ? origin
          : requestOrigin;
      
      if (credentials) {
        set.headers["Access-Control-Allow-Credentials"] = "true";
      }
    });
};

/**
 * Plugin para compression
 */
export const compression = new Elysia({ name: "compression" }).onAfterHandle(
  ({ set, response }) => {
    // Bun automatically handles compression, but we can add headers
    if (
      process.env.NODE_ENV === "production" &&
      typeof response === "string" &&
      response.length > 1024
    ) {
      set.headers["Vary"] = "Accept-Encoding";
    }
  }
);
