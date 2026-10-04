import { useState } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { AdminButton } from "../../components/AdminButton";
import { reportsService } from "../../services/reports";
import type { SummaryReportResponseDto } from "../../dtos/reports/SummaryReportResponseDto";
import {
  Container,
  Content,
  Title,
  Subtitle,
  WelcomeCard,
  WelcomeTitle,
  WelcomeText,
  ReportCard,
  ReportHeader,
  ReportGrid,
  ReportItem,
  ReportError,
} from "./styles";

export function AdminDashboard() {
  const [report, setReport] = useState<SummaryReportResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchReport() {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await reportsService.getSummary();
      setReport(data);
    } catch {
      setError("Não foi possível buscar o relatório. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Content>
        <Title>Painel Administrativo</Title>

        <Subtitle>
          Gerencie os conteúdos do portal Leviatã e o Cativeiro.
        </Subtitle>

        <WelcomeCard>
          <WelcomeTitle>Bem-vindo!</WelcomeTitle>

          <WelcomeText>
            Utilize o menu lateral para acessar os módulos administrativos do
            sistema.
          </WelcomeText>

          <WelcomeText>
            A partir deste painel é possível cadastrar e editar pesquisadores,
            publicações, livros, artigos, dossiês, notícias, eventos,
            instrumentos de pesquisa e demais conteúdos do portal.
          </WelcomeText>
        </WelcomeCard>

        <ReportCard aria-busy={loading}>
          <ReportHeader>
            <WelcomeTitle>Relatório do portal</WelcomeTitle>
            <AdminButton type="button" onClick={fetchReport} disabled={loading}>
              <FiBarChart2 aria-hidden="true" />
              {loading
                ? "Buscando..."
                : report
                  ? "Atualizar relatório"
                  : "Buscar relatório"}
            </AdminButton>
          </ReportHeader>

          <WelcomeText>
            Consulte os totais de conteúdos cadastrados. Registros excluídos e
            pesquisadores inativos não entram na contagem.
          </WelcomeText>

          {error && <ReportError role="alert">{error}</ReportError>}

          <div aria-live="polite">
            {report && (
              <>
                <WelcomeText>
                  {report.title} · Atualizado em{" "}
                  {new Date(report.generatedAt).toLocaleString("pt-BR")}
                </WelcomeText>
                <ReportGrid>
                  {report.items.map((item) => (
                    <ReportItem key={item.key}>
                      <dt>{item.label}</dt>
                      <dd>{item.total.toLocaleString("pt-BR")}</dd>
                    </ReportItem>
                  ))}
                </ReportGrid>
                <WelcomeText>
                  Total nas categorias acima:{" "}
                  <strong>{report.totalRecords.toLocaleString("pt-BR")}</strong>
                </WelcomeText>
              </>
            )}
          </div>
        </ReportCard>
      </Content>
    </Container>
  );
}
