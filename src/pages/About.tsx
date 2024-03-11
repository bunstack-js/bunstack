import { ClickMe } from "../components/click-me.button";

export function About() {
  return (
    <main>
      <h1>About</h1>
      <ClickMe from="About" />
      <a href="/">Home</a>
    </main>
  );
}
