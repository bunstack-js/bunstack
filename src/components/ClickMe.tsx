import { Button } from "./ui/button";

export const ClickMe = ({ from = "Client" }) => {
  return (
    <Button onClick={() => alert("Client working fine")}>
      Click me from {from}
    </Button>
  );
};
