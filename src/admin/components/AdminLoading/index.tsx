import { Spinner, Container, Text } from "./styles";

interface AdminLoadingProps {
  text?: string;
}

export function AdminLoading({ text = "Carregando..." }: AdminLoadingProps) {
  return (
    <Container>
      <Spinner />
      <Text>{text}</Text>
    </Container>
  );
}
