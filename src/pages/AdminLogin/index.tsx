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
import { Button } from "../../components/Button";
import { storageKeys } from "../../constants/storageKeys";
import { useNavigate } from "react-router-dom";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    localStorage.setItem(storageKeys.TOKEN_KEY, "ghsdsssdgshdshdhsg");
    navigate("/admin", { replace: true });

    // TODO
    // const response = await authService.login({ email, password })
    // localStorage.setItem("access_token", response.accessToken)
    // navigate("/admin")
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
