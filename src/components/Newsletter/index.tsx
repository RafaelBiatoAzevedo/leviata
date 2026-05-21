import { useState } from "react";
import { Container, Form, Input, MainInputWrapper } from "./styles";
import { Button } from "../Button";

interface INewsletterProps {
  isFormComplete?: boolean;
}

export function Newsletter({ isFormComplete = true }: INewsletterProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setlastName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Email enviado:", email);
    // aqui depois você chama sua API
    setEmail("");
    setName("");
    setlastName("");
  }

  return (
    <Container>
      <h3>Assine nossa newsletter</h3>

      <Form onSubmit={handleSubmit}>
        <MainInputWrapper>
          {isFormComplete && (
            <Input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          {isFormComplete && (
            <Input
              type="text"
              placeholder="Seu sobrenome"
              value={lastName}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <Input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </MainInputWrapper>
        <Button title="Assinar" type="submit" />
      </Form>
    </Container>
  );
}
