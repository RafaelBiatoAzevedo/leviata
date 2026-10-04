import { AdminPagination } from "../../../components/AdminPagination";
import { AdminError } from "../../../components/AdminError";
import { useAdminList } from "../../../hooks/useAdminList";
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
import { useState } from "react";
import type { ArticleResponseDto } from "../../../dtos/articles/ArticleResponseDto";
import { articlesService } from "../../../services/articles";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminTable } from "../../../components/AdminTable";
import { articlesTypeOptions } from "../../../utils/articleTypes";
import { articleTypeLabels } from "../../../types/TArticleType";

export function AdminArticles() {
  const navigate = useNavigate();

  const { showToast } = useToast();
  const { showModal } = useModal();

  const [search, setSearch] = useState("");

  const [articleType, setArticleType] = useState("");

  const articleTypesFilterOptions = [
    { value: "", label: "Todos" },

    ...articlesTypeOptions,
  ];

  const { items, loading, error, load, pagination } = useAdminList(
    articlesService.getPage,
    { search: search.trim() || undefined, type: articleType || undefined },
  );

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

        load();
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

      {error && <AdminError>{error}</AdminError>}
      <AdminTable>
        <thead>
          <tr>
            <th>Capa</th>
            <th>Título</th>
            <th>Tipo</th>
            <th>Volume</th>
            <th>Ano</th>
            <th>Publicação</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            items.map((article) => (
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

                <td>
                  <strong>{article.title}</strong>

                  <br />

                  <small>{article.slug}</small>
                </td>

                <td>{articleTypeLabels[article.type]}</td>

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
      <AdminPagination {...pagination} />

      {!loading && !error && items.length === 0 && (
        <Empty>Nenhum artigo ou dossiê encontrado.</Empty>
      )}
    </Container>
  );
}
