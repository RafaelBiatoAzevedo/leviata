import { AdminPagination } from "../../../components/AdminPagination";
import { AdminError } from "../../../components/AdminError";
import { useAdminList } from "../../../hooks/useAdminList";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  Actions,
  Container,
  Cover,
  CoverPlaceholder,
  Empty,
  Filters,
} from "./styles";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import { AdminTable } from "../../../components/AdminTable";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import type { JuryResponseDto } from "../../../dtos/juries/JuryResponseDto";
import { GiInjustice } from "react-icons/gi";
import { juriesService } from "../../../services/juries";
import { formatDate } from "../../../utils/formatDate";

export function AdminJuries() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const { items, loading, error, load, pagination } = useAdminList(
    juriesService.getPage,
    { search: search.trim() || undefined },
  );

  function handleDelete(jury: JuryResponseDto) {
    showModal({
      title: "Excluir júri",

      content: <AdminDeleteContent title={jury.title} />,

      confirmText: "Excluir",

      cancelText: "Cancelar",

      confirmVariant: "danger",

      onConfirm: async () => {
        await juriesService.removeBySlug(jury.slug);

        showToast({
          title: "Júri excluído",
          description: `${jury.title.toUpperCase()}`,
          type: "success",
        });

        load();
      },

      onCancel: () => {
        console.log("Cancelou");
      },
    });
  }

  const calculateMembers = (juri: JuryResponseDto) => {
    const totalJudges = juri.judges.length;
    const totalJurors = juri.jurors.length;
    const totalDefenders = juri.defenders.length;
    const totalProsecutors = juri.prosecutors.length;
    const totalBailiffs = juri.bailiffs.length;

    return (
      totalJudges +
      totalJurors +
      totalDefenders +
      totalProsecutors +
      totalBailiffs
    );
  };

  return (
    <Container>
      <AdminPageHeader title="Júris" subtitle="Gerencie os júris cadastrados.">
        <AdminButton onClick={() => navigate("/admin/juris/novo")}>
          <FiPlus />
          Novo Júri
        </AdminButton>
      </AdminPageHeader>

      <Filters>
        <AdminSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar júris..."
        />
      </Filters>

      {error && <AdminError>{error}</AdminError>}
      <AdminTable>
        <thead>
          <tr>
            <th>Capa</th>
            <th>Título</th>
            <th>Data</th>
            <th>N° Participantes</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            items.map((jury) => (
              <tr key={jury.id}>
                <td>
                  {jury.coverUrl ? (
                    <Cover src={jury.coverUrl} alt={jury.title} />
                  ) : (
                    <CoverPlaceholder>
                      <GiInjustice />
                    </CoverPlaceholder>
                  )}
                </td>

                <td>
                  <strong>{jury.title}</strong>

                  <br />

                  <small>{jury.slug}</small>
                </td>

                <td>{formatDate(jury.date)}</td>

                <td>{calculateMembers(jury)}</td>

                <td>
                  <Actions>
                    <AdminIconButton
                      title="Visualizar"
                      onClick={() => navigate(`/admin/juris/${jury.slug}`)}
                    >
                      <FiEye />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/juris/${jury.slug}/editar`)
                      }
                    >
                      <FiEdit2 />
                    </AdminIconButton>

                    <AdminIconButton
                      title="Excluir"
                      onClick={() => handleDelete(jury)}
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
        <Empty>Nenhum júri encontrado.</Empty>
      )}
    </Container>
  );
}
