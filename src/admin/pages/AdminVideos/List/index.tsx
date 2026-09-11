import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { Actions, Container, Empty, Filters } from "./styles";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import type { VideoResponseDto } from "../../../dtos/videos/VideoResponseDto";
import { videosService } from "../../../services/videos";

export function AdminVideos() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const [loading, setLoading] = useState(true);

  const [videos, setVideos] = useState<VideoResponseDto[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await videosService.getAll();

      setVideos(response.data);
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

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(search.toLowerCase()) ||
      video.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  function handleDelete(video: VideoResponseDto) {
    showModal({
      title: "Excluir video",

      content: <AdminDeleteContent title={video.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await videosService.removeBySlug(video.slug);

        showToast({
          title: "Video excluído",
          description: `${video.title.toUpperCase()}`,
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
        title="Videos"
        subtitle="Gerencie as videos cadastradas."
      >
        <AdminButton onClick={() => navigate("/admin/videos/novo")}>
          <FiPlus />
          Nova Video
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar videos..."
        />
      </Filters>

      <AdminTable>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
            <th>N° Participantes</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            filteredVideos.map((video) => (
              <tr key={video.id}>
                <td>
                  <strong>{video.title}</strong>

                  <br />

                  <small>{video.slug}</small>
                </td>

                <td>{video.description}</td>

                <td>{video.people.length}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() => navigate(`/admin/videos/${video.slug}`)}
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/videos/${video.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(video)}
                    >
                      <FiTrash2 />
                    </AdminIconButton>
                  </Actions>
                </td>
              </tr>
            ))}
        </tbody>
      </AdminTable>

      {!loading && filteredVideos.length === 0 && (
        <Empty>Nenhum video encontrada.</Empty>
      )}
    </Container>
  );
}
