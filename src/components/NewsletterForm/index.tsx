import { useState } from "react";
import { Container, Form, MainInputWrapper } from "./styles";
import { AdminInput } from "../../admin/components/AdminInput";
import { AdminTextarea } from "../../admin/components/AdminTextarea";
import { AdminButton } from "../../admin/components/AdminButton";

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
      <h3>Receba nossas novidades</h3>
      {/* <p>
        Conteúdos, pesquisas e novidades do grupo diretamente no seu e-mail.
      </p> */}

      <Form onSubmit={handleSubmit}>
        <MainInputWrapper>
          {(type === "middle" || type === "complete") && (
            <AdminInput
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {(type === "middle" || type === "complete") && (
            <AdminInput
              type="text"
              placeholder="Seu sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          )}
          <AdminInput
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {type === "complete" && (
            <AdminTextarea placeholder="Sua mensagem..." />
          )}
        </MainInputWrapper>
        <AdminButton size="large" type="submit">
          Quero receber
        </AdminButton>
      </Form>
    </Container>
  );
}
