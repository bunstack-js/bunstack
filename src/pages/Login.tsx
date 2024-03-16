import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <main className="flex flex-col items-center justify-center h-full gap-4">
      <h1>Login</h1>
      <form className="flex flex-col gap-4">
        <Input type="text" placeholder="Username" />
        <Input type="password" placeholder="Password" />
        <Button type="submit">Login</Button>
      </form>
    </main>
  );
}
