import { FiArrowUpRight, FiMail } from "react-icons/fi";
import { NewsletterForm } from "../../components/NewsletterForm";
import { SectionHeader } from "../../components/SectionHeader";
import { SocialLinks } from "../../components/SocialLinks";
import {
  ContactGrid,
  Container,
  Content,
  EmailCopy,
  EmailLink,
  Eyebrow,
  InfoPanel,
  Networks,
  PanelTitle,
} from "./styles";

const contactEmail = "leviataeocativeiro@gmail.com";

export function Contact() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Contato"
          subtitle="Ideias, dúvidas e novas conexões. Converse com o grupo sobre pesquisas, atividades e parcerias."
        />

        <ContactGrid>
          <InfoPanel aria-labelledby="contact-info-title">
            <Eyebrow>Leviatã e o Cativeiro</Eyebrow>
            <PanelTitle id="contact-info-title">Vamos conversar?</PanelTitle>
            <p>
              O diálogo também faz parte da pesquisa. Entre em contato para
              compartilhar ideias, propor colaborações ou conhecer melhor nossas
              atividades.
            </p>

            <EmailLink href={`mailto:${contactEmail}`}>
              <FiMail aria-hidden="true" />
              <EmailCopy>
                <span>Escreva para nós</span>
                <strong>{contactEmail}</strong>
              </EmailCopy>
              <FiArrowUpRight aria-hidden="true" />
            </EmailLink>

            <Networks>
              <h3>Encontre o grupo nas redes</h3>
              <p>Acompanhe nossas pesquisas, encontros e publicações.</p>
              <SocialLinks />
            </Networks>
          </InfoPanel>

          <NewsletterForm type="complete" />
        </ContactGrid>
      </Content>
    </Container>
  );
}
