export type AppProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  preloadScripts?: string[];
};

export const App = (props: AppProps) => {
  const {
    children,
    title = "BunStack - Fast SSR Framework",
    description = "A modern, high-performance SSR framework built with Bun, Elysia, and React",
    preloadScripts = [],
  } = props;

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <title>{title}</title>

        {/* Preload critical resources */}
        <link rel="preload" href="/styles.css" as="style" />
        {preloadScripts.map((script) => (
          <link key={script} rel="modulepreload" href={script} />
        ))}

        {/* Stylesheets */}
        <link rel="stylesheet" href="/styles.css" />

        {/* Security Headers */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="dark bg-background text-foreground w-screen h-screen antialiased">
        <div id="app" className="w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
};
