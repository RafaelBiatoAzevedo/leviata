import { Links, SocialButton } from "./styles";

import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export const SocialLinks = () => {
  return (
    <Links>
      <SocialButton
        aria-label="Facebook do grupo Leviatã e o Cativeiro"
        href="https://www.facebook.com/leviataeocativeiro"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook />
      </SocialButton>

      <SocialButton
        aria-label="Instagram do grupo Leviatã e o Cativeiro"
        href="https://www.instagram.com/leviataeocativeiro"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram />
      </SocialButton>

      <SocialButton
        aria-label="YouTube do grupo Leviatã e o Cativeiro"
        href="https://www.youtube.com/@LeviataeoCativeiro"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaYoutube />
      </SocialButton>
    </Links>
  );
};
