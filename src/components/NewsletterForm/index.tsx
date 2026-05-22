import { useState } from "react";
import { Container, Form, Input, MainInputWrapper, TextArea } from "./styles";
import { Button } from "../Button";

interface INewsletterFormProps {
  type: "single" | "middle" | "complete";
  size?: "small" | "larger";
}

export function NewsletterForm({
  type,
  size = "larger",
}: INewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Email enviado:", email);
    // aqui depois você chama sua API
    setEmail("");
    setName("");
    setLastName("");
  }

  return (
    <Container size={size}>
      <h3>Assine nossa newsletter</h3>

      <Form onSubmit={handleSubmit}>
        <MainInputWrapper>
          {(type === "middle" || type === "complete") && (
            <Input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {(type === "middle" || type === "complete") && (
            <Input
              type="text"
              placeholder="Seu sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          )}
          <Input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {type === "complete" && <TextArea placeholder="Sua mensagem..." />}
        </MainInputWrapper>
        <Button title="Assinar" type="submit" />
      </Form>
    </Container>
  );
}
