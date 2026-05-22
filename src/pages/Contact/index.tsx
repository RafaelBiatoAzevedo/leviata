import { NewsletterForm } from "../../components/NewsletterForm";
import { SectionHeader } from "../../components/SectionHeader";
import { SocialLinks } from "../../components/SocialLinks";
import { Container, Content } from "./styles";

export function Contact() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Contato"
          subtitle="Entre em contato com o grupo para informações, parcerias, pesquisas ou esclarecimentos através do e-mail leviataeocativeiro@gmail.com, das redes sociais ou pelo formulário disponível abaixo."
        />

        <NewsletterForm type="complete" />
        <SocialLinks />
      </Content>
    </Container>
  );
}
