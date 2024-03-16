import { ClickMe } from "../components/click-me.button";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <ClickMe from="Home" />
      <a href="/about">About</a>
    </main>
  );
}
