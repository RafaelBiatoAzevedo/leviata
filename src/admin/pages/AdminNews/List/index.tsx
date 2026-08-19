import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  Actions,
  Container,
  Cover,
  CoverPlaceholder,
  DescriptionCell,
  Empty,
  Filters,
  SelectWrapper,
} from "./styles";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import { newsService } from "../../../services/news";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import type { NewsResponseDto } from "../../../dto/news/NewsResponseDto";
import { BiNews } from "react-icons/bi";
import { formatDate } from "../../../utils/formatDate";
import { newsCategoryOptions } from "../../../utils/newsCategory";
import { AdminSelect } from "../../../components/AdminSelect";
import { newsCategoryLabels } from "../../../enums/NewsCategory";
import { AdminBadge } from "../../../components/AdminBadge";

export function AdminNews() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [loading, setLoading] = useState(true);

  const [news, setNews] = useState<NewsResponseDto[]>([]);

  const [category, setCategory] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsService.getAll();

      setNews(response.data);
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

  const filteredNews = news.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(search.toLowerCase()) ||
      news.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "" || news.category === category;

    return matchesSearch && matchesCategory;
  });

  function handleDelete(news: NewsResponseDto) {
    showModal({
      title: "Excluir notícia",

      content: <AdminDeleteContent title={news.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await newsService.removeBySlug(news.slug);

        showToast({
          title: "Notícia excluída",
          description: `${news.title.toUpperCase()}`,
          type: "success",
        });

        await load();
      },

      onCancel: () => {
        console.log("Cancelou");
      },
    });
  }

  const newsCategoriesFilterOptions = [
    { value: "", label: "Todas" },
    ...newsCategoryOptions,
  ];

  return (
    <Container>
      <AdminPageHeader
        title="Notícias"
        subtitle="Gerencie as notícias cadastradas."
      >
        <AdminButton onClick={() => navigate("/admin/noticias/novo")}>
          <FiPlus />
          Nova notícia
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar notícias..."
        />

        <SelectWrapper>
          <AdminSelect
            onChange={(e) => setCategory(e.target.value)}
            options={newsCategoriesFilterOptions}
          ></AdminSelect>
        </SelectWrapper>
      </Filters>

      <AdminTable>
        <thead>
          <tr>
            <th>Capa</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Data</th>
            <th>Categoria</th>
            <th>Interna</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredNews.map((news) => (
              <tr key={news.id}>
                <td>
                  {news.coverUrl ? (
                    <Cover src={news.coverUrl} alt={news.title} />
                  ) : (
                    <CoverPlaceholder>
                      <BiNews />
                    </CoverPlaceholder>
                  )}
                </td>

                <td>
                  <strong>{news.title}</strong>

                  <br />

                  <small>{news.slug}</small>
                </td>

                <td>
                  <DescriptionCell>{news.description}</DescriptionCell>
                </td>

                <td>{formatDate(news.date)}</td>

                <td>{newsCategoryLabels[news.category]}</td>

                <td>
                  <AdminBadge variant={news.isInternal ? "success" : "danger"}>
                    {news.isInternal ? "Sim" : "Não"}
                  </AdminBadge>
                </td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() => navigate(`/admin/noticias/${news.slug}`)}
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/noticias/${news.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(news)}
                    >
                      <FiTrash2 />
                    </AdminIconButton>
                  </Actions>
                </td>
              </tr>
            ))}
        </tbody>
      </AdminTable>

      {!loading && filteredNews.length === 0 && (
        <Empty>Nenhuma notícia encontrado.</Empty>
      )}
    </Container>
  );
}
