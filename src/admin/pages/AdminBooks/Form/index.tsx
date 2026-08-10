import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { Container } from "./styles";

export function BookForm() {
  const navigate = useNavigate();

  // const { showToast } = useToast();

  const { slug } = useParams();

  const isEdit = Boolean(slug);

  // showToast({
  //   title: "Capa atualizada com sucesso",
  //   description: "A capa do livro foi atualizada.",
  //   type: "success",
  // });

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar livro" : "Nova livro"}
        subtitle="Cadastre ou atualize os dados do livro."
      />
    </Container>
  );
}
