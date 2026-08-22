import { FiEdit2, FiEye, FiFolder, FiPlus, FiTrash2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import {
  Actions,
  Container,
  Cover,
  CoverPlaceholder,
  Empty,
  Filters,
  SelectWrapper,
} from "./styles";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import { useCallback, useEffect, useState } from "react";
import type { ArticleResponseDto } from "../../../dtos/articles/ArticleResponseDto";
import { articlesService } from "../../../services/articles";
import { AdminSelect } from "../../../components/AdminSelect";
import {
  articleTypeLabels,
  articleTypesOptions,
} from "../../../utils/articleTypes";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminTable } from "../../../components/AdminTable";

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

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.slug.toLowerCase().includes(search.toLowerCase());

    const matchesArticleType =
      articleType === "" || article.type === articleType;

    return matchesSearch && matchesArticleType;
  });

  function handleDelete(article: ArticleResponseDto) {
    showModal({
      title: "Excluir artigo",

      content: <AdminDeleteContent title={article.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await articlesService.removeBySlug(article.slug);

        showToast({
          title: "Artigo excluído",
          description: `${article.title.toUpperCase()}`,
          type: "success",
        });

        await load();
      },

      onCancel: () => {
        console.log("Cancelou");
      },
    });
  }

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

      <AdminTable>
        <thead>
          <tr>
            <th>Capa</th>
            <th>Tipo</th>
            <th>Título</th>
            <th>Volume</th>
            <th>Ano</th>
            <th>Publicação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredArticles.map((article) => (
              <tr key={article.id}>
                <td>
                  {article.coverUrl ? (
                    <Cover src={article.coverUrl} alt={article.title} />
                  ) : (
                    <CoverPlaceholder>
                      <FiFolder />
                    </CoverPlaceholder>
                  )}
                </td>

                <td>{articleTypeLabels[article.type]}</td>

                <td>
                  <strong>{article.title}</strong>

                  <br />

                  <small>{article.slug}</small>
                </td>

                <td>{article.volume}</td>

                <td>{article.year}</td>

                <td>{article.journal}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() => navigate(`/admin/artigos/${article.slug}`)}
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/artigos/${article.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(article)}
                    >
                      <FiTrash2 />
                    </AdminIconButton>
                  </Actions>
                </td>
              </tr>
            ))}
        </tbody>
      </AdminTable>

      {!loading && filteredArticles.length === 0 && (
        <Empty>Nenhum artigo ou dossiê encontrado.</Empty>
      )}
    </Container>
  );
}
