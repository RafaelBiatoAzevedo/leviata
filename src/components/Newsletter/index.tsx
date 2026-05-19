import { useState } from "react";
import { Container, Form, Input } from "./styles";
import { Button } from "../Button";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Email enviado:", email);
    // aqui depois você chama sua API
    setEmail("");
  }

  return (
    <Container>
      <h3>Assine nossa newsletter</h3>

      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button title="Assinar" type="submit" />
      </Form>
    </Container>
  );
}
