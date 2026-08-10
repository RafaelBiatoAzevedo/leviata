import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import {
  Container,
  Header,
  HeaderActions,
  Title,
  // PhotoWrapper,
  // Photo,
  // Name,
  // Subtitle,
} from "./styles";
import { useNavigate, useParams } from "react-router-dom";

export function BookView() {
  const navigate = useNavigate();

  const { slug } = useParams();

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton onClick={() => navigate(`/admin/livros/${slug}/editar`)}>
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Livro</Title>
      </Header>
    </Container>
  );
}
