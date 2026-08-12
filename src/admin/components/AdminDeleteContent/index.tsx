import { Container, Warning, Message } from "./styles";

interface AdminConfirmContentProps {
  title: string;
}

export function AdminDeleteContent({ title }: AdminConfirmContentProps) {
  return (
    <Container>
      <Message>
        Tem certeza que deseja excluir <strong>{title}</strong>?
      </Message>

      <Warning>Esta ação não poderá ser desfeita.</Warning>
    </Container>
  );
}
