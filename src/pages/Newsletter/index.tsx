import {
  Container,
  Content,
  NewslettersWrapper,
  YearBlock,
  YearTitle,
  NewsletterList,
  NewsletterItem,
  NewsletterInfo,
  NewsletterMonth,
  NewsletterActions,
  ActionButton,
} from "./styles";

import { FiDownload, FiExternalLink } from "react-icons/fi";

import { HistoryDivider } from "../../components/HistotyDivider";
import { NewsletterForm } from "../../components/NewsletterForm";
import { SectionHeader } from "../../components/SectionHeader";

const newslettersMock = [
  {
    year: 2026,
    items: [
      {
        month: "Janeiro",
        driveUrl: "#",
        pdfUrl: "#",
      },
      {
        month: "Fevereiro",
        driveUrl: "#",
        pdfUrl: "#",
      },
      {
        month: "Março",
        driveUrl: "#",
        pdfUrl: "#",
      },
      {
        month: "Abril",
        driveUrl: "#",
        pdfUrl: "#",
      },
      {
        month: "Maio",
        driveUrl: "#",
        pdfUrl: "#",
      },
      {
        month: "Junho",
        driveUrl: "#",
        pdfUrl: "#",
      },
    ],
  },

  {
    year: 2025,
    items: [
      {
        month: "Outubro",
        driveUrl: "#",
        pdfUrl: "#",
      },
      {
        month: "Novembro",
        driveUrl: "#",
        pdfUrl: "#",
      },
      {
        month: "Dezembro",
        driveUrl: "#",
        pdfUrl: "#",
      },
    ],
  },

  {
    year: 2024,
    items: [
      {
        month: "Agosto",
        driveUrl: "#",
        pdfUrl: "#",
      },
    ],
  },
];

export function Newsletter() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Newsletter"
          subtitle="Acompanhe os boletins informativos do grupo, reunindo notícias, atividades, pesquisas, eventos e reflexões produzidas no âmbito do Leviatã e o Cativeiro."
        />

        <NewslettersWrapper>
          {newslettersMock.map((year) => (
            <YearBlock key={year.year}>
              <YearTitle>{year.year}</YearTitle>

              <NewsletterList>
                {year.items.map((item, index) => (
                  <NewsletterItem key={index}>
                    <NewsletterInfo>
                      <NewsletterMonth>{item.month}</NewsletterMonth>
                    </NewsletterInfo>

                    <NewsletterActions>
                      <ActionButton href={item.driveUrl} target="_blank">
                        <FiExternalLink />
                        Visualizar
                      </ActionButton>

                      <ActionButton href={item.pdfUrl} download>
                        <FiDownload />
                        PDF
                      </ActionButton>
                    </NewsletterActions>
                  </NewsletterItem>
                ))}
              </NewsletterList>
            </YearBlock>
          ))}
        </NewslettersWrapper>

        <HistoryDivider />

        <NewsletterForm type="middle" />
      </Content>
    </Container>
  );
}
