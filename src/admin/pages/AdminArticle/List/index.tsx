import { FiPlus } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { Container, Filters, SelectWrapper } from "./styles";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import { useCallback, useState } from "react";
import type { ArticleResponseDto } from "../../../dto/articles/ArticleResponseDto";
import { articlesService } from "../../../services/articles";
import { AdminSelect } from "../../../components/AdminSelect";
import type { TArticleType } from "../../../types/TArticleType";
import { articleTypesOptions } from "../../../utils/articleTypes";

export function AdminArticles() {
  const navigate = useNavigate();

  const { showToast } = useToast();
  const { showModal } = useModal();

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [articleType, setArticleType] = useState("");

  const [articles, setArticles] = useState<ArticleResponseDto[]>([]);

  const articleTypesFilterOptions = [
    { value: "", label: "Todos" },

    ...articleTypesOptions,
  ];

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await articlesService.getAll();

      setArticles(response.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: "Ops! Lista não atualizada",
        description: `Não foi possível atualizar a lista.\n${message}`,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return (
    <Container>
      <AdminPageHeader
        title="Artigos e Dossiês"
        subtitle="Gerencie os Artigos e Dossiês cadastrados."
      >
        <AdminButton onClick={() => navigate("/admin/artigos/novo")}>
          <FiPlus />
          Novo Artigo
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar Artigos e dossiẽs..."
        />

        <SelectWrapper>
          <AdminSelect
            onChange={(e) => setArticleType(e.target.value)}
            options={articleTypesFilterOptions}
          ></AdminSelect>
        </SelectWrapper>
      </Filters>
    </Container>
  );
}
