export type AppProps = {
  children: React.ReactNode;
};
export const App = (props: AppProps) => (
  <html>
    <head>
      <title>Hello, world!</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body className="bg-black text-white">
      <div id="app">{props.children}</div>
    </body>
  </html>
);
