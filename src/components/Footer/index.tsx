import {
  Copy,
  Container,
  Content,
  ContentWrapper,
  BackTopButton,
  Logo,
  TitleWrapper,
} from "./styles";
import { SocialLinks } from "../../components/SocialLinks";
import { FiArrowUp } from "react-icons/fi";
import leviataLogo from "../../assets/images/leviataLogo.png";
import { NewsletterForm } from "../NewsletterForm";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Container id="contact">
      <BackTopButton onClick={scrollToTop} aria-label="Voltar ao topo">
        <FiArrowUp />
      </BackTopButton>

      <ContentWrapper>
        <Content>
          <Logo src={leviataLogo} alt="Leviatã e o Cativeiro" />

          <TitleWrapper>
            <h2>
              Criado em 2019, o grupo de pesquisa “Leviatã e o Cativeiro” reúne
              pesquisadores em torno do binômio temático Estado Moderno e
              escravidão.
            </h2>
          </TitleWrapper>

          <NewsletterForm type="single" size="small" />
        </Content>

        <SocialLinks />
        <Copy>© {new Date().getFullYear()} Leviatã e o Cativeiro</Copy>
      </ContentWrapper>
    </Container>
  );
};
