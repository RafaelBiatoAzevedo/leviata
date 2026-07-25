import { useState } from "react";
import {
  Container,
  Card,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Input,
  Footer,
} from "./styles";

import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/Button";
import { login } from "../../../services/auth";
import { useAuth } from "../../../hooks/useAuth";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    const data = { email, password };

    try {
      const response = await login(data);

      signIn(response);

      navigate("/admin", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);

        // toast.error(error.message);
      } else {
        console.error("Erro inesperado.");

        // toast.error("Erro inesperado.");
      }
    }
  }

  return (
    <Container>
      <Card>
        <Title>Leviatã e o Cativeiro</Title>

        <Subtitle>Painel Administrativo</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label>E-mail</label>

            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <label>Senha</label>

            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>

          <Button type="submit" title="Entrar" />
        </Form>

        <Footer>
          © {new Date().getFullYear()} Grupo de Pesquisa Leviatã e o Cativeiro
        </Footer>
      </Card>
    </Container>
  );
}
