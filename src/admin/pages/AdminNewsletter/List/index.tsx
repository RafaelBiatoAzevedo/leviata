import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/useModal";
import { useToast } from "../../../../hooks/useToast";
import { AdminButton } from "../../../components/AdminButton";
import { AdminDeleteContent } from "../../../components/AdminDeleteContent";
import { AdminIconButton } from "../../../components/AdminIconButton";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSearchBar } from "../../../components/AdminSearchBar";
import { AdminTable } from "../../../components/AdminTable";
import type { NewsletterResponseDto } from "../../../dtos/newsletter/NewsletterResponseDto";
import { newsletterService } from "../../../services/newsletter";
import { Actions, Container, Empty, Filters } from "./styles";

export function AdminNewsletters() {
  const [items, setItems] = useState<NewsletterResponseDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); const { showToast } = useToast(); const { showModal } = useModal();
  const load = useCallback(async () => {
    try { setLoading(true); setItems((await newsletterService.getAll()).data); }
    catch (error) { showToast({ title: "Erro ao carregar newsletters", description: error instanceof Error ? error.message : "Tente novamente.", type: "danger" }); }
    finally { setLoading(false); }
  }, [showToast]);
  useEffect(() => {
    newsletterService.getAll().then(({ data }) => setItems(data)).catch((error) => {
      showToast({ title: "Erro ao carregar newsletters", description: error instanceof Error ? error.message : "Tente novamente.", type: "danger" });
    }).finally(() => setLoading(false));
  }, [showToast]);
  const filtered = items.filter(({ title, subject }) => `${title} ${subject}`.toLowerCase().includes(search.toLowerCase()));
  const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value)) : "—";
  function remove(item: NewsletterResponseDto) { showModal({ title: "Excluir newsletter", content: <AdminDeleteContent title={item.title} />, confirmText: "Excluir", cancelText: "Cancelar", confirmVariant: "danger", onConfirm: async () => { await newsletterService.removeBySlug(item.slug); showToast({ title: "Newsletter excluída", description: item.title, type: "success" }); await load(); } }); }
  return <Container><AdminPageHeader title="Newsletters" subtitle="Gerencie as newsletters cadastradas."><AdminButton onClick={() => navigate("/admin/newsletter/novo")}><FiPlus />Nova newsletter</AdminButton></AdminPageHeader>
    <Filters><AdminSearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar newsletters..." /></Filters>
    <AdminTable><thead><tr><th>Título</th><th>Assunto</th><th>Publicação</th><th>Envio</th><th>Ações</th></tr></thead><tbody>{!loading && filtered.map(item => <tr key={item.id}><td><strong>{item.title}</strong><br/><small>{item.slug}</small></td><td>{item.subject}</td><td>{formatDate(item.publishedAt)}</td><td>{formatDate(item.sentAt)}</td><td><Actions><AdminIconButton title="Visualizar" onClick={() => navigate(`/admin/newsletter/${item.slug}`)}><FiEye /></AdminIconButton><AdminIconButton title="Editar" onClick={() => navigate(`/admin/newsletter/${item.slug}/editar`)}><FiEdit2 /></AdminIconButton><AdminIconButton title="Excluir" onClick={() => remove(item)}><FiTrash2 /></AdminIconButton></Actions></td></tr>)}</tbody></AdminTable>
    {!loading && filtered.length === 0 && <Empty>Nenhuma newsletter encontrada.</Empty>}
  </Container>;
}
